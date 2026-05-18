# LookMe — Social Engagement Marketplace

A SaaS platform connecting **clients** who want social media engagement (likes, views, followers, reviews) with **testers** who complete tasks and earn rewards.

## Architecture

- **Monorepo** — Turborepo + pnpm workspaces
- **Backend** — Express microservices (MVC+S pattern)
- **Database** — PostgreSQL + Prisma ORM
- **Cache** — Redis
- **Auth** — JWT (access + refresh tokens) with RBAC
- **Validation** — Zod (shared FE/BE)
- **Frontend** — Next.js 14 (planned)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full system blueprint.

---

## Quick Start

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 8
- Docker & Docker Compose

### 1. Clone & Install

```bash
git clone <repo-url> lookme && cd lookme
pnpm install
```

### 2. Start Infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL (port 5432) and Redis (port 6379).

### 3. Environment

```bash
cp .env.example .env
# Edit .env with your secrets (JWT keys, Stripe keys, etc.)
```

### 4. Database Setup

```bash
pnpm db:generate   # Generate Prisma client
pnpm db:push       # Push schema to database
```

### 5. Run All Services

```bash
pnpm dev
```

Or run individual services:

```bash
pnpm --filter @lookme/api-gateway dev
pnpm --filter @lookme/auth-service dev
pnpm --filter @lookme/campaign-service dev
pnpm --filter @lookme/task-service dev
pnpm --filter @lookme/wallet-service dev
```

---

## Project Structure

```
lookme/
├── apps/
│   └── api/                    # API Gateway (port 4000)
├── services/
│   ├── auth/                   # Auth service (port 5001)
│   ├── campaign/               # Campaign service (port 5002)
│   ├── task/                   # Task engine (port 5003)
│   └── wallet/                 # Wallet service (port 5007)
├── packages/
│   ├── config/                 # Environment config loader
│   ├── database/               # Prisma schema & client
│   ├── logger/                 # Pino logger
│   ├── types/                  # Shared TypeScript interfaces
│   ├── utils/                  # Common utilities
│   └── validation/             # Zod schemas (shared FE/BE)
├── docker-compose.yml          # PostgreSQL + Redis
├── ARCHITECTURE.md             # Full system design
└── turbo.json                  # Turborepo config
```

---

## Service Ports

| Service         | Port |
| --------------- | ---- |
| API Gateway     | 4000 |
| Auth            | 5001 |
| Campaign        | 5002 |
| Task Engine     | 5003 |
| Execution       | 5004 |
| Verification    | 5005 |
| Matching        | 5006 |
| Wallet          | 5007 |
| Analytics       | 5008 |

---

## API Endpoints

### Auth (`/api/v1/auth`)
- `POST /register` — Create account
- `POST /login` — Get tokens
- `POST /refresh` — Refresh access token
- `POST /logout` — Revoke sessions

### Campaigns (`/api/v1/campaigns`)
- `GET /` — List campaigns
- `GET /:id` — Get campaign
- `POST /` — Create campaign
- `PATCH /:id` — Update campaign
- `POST /:id/publish` — Publish
- `POST /:id/pause` — Pause
- `POST /:id/cancel` — Cancel

### Tasks (`/api/v1/tasks`)
- `GET /` — List tasks
- `GET /feed` — Tester task feed
- `GET /:id` — Get task
- `POST /` — Create task

### Task Slots (`/api/v1/tasks/slots`)
- `POST /accept` — Accept a task
- `POST /submit` — Submit completion
- `POST /track` — Track execution events
- `GET /my` — My accepted tasks
- `GET /:id` — Get slot details

### Wallet (`/api/v1/wallet`)
- `GET /balance` — Get balance
- `GET /transactions` — List transactions
- `POST /deposit` — Deposit funds
- `POST /withdraw` — Withdraw funds

---

## Scripts

| Script          | Description                      |
| --------------- | -------------------------------- |
| `pnpm dev`      | Start all services in dev mode   |
| `pnpm build`    | Build all packages and services  |
| `pnpm db:generate` | Generate Prisma client        |
| `pnpm db:push`  | Push schema to database          |
| `pnpm db:migrate` | Run migrations (production)    |
| `pnpm db:studio` | Open Prisma Studio              |
| `pnpm clean`    | Remove all dist/ and node_modules |

---

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.5
- **Framework**: Express 4
- **ORM**: Prisma 5
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Validation**: Zod 3
- **Auth**: JWT (jsonwebtoken)
- **Build**: Turborepo + pnpm
- **Logging**: Pino
- **Frontend** (planned): Next.js 14, Tailwind CSS, shadcn/ui

---

## License

Private — All rights reserved.
