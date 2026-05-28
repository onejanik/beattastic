import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import type { DiscordPresence, WsMessage } from './types';

// userId → set of connected WebSocket clients
const subs = new Map<string, Set<WebSocket>>();
// Last known presence per userId (sent immediately on new connection)
const cache = new Map<string, DiscordPresence>();

export function attachWsServer(httpServer: Server): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url ?? '/', `http://localhost`);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      ws.close(1008, 'userId query param required');
      return;
    }

    // Subscribe
    if (!subs.has(userId)) subs.set(userId, new Set());
    subs.get(userId)!.add(ws);

    // Send cached presence immediately so the client doesn't wait for the next event
    const cached = cache.get(userId);
    send(ws, cached ? { type: 'presence', data: cached } : { type: 'idle' });

    ws.on('close', () => subs.get(userId)?.delete(ws));
    ws.on('error', () => { subs.get(userId)?.delete(ws); ws.terminate(); });
  });

  return wss;
}

/** Called by the bot whenever a user's Spotify presence changes. */
export function broadcastPresence(userId: string, presence: DiscordPresence | null): void {
  if (presence) cache.set(userId, presence);
  else cache.delete(userId);

  const msg: WsMessage = presence ? { type: 'presence', data: presence } : { type: 'idle' };
  subs.get(userId)?.forEach((ws) => send(ws, msg));
}

function send(ws: WebSocket, msg: WsMessage): void {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
}
