# LookMe — Architecture du Cycle de Vie des Tâches & Anti-Fraude

**Rôle** : Architecte Cyber-Sécurité / Développeur Backend Senior  
**Date** : 2026-05-17  
**Statut** : Plan d'architecture + Audit de sécurité + Correctifs à appliquer

---

## 1. État des lieux — Verdict d'Audit

Le projet LookMe dispose déjà d'une base anti-fraude solide, mais **3 failles critiques** et **2 incohérences majeures** doivent être corrigées avant production.

### ✅ Ce qui existe et fonctionne
- **Schéma Prisma** complet : `Task`, `TaskProof`, `WorkerEmailUsage`, `WorkerViewHistory`, `Wallet`, `Transaction`, `TrustScore`, `AuditLog`
- **HMAC Media Session** (`services/task/src/utils/hmac-session.ts`) : tokens signés pour prouver l'ouverture du lecteur
- **SecureMediaPlayer** (`apps/web-client/src/components/worker/SecureMediaPlayer.tsx`) : lecteur YouTube avec anti-seek, anti-mute, anti-tab-switch
- **Anti-Fraud Middleware** (`services/task/src/middleware/anti-fraud.middleware.ts`) : 3 couches (email, device fingerprint, worker-order)
- **Bot Detection** (`services/task/src/middleware/bot-detection.middleware.ts`) : temps minimum, taille screenshot, hash SHA-256
- **Random Audit Service** (`services/task/src/services/random-audit.service.ts`) : logique 5% prête
- **Pending Balance Service** (`services/task/src/services/pending-balance.service.ts`) : hold 24h + cron release

### 🚨 Ce qui est brisé ou dangereux
1. **Race Condition sur `acceptTask`** : `task.service.v2.ts` utilise `tx.task.update({ where: { id } })` au lieu de `updateMany({ where: { id, status: AVAILABLE, workerId: null } })`. **100 workers peuvent verrouiller la même tâche simultanément.**
2. **Contournement API Postman sur les vues médias** : `task.service.v2.ts` ne vérifie **pas** le `mediaSessionToken`. Pire : même la v1 fait confiance au `duration` envoyé par le frontend. Un attaquant obtient un token valide, attend 45s, et appelle `/tasks/submit` avec `duration=45` sans jamais regarder la vidéo.
3. **Double Paiement potentiel** : `task.service.ts` (v1) crée une transaction `REWARD` dans `submitProof` (auto-approve) ET dans `reviewProof`. Bien que `existingTx` bloque, le check n'est pas assez strict (pas de filtre sur `status: PENDING`).
4. **Orphelin V2** : Le controller `task.controller.ts` instancie `TaskService` (v1), pas `TaskServiceV2`. La v2 n'est jamais utilisée en production, ce qui crée une divergence de logique.
5. **Index manquants** : Pas d'index `[workerId, status]` sur `Task` (performances feed), pas d'index `[ipAddress, targetUrl]` sur `WorkerViewHistory` (détection fermes de clic).
6. **Ancien lecteur non sécurisé** : `TaskViewer.tsx` (composant iframe simple) coexiste avec `SecureMediaPlayer.tsx`. Il permet de contourner tout le système HMAC.

---

## 2. STEP 1 — Flux de Vie de la Tâche (Client → Worker)

### 2.1 Création des micro-tâches depuis une Order

Quand un client paie une commande (`Order.status = PAID`), le `order-service` publie un événement (ou appelle directement le `task-service`) pour déclencher la création des micro-tâches.

```
Order (quantity = 100 followers)
    └── Task[0..99] — status: AVAILABLE
```

**Logique de génération** :
- Chaque unité de la commande génère une `Task` individuelle
- `rewardAmount` = `Order.workerReward`
- `targetUrl` = extrait et normalisé (ex: `https://youtube.com/watch?v=ABC123`)
- `instructions` = héritées du `ServiceType`
- `expiresAt` = null (tant que non assignée)
- `scheduledFor` = réparti selon le `dailyLimit` de l'Order (pacing)

### 2.2 Attribution & Lock Atomique (Anti Race-Condition)

**Problème** : Quand 100 workers cliquent "Accepter" en même temps sur la même tâche, la base de données doit garantir qu'un seul obtient le verrou.

**Solution** : Requête `updateMany` atomique avec conditions de concurrence (optimistic locking).

