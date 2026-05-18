import { createClient } from 'redis';

let publisher: ReturnType<typeof createClient> | null = null;
let connecting = false;

async function getPublisher(): Promise<ReturnType<typeof createClient> | null> {
  if (publisher && (publisher as any).isReady) return publisher;
  if (connecting) return null;

  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  connecting = true;

  try {
    const client = createClient({ url });
    client.on('error', (err: Error) => {
      console.error('[redis-publisher] Connection error:', err.message);
    });
    await client.connect();
    publisher = client;
    return client;
  } catch (err) {
    console.error('[redis-publisher] Failed to connect:', err);
    publisher = null;
    return null;
  } finally {
    connecting = false;
  }
}

/**
 * Publish an event to a Redis channel.
 * Non-fatal: if Redis is unavailable the error is swallowed so it never
 * blocks the core request path. WebSocket fan-out is best-effort.
 */
export async function publishEvent(
  channel: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const client = await getPublisher();
    if (!client) return;
    await client.publish(channel, JSON.stringify(data));
  } catch {
    // Intentionally silent — WebSocket events must never break core flows
  }
}
