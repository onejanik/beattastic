/** Presence data extracted from a Discord Spotify activity, sent to WS clients. */
export interface DiscordPresence {
  trackId: string;       // Spotify track ID (from activity.syncId)
  trackName: string;
  artist: string;
  album: string;
  albumArt: string | null;
  startMs: number;       // Unix ms – progress = Date.now() - startMs
  endMs: number;         // Unix ms – duration = endMs - startMs
  isPlaying: boolean;
}

export type WsMessage =
  | { type: 'presence'; data: DiscordPresence }
  | { type: 'idle' };