```typescript
// CORRECT (v1 actuel — à conserver)
const claimed = await tx.task.updateMany({
  where: { id: taskId, status: "AVAILABLE", workerId: null },
  data: {
    workerId,
    status: "ASSIGNED",
    assignedAt: now,
    expiresAt: new Date(now.getTime() + 20 * 60 * 1000), // 20 min
    ...(isReview ? { workerEmail } : {}),
    ...(deviceFingerprint ? { deviceFingerprint } : {}),
  },
});

if (claimed.count === 0) {
  throw AppError.conflict("TASK_ALREADY_TAKEN", "...");
}
```

**Note** : `TaskServiceV2.assignTaskToWorker` utilise `tx.task.update({ where: { id } })` qui est **incorrect** et doit être corrigé immédiatement.

### 2.3 Libération automatique (Cron)

```typescript
// Toutes les 5 minutes
async function releaseExpiredTasks() {
  const now = new Date();
  const expired = await prisma.task.findMany({
    where: { status: "ASSIGNED", expiresAt: { lt: now } },
  });

  await prisma.$transaction(
    expired.map(t => prisma.task.update({
      where: { id: t.id },
      data: {
        status: "AVAILABLE",
        workerId: null,
        assignedAt: null,
        expiresAt: null,
        workerEmail: null,
        deviceFingerprint: null,
      },
    }))
  );

  // Pénalité trust score
  for (const t of expired) {
    await TrustScoreService.penalizeExpired(t.workerId!, t.id);
  }
}
```

### 2.4 Machine à états (State Machine)

```
AVAILABLE ──[accept]──> ASSIGNED ──[submit]──> SUBMITTED
    │                        │                      │
    │                        │                      │
    │                   [expire]                [reject]
    │                        │                      │
    └──────<──────<──────<──┘                      │
                                                   │
    ┌──────────────────────────────────────────────┘
    │
SUBMITTED ──[admin review: VERIFIED]──> VERIFIED ──[hold expires]──> PAID
    │
    └─[admin review: REJECTED]──> AVAILABLE (retour au feed)

AUTO-APPROVE (followers/views/timer):
ASSIGNED ──[submit valide]──> VERIFIED ──[hold expires]──> PAID
```

---

## 3. STEP 2 — Anti-Fraude Strict pour les Reviews

### 3.1 Taux de Rétention (Hold Balance)

Les avis Google/Yelp peuvent être supprimés par les algorithmes jusqu'à 14 jours après publication. L'argent du worker doit être bloqué pendant cette période.

| Type de tâche | Trust Score | Hold Period |
|---------------|-------------|-------------|
| Review        | < 50        | 14 jours    |
| Review        | 50-79       | 10 jours    |
| Review        | ≥ 80        | 7 jours     |
| Followers     | < 50        | 48 heures   |
| Followers     | ≥ 50        | 24 heures   |
| Views/Traffic | Tous        | 24 heures   |

**Logique** (déjà implémentée dans `task.service.ts:616-619`) :
```typescript
const holdHours = isReviewTask
  ? (score >= 80 ? 7 * 24 : score >= 50 ? 10 * 24 : 14 * 24)
  : (score >= 80 ? 24 : score >= 50 ? 36 : 48);
```

Le cron `releaseHeldPayments` (toutes les heures) déplace `pendingBalance` → `balance` quand `expiresAt <= now()`.

### 3.2 Soumission de Preuve

Pour les reviews, le worker doit fournir :
1. **Nom de profil public** utilisé pour poster l'avis (ex: `johndoe2024`)
2. **Capture d'écran** du review publié (upload S3/Cloudinary)
3. **Hash du fichier** (SHA-256) pour détection de doublons

**Route** : `POST /tasks/submit`
```typescript
interface SubmitProofInput {
  taskId: string;
  proofText: string;        // nom du profil public
  screenshotUrl?: string;    // URL S3
  proofUrl?: string;         // lien direct vers l'avis publié
  mediaSessionToken?: string;
  duration?: number;
}
```

### 3.3 Détection de Doublons (Screenshot Hash)

```typescript
// Dans bot-detection.middleware.ts (déjà implémenté)
const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

const existing = await prisma.taskProof.findFirst({
  where: { screenshotHash: fileHash, taskId: { not: taskId } },
});

if (existing) {
  throw AppError.badRequest(
    'DUPLICATE_SCREENSHOT',
    'Cette capture a déjà été uploadée par un autre worker.'
  );
}
```

