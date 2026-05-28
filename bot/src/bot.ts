import {
  Client,
  GatewayIntentBits,
  ActivityType,
  type Presence,
} from 'discord.js';
import { broadcastPresence } from './wsServer';
import type { DiscordPresence } from './types';

export function createDiscordClient(): Client {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildPresences, // Privileged intent – enable in Developer Portal
      GatewayIntentBits.GuildMembers,
    ],
  });

  client.once('ready', () => {
    console.log(`[bot] Logged in as ${client.user?.tag}`);
  });

  client.on('presenceUpdate', (_old, newPresence) => {
    if (!newPresence.userId) return;
    handlePresence(newPresence);
  });

  return client;
}

function handlePresence(presence: Presence): void {
  const userId = presence.userId;

  const activity = presence.activities.find(
    (a) => a.name === 'Spotify' && a.type === ActivityType.Listening,
  );

  if (!activity || !activity.syncId) {
    // User stopped listening → notify clients
    broadcastPresence(userId, null);
    return;
  }

  // Album art: Discord stores Spotify images as "spotify:HASH"
  // discord.js largeImageURL() converts this to the i.scdn.co CDN URL automatically.
  const albumArt = activity.assets?.largeImageURL() ?? null;

  const data: DiscordPresence = {
    trackId:   activity.syncId,
    trackName: activity.details  ?? 'Unknown Track',
    artist:    activity.state    ?? 'Unknown Artist',
    album:     activity.assets?.largeText ?? '',
    albumArt,
    startMs:   activity.timestamps?.start?.getTime() ?? Date.now(),
    endMs:     activity.timestamps?.end?.getTime()   ?? Date.now() + 180_000,
    isPlaying: true,
  };

  broadcastPresence(userId, data);
}
