import { WebSocketServer, WebSocket } from 'ws';
import { createClient } from 'redis';
import { createLogger } from '@lookme/logger';
import { config } from '@lookme/config';

const logger = createLogger('websocket-service');
const port = config.ports?.websocket || 5006;

// Redis client for pub/sub
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
const subscriber = redis.duplicate();

// WebSocket server
const wss = new WebSocketServer({ port });

// Store connected clients by userId and role
const clients = new Map<string, Set<WebSocket>>();

interface WSMessage {
  type: 'auth' | 'ping' | 'pong';
  userId?: string;
  role?: string;
  token?: string;
}

interface BroadcastMessage {
  event: string;
  data: any;
  targetRole?: 'admin' | 'worker';
  targetUserId?: string;
}

// Connect to Redis
await redis.connect();
await subscriber.connect();

logger.info('Connected to Redis');

// Subscribe to broadcast channels
await subscriber.subscribe('task:updated', (message) => {
  const data = JSON.parse(message);
  broadcast({
    event: 'task:updated',
    data,
    targetRole: 'admin'
  });
});

await subscriber.subscribe('wallet:updated', (message) => {
  const data = JSON.parse(message);
  broadcast({
    event: 'wallet:updated',
    data,
    targetUserId: data.userId
  });
});

await subscriber.subscribe('withdrawal:updated', (message) => {
  const data = JSON.parse(message);
  broadcast({
    event: 'withdrawal:updated',
    data,
    targetRole: 'admin'
  });
});

// WebSocket connection handler
wss.on('connection', (ws: WebSocket) => {
  let clientId: string | null = null;
  let clientRole: string | null = null;

  logger.info('New WebSocket connection');

  ws.on('message', (data: Buffer) => {
    try {
      const message: WSMessage = JSON.parse(data.toString());

      switch (message.type) {
        case 'auth':
          // Authenticate client
          if (message.userId && message.role) {
            clientId = message.userId;
            clientRole = message.role;

            // Store client connection
            const key = `${clientRole}:${clientId}`;
            if (!clients.has(key)) {
              clients.set(key, new Set());
            }
            clients.get(key)!.add(ws);

            logger.info({ userId: clientId, role: clientRole }, 'Client authenticated');

            // Send confirmation
            ws.send(JSON.stringify({
              type: 'auth:success',
              userId: clientId,
              role: clientRole
            }));
          }
          break;

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
      }
    } catch (err) {
      logger.error({ err }, 'Error processing message');
    }
  });

  ws.on('close', () => {
    // Remove client from map
    if (clientId && clientRole) {
      const key = `${clientRole}:${clientId}`;
      const clientSet = clients.get(key);
      if (clientSet) {
        clientSet.delete(ws);
        if (clientSet.size === 0) {
          clients.delete(key);
        }
      }
      logger.info({ userId: clientId, role: clientRole }, 'Client disconnected');
    }
  });

  ws.on('error', (err) => {
    logger.error({ err }, 'WebSocket error');
  });
});

// Broadcast message to clients
function broadcast(message: BroadcastMessage) {
  const payload = JSON.stringify({
    event: message.event,
    data: message.data
  });

  let sentCount = 0;

  clients.forEach((clientSet, key) => {
    const [role, userId] = key.split(':');

    // Check if message should be sent to this client
    const shouldSend = 
      (!message.targetRole || message.targetRole === role) &&
      (!message.targetUserId || message.targetUserId === userId);

    if (shouldSend) {
      clientSet.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
          sentCount++;
        }
      });
    }
  });

  logger.debug({ event: message.event, sentCount }, 'Broadcast message sent');
}

// Heartbeat to keep connections alive
setInterval(() => {
  clients.forEach((clientSet) => {
    clientSet.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    });
  });
}, 30000); // Every 30 seconds

logger.info({ port }, 'WebSocket server running');

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing connections');
  wss.close();
  await redis.quit();
  await subscriber.quit();
  process.exit(0);
});