---

## 4. STEP 3 — Lecteur Sécurisé & Anti-Fraude Médias

### 4.1 Architecture Heartbeat (Anti-Postman)

**Faille actuelle** : Le backend fait confiance au `duration` envoyé par le frontend. Un attaquant avec Postman peut forger un `mediaSessionToken` valide et soumettre `duration=99999`.

**Solution** : Le backend maintient sa propre session de lecture via un **heartbeat réseau**. Le chronomètre du frontend est purement décoratif ; la source de vérité est la base de données.

#### Nouveau modèle : `MediaSession`

```prisma
model MediaSession {
  id                String   @id @default(cuid())
  taskId            String   @unique
  workerId          String
  token             String   @unique   // HMAC token éphémère
  startedAt         DateTime @default(now())
  lastHeartbeatAt   DateTime @default(now())
  activeSeconds     Int      @default(0)
  status            String   @default("ACTIVE") // ACTIVE, PAUSED, COMPLETED, EXPIRED
  ipAddress         String?
  userAgent         String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  task              Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([workerId])
  @@index([token])
  @@index([status, lastHeartbeatAt])
  @@map("media_sessions")
}
```

#### Route Heartbeat : `POST /tasks/heartbeat`

```typescript
async function heartbeat(
  workerId: string,
  body: { taskId: string; sessionToken: string; playerState: "PLAYING" | "PAUSED" | "ENDED" }
) {
  // 1. Vérifier le token HMAC
  const session = verifyMediaSessionToken(body.sessionToken, body.taskId, workerId);

  // 2. Récupérer la session DB
  const dbSession = await prisma.mediaSession.findUnique({
    where: { taskId: body.taskId },
  });
  if (!dbSession || dbSession.status === "EXPIRED") {
    throw AppError.badRequest("SESSION_EXPIRED", "Session expirée ou invalide");
  }

  // 3. Calculer le temps écoulé depuis le dernier heartbeat
  const now = Date.now();
  const elapsedSec = Math.floor((now - dbSession.lastHeartbeatAt.getTime()) / 1000);
  const clampedElapsed = Math.min(elapsedSec, 10); // Anti-triche : max 10s par heartbeat

  // 4. Accumuler uniquement si PLAYING
  let newActiveSeconds = dbSession.activeSeconds;
  if (body.playerState === "PLAYING" && dbSession.status === "ACTIVE") {
    newActiveSeconds += clampedElapsed;
  }

  // 5. Mettre à jour
  const updated = await prisma.mediaSession.update({
    where: { id: dbSession.id },
    data: {
      activeSeconds: newActiveSeconds,
      lastHeartbeatAt: new Date(now),
      status: body.playerState === "PAUSED" ? "PAUSED" : body.playerState === "ENDED" ? "COMPLETED" : "ACTIVE",
    },
  });

  const requiredSeconds = session.requiredSeconds;
  const isComplete = updated.activeSeconds >= requiredSeconds;

  return { activeSeconds: updated.activeSeconds, requiredSeconds, isComplete };
}
```

**Fréquence heartbeat** : toutes les **5 secondes** pendant la lecture. Si pas de heartbeat pendant 15s, la session passe en `PAUSED`.

### 4.2 Intégration Frontend (SecureMediaPlayer)

Le composant `SecureMediaPlayer.tsx` doit être modifié pour envoyer des heartbeats.

```typescript
// Extrait de logique à injecter dans SecureMediaPlayer.tsx
useEffect(() => {
  if (!isPlaying) return;
  const beat = setInterval(() => {
    apiPost("/tasks/heartbeat", {
      taskId,
      sessionToken,
      playerState: "PLAYING",
    });
  }, 5000);
  return () => clearInterval(beat);
}, [isPlaying, taskId, sessionToken]);

// On pause
const stopTimer = useCallback(() => {
  apiPost("/tasks/heartbeat", { taskId, sessionToken, playerState: "PAUSED" });
  // ... existing stop logic
}, [taskId, sessionToken]);
```

### 4.3 Soumission automatique (Anti-triche renforcée)

Quand le worker clique "Valider" :

