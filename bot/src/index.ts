import 'dotenv/config';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { createDiscordClient } from './bot';
import { attachWsServer } from './wsServer';
import routes from './routes';

const PORT = Number(process.env.PORT ?? 3001);
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://127.0.0.1:5173';

// ── HTTP server ──────────────────────────────────────────────────────────────
const app = express();

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(routes);

const httpServer = createServer(app);

// ── WebSocket server (shares the same port via HTTP upgrade) ─────────────────
attachWsServer(httpServer);

// ── Discord bot ──────────────────────────────────────────────────────────────
const discordClient = createDiscordClient();
discordClient.login(process.env.DISCORD_BOT_TOKEN);

// ── Start ────────────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`[server] HTTP + WS on port ${PORT}`);
  console.log(`[server] CORS origin: ${FRONTEND_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  discordClient.destroy();
  httpServer.close();
});