```typescript
// Backend : submitProof pour timer tasks
if (isTimerTask) {
  if (!input.mediaSessionToken) {
    throw AppError.badRequest("MEDIA_SESSION_REQUIRED", "...");
  }

  verifyMediaSessionToken(input.mediaSessionToken, input.taskId, workerId);

  // SOURCE DE VÉRITÉ : la base de données, pas le frontend
  const dbSession = await prisma.mediaSession.findUnique({
    where: { taskId: input.taskId },
  });

  if (!dbSession) {
    throw AppError.badRequest("NO_MEDIA_SESSION", "Aucune session de lecture trouvée");
  }

  const backendDuration = dbSession.activeSeconds;
  const requiredSeconds = task.order.serviceType.minViewDuration ?? 30;

  if (backendDuration < requiredSeconds) {
    throw AppError.badRequest(
      "INSUFFICIENT_WATCH_TIME",
      `Temps de lecture réel: ${backendDuration}s. Requis: ${requiredSeconds}s.`
    );
  }

  // Invalider le token pour éviter réutilisation
  await prisma.mediaSession.update({
    where: { taskId: input.taskId },
    data: { status: "EXPIRED", token: "USED_" + dbSession.token },
  });
}
```

### 4.4 Événements de Verrouillage (Frontend)

| Événement | Action Frontend | Action Backend (heartbeat) |
|-----------|-----------------|----------------------------|
| `onStateChange` → PLAYING | Démarrer timer visuel | `playerState: PLAYING` → accumulate |
| `onStateChange` → PAUSED | Stopper timer visuel | `playerState: PAUSED` → freeze |
| `document.hidden` = true | Pause + overlay rouge | Pas de heartbeat → auto-PAUSED après 15s |
| `player.isMuted()` | Pause immédiate | `playerState: PAUSED` |
| `seeking` (jump > 2.5s) | Rewind + warning | `playerState: PAUSED` |

---

## 5. STEP 4 — Route Admin & Audit Aléatoire (5%)

### 5.1 File d'attente Admin

**Route** : `GET /api/admin/audit/queue`

```typescript
async function getAuditQueue(page = 1, limit = 20) {
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: {
        OR: [
          { status: "SUBMITTED" },                    // Reviews en attente
          { status: "VERIFIED", ipAddress: "AUDIT" }, // Auto-approved sélectionnés
        ],
      },
      include: {
        proof: true,
        worker: { select: { id: true, email: true, profile: { select: { country: true } } } },
        order: { include: { serviceType: { include: { platform: true, category: true } } } },
      },
      orderBy: { submittedAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.task.count({
      where: {
        OR: [
          { status: "SUBMITTED" },
          { status: "VERIFIED", ipAddress: "AUDIT" },
        ],
      },
    }),
  ]);

  return { tasks, total, page, limit, totalPages: Math.ceil(total / limit) };
}
```

### 5.2 Algorithme d'Audit 5%

Lors de la soumission d'une preuve, si la tâche est éligible à l'auto-approve :

```typescript
// Dans submitProof / determineApproval
const shouldAutoApprove = (isFollowers && score >= 50) || (isTimerTask && backendDuration >= requiredSeconds);

if (shouldAutoApprove) {
  // 5% des tâches auto-approuvées vont quand même à l'admin
  const requiresAudit = Math.random() < 0.05;

  if (requiresAudit) {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "VERIFIED",     // Marquée comme conforme par le système
        ipAddress: "AUDIT",     // Flag pour l'admin queue
        userAgent: JSON.stringify({
          reason: "RANDOM_AUDIT_5PCT",
          autoApproved: true,
          backendDuration,
          trustScore: score,
        }),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "task.random_audit_selected",
        entity: "task",
        entityId: taskId,
        newValue: { reason: "5% random sample" },
      },
    });

    return { status: "VERIFIED", auditFlag: true };
  }
}
```

**Pourquoi `ipAddress = "AUDIT"`** ? C'est un flag technique rapide pour la requête Prisma. En production, utiliser un champ dédié `auditFlag: Boolean @default(false)` sur `Task`.

### 5.3 Validation Admin (Double vérification)

Quand l'admin rejette une tâche auditée :

```typescript
if (isRejected && wasRandomAudit) {
  // BAN INSTANTANÉ + FORFAIT
  await TrustScoreService.penalizeFailedAudit(workerId, taskId, reason);
}
```

---

## 6. Security Audit — Failles Identifiées & Corrections

### 6.1 Failles Critiques

#### Faille CR-01 : Race Condition sur Accept (TOCTOU)
- **Localisation** : `task.service.v2.ts:488-500`
- **Description** : `tx.task.update({ where: { id } })` ne vérifie pas que la tâche est encore `AVAILABLE`. En concurrence, plusieurs workers peuvent obtenir `ASSIGNED` pour la même tâche.
- **Correction** : Utiliser `tx.task.updateMany({ where: { id, status: "AVAILABLE", workerId: null } })` comme dans la v1.
- **Impact** : Élevé — perte financière si une tâche est payée plusieurs fois.

#### Faille CR-02 : Contournement API sur les Vues Médias (Postman)
- **Localisation** : `task.service.v2.ts:submitProof` + `SecureMediaPlayer.tsx`
- **Description** : Le backend vérifie le `mediaSessionToken` (preuve d'ouverture) mais fait confiance au `duration` envoyé par le frontend. Un attaquant ouvre la page, copie le token, ferme le navigateur, attend 45s, et soumet via Postman.
- **Correction** : Implémenter `MediaSession` avec heartbeat backend (Section 4.1). Le backend lit `activeSeconds` de SA propre DB.
- **Impact** : Critique — fraude massive sur les vues YouTube/Spotify sans effort.

#### Faille CR-03 : Double Paiement potentiel
- **Localisation** : `task.service.ts:373-419` (submitProof) + `task.service.ts:606-647` (reviewProof)
- **Description** : Si une tâche auto-approuvée est soumise, une transaction `REWARD` est créée. Si un admin appelle `reviewProof` sur la même tâche (via bulk review), `existingTx` est sensé bloquer, mais le check ne filtre pas `status: PENDING`. Si la transaction est déjà `COMPLETED` (après hold), un second paiement pourrait passer.
- **Correction** : Vérifier `task.status !== "SUBMITTED"` au début de `reviewProof`, et s'assurer que `existingTx` filtre sur `status: "PENDING"`.
- **Impact** : Moyen — nécessite action admin malveillante ou bug.

### 6.2 Failles Moyennes

#### Faille MD-01 : Device Fingerprint Faible
- **Localisation** : `my-tasks/[id]/page.tsx:483-496`
- **Description** : `buildDeviceFingerprint()` utilise `btoa(navigator.userAgent + screen.width + ...)`. C'est facilement falsifiable avec un simple changement de User-Agent.
- **Correction** : Utiliser une bibliothèque comme `fingerprintjs` côté frontend, ou mieux : combiner avec `IP + User-Agent + Accept-Language` côté backend. Le device fingerprint frontend ne doit être qu'**une** couche parmi d'autres.

#### Faille MD-02 : Pas de Rate Limit sur Heartbeat
- **Description** : Si on implémente le heartbeat, un bot pourrait spammer `/tasks/heartbeat` pour accumuler du temps instantanément.
- **Correction** : Valider que `elapsedSec <= 10` (déjà prévu dans Section 4.1). Ajouter un rate limiter Redis : max 1 heartbeat / 4 secondes par `taskId+workerId`.

#### Faille MD-03 : Incohérence V1 / V2
- **Localisation** : `task.controller.ts`
- **Description** : Le controller utilise `TaskService` (v1). `TaskServiceV2` est importé mais jamais utilisé. Les nouvelles features sont dans V2, les fixes critiques dans V1.
- **Correction** : **Supprimer `task.service.v2.ts`** et fusionner ses bonnes idées (configs par catégorie) dans `task.service.ts`. Un seul service source de vérité.

### 6.3 Index Manquants

```prisma
// Sur model Task
@@index([workerId, status])           // worker dashboard, stats
@@index([status, assignedAt])         // bot detection timer
@@index([status, ipAddress])          // audit queue fast lookup

// Sur model WorkerViewHistory
@@index([ipAddress, targetUrl])       // détection fermes de clic (même IP, même URL)
@@index([viewedAt])                   // purge anciennes données

// Sur model WorkerEmailUsage
@@index([ipAddress, targetUrl])       // détection VPN partagé

// Sur model TaskProof
@@index([screenshotHash, status])     // duplicate detection + status filtre
```

---

## 7. Schémas de Base de Données (Diff Prisma)

### Ajout du modèle `MediaSession`

```prisma
model MediaSession {
  id                String   @id @default(cuid())
  taskId            String   @unique
  workerId          String
  token             String   @unique
  startedAt         DateTime @default(now())
  lastHeartbeatAt   DateTime @default(now())
  activeSeconds     Int      @default(0)
  status            String   @default("ACTIVE")
  ipAddress         String?
  userAgent         String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  task              Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([workerId])
  @@index([token])
  @@index([status, lastHeartbeatAt])
  @@map("media_sessions")
}
```

### Modifications sur `Task`

```prisma
model Task {
  // ... champs existants ...

  mediaSession    MediaSession?

  @@index([workerId, status])
  @@index([status, assignedAt])
  @@index([status, ipAddress])
}
```

### Modifications sur `TaskProof`

```prisma
model TaskProof {
  // ... champs existants ...
  mediaSessionId  String?   // lien optionnel vers MediaSession
  // ...

  @@index([screenshotHash, status])
}
```

### Modifications sur `WorkerViewHistory`

```prisma
model WorkerViewHistory {
  // ... champs existants ...

  @@index([ipAddress, targetUrl])
  @@index([viewedAt])
}
```

---

## 8. Logique des Routes API

### 8.1 Routes Worker

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/tasks/feed` | Liste les tâches disponibles (filtré anti-fraud) |
| `POST` | `/tasks/accept` | Attribue une tâche (atomic updateMany) |
| `POST` | `/tasks/heartbeat` | Nouveau — heartbeat lecture média |
| `POST` | `/tasks/media-session` | Crée une session HMAC pour timer tasks |
| `POST` | `/tasks/submit` | Soumet la preuve (vérifie HMAC + DB duration) |
| `POST` | `/tasks/upload-screenshot` | Upload S3 avec validation bot-detection |
| `GET` | `/tasks/mine` | Tâches du worker |
| `GET` | `/tasks/stats` | Stats du worker |
| `GET` | `/tasks/:id` | Détail d'une tâche |

### 8.2 Routes Admin

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/tasks/admin/audit/queue` | File d'attente audit (SUBMITTED + flag AUDIT) |
| `POST` | `/tasks/review` | Approuve/Rejette une preuve |
| `POST` | `/tasks/bulk-review` | Approuve/Rejette en batch (max 100) |
| `POST` | `/tasks/release-expired` | Libère les tâches expirées (cron) |

### 8.3 Implémentation clé : `acceptTask` (corrigée)

```typescript
async acceptTask(workerId: string, taskId: string, workerEmail?: string, deviceFingerprint?: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { order: { include: { serviceType: { include: { category: true } } } } },
  });

  if (!task) throw AppError.notFound("TASK_NOT_FOUND");
  if (task.status !== "AVAILABLE") throw AppError.badRequest("TASK_NOT_AVAILABLE");

  // Max 3 actives
  const activeCount = await prisma.task.count({ where: { workerId, status: "ASSIGNED" } });
  if (activeCount >= 3) throw AppError.badRequest("TASK_LIMIT_REACHED");

  const isReview = task.order.serviceType.category.slug === "reviews";
  const isTrafficTask = ["views", "traffic", "visits"].includes(task.order.serviceType.category.slug);

  // Anti-fraud checks (avant la transaction)
  if (isTrafficTask) { /* check WorkerViewHistory */ }
  if (isReview) { /* check email, device, worker-order */ }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 20 * 60 * 1000);

  const updated = await prisma.$transaction(async (tx) => {
    // ATOMIC CLAIM — TOCTOU FIX
    const claimed = await tx.task.updateMany({
      where: { id: taskId, status: "AVAILABLE", workerId: null },
      data: {
        workerId,
        status: "ASSIGNED",
        assignedAt: now,
        expiresAt,
        ...(isReview && workerEmail ? { workerEmail } : {}),
        ...(deviceFingerprint ? { deviceFingerprint } : {}),
      },
    });

    if (claimed.count === 0) {
      throw AppError.conflict("TASK_ALREADY_TAKEN", "...");
    }

    const updatedTask = await tx.task.findUnique({ where: { id: taskId } });

    if (isReview && workerEmail) {
      await tx.workerEmailUsage.create({
        data: { workerId, email: workerEmail, targetUrl: task.targetUrl, orderId: task.orderId, taskId, deviceFingerprint },
      });
    }

    return updatedTask;
  });

  return updated!;
}
```

### 8.4 Implémentation clé : `createMediaSession` (corrigée)

```typescript
async createMediaSession(workerId: string, taskId: string, reqIp: string, reqUA: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { order: { include: { serviceType: true } } },
  });

  if (!task) throw AppError.notFound("TASK_NOT_FOUND");
  if (task.workerId !== workerId) throw AppError.forbidden("Not your task");
  if (task.status !== "ASSIGNED") throw AppError.badRequest("TASK_NOT_ACTIVE");

  const requiredSeconds = task.order.serviceType.minViewDuration ?? 30;

  // Invalider ancienne session si existe
  await prisma.mediaSession.deleteMany({ where: { taskId } });

  const token = createMediaSessionToken({
    taskId, workerId, issuedAt: Date.now(), requiredSeconds,
    mediaType: detectMediaType(task.targetUrl),
  });

  await prisma.mediaSession.create({
    data: {
      taskId, workerId, token, ipAddress: reqIp, userAgent: reqUA,
      activeSeconds: 0, status: "ACTIVE",
    },
  });

  return { sessionToken: token, requiredSeconds, mediaType: detectMediaType(task.targetUrl) };
}
```

---

## 9. Plan de Build (Ordre d'Implémentation)

### Phase 1 : Fondations DB & Core (Jour 1)
1. Ajouter le modèle `MediaSession` au schéma Prisma
2. Ajouter les index manquants sur `Task`, `WorkerViewHistory`, `TaskProof`
3. Générer et appliquer la migration Prisma
4. Supprimer `task.service.v2.ts` (orphelin)

### Phase 2 : Correction Race Condition (Jour 1)
5. Dans `task.service.ts`, s'assurer que `acceptTask` utilise `updateMany` atomique
6. Ajouter la validation `trustScore` avant accept (bloquer les banned)

### Phase 3 : Heartbeat & Lecteur Sécurisé (Jour 2)
7. Implémenter la route `POST /tasks/heartbeat`
8. Modifier `SecureMediaPlayer.tsx` pour envoyer les heartbeats
9. Supprimer `TaskViewer.tsx` (composant obsolète/non sécurisé)
10. Modifier `submitProof` pour lire `activeSeconds` depuis `MediaSession`

### Phase 4 : Anti-Fraude Reviews (Jour 2-3)
11. S'assurer que `botDetectionMiddleware` est bien branché sur `POST /tasks/upload-screenshot`
12. Vérifier que `screenshotHash` (SHA-256) est stocké et checké
13. Configurer les hold periods dynamiques (7-14j reviews)
14. Implémenter / vérifier le cron `releaseHeldPayments`

### Phase 5 : Audit Admin 5% (Jour 3)
15. Créer / corriger `GET /tasks/admin/audit/queue`
16. Intégrer la logique `Math.random() < 0.05` dans `submitProof`
17. Implémenter la pénalité `penalizeFailedAudit` (ban + forfait)

### Phase 6 : Tests & Hardening (Jour 4)
18. Test de charge : 100 workers cliquent sur 1 tâche (vérifier que 1 seul gagne)
19. Test Postman : soumettre `/tasks/submit` sans heartbeat → doit échouer
20. Test Postman : soumettre avec token valide mais duration falsifiée → doit échouer
21. Audit manuel de la file admin

---

## 10. Résumé des fichiers à modifier

| Fichier | Action |
|---------|--------|
| `packages/database/prisma/schema.prisma` | Ajouter `MediaSession`, index manquants |
| `services/task/src/services/task.service.ts` | Corriger `acceptTask` (atomic), intégrer heartbeat, supprimer double-paiement |
| `services/task/src/services/task.service.v2.ts` | **SUPPRIMER** |
| `services/task/src/controllers/task.controller.ts` | Ajouter `heartbeat()`, corriger `mediaSession()` |
| `services/task/src/routes/task.routes.ts` | Ajouter `POST /heartbeat` |
| `services/task/src/utils/hmac-session.ts` | Conserver tel quel (déjà correct) |
| `apps/web-client/src/components/worker/SecureMediaPlayer.tsx` | Ajouter heartbeat toutes les 5s |
| `apps/web-client/src/components/TaskViewer.tsx` | **SUPPRIMER** |
| `services/task/src/middleware/bot-detection.middleware.ts` | S'assurer branché sur upload route |
| `services/task/src/services/pending-balance.service.ts` | Vérifier cron job actif |
| `services/task/src/services/random-audit.service.ts` | Fusionner dans `task.service.ts` |

---

*Fin du document. Ce plan doit être exécuté intégralement avant mise en production du module Worker/Task.*
