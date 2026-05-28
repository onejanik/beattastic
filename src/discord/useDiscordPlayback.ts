import { useCallback, useEffect, useRef, useState } from 'react';
import type { SpotifyTrack } from '../spotify/types';

const BOT_WS_URL = (import.meta.env.VITE_BOT_WS_URL as string | undefined) ?? '';

// ── Types ────────────────────────────────────────────────────────────────────

interface DiscordPresence {
  trackId:   string;
  trackName: string;
  artist:    string;
  album:     string;
  albumArt:  string | null;
  startMs:   number; // Unix ms
  endMs:     number; // Unix ms
  isPlaying: boolean;
}

export interface UseDiscordPlaybackResult {
  track:        SpotifyTrack | null;
  progressMs:   number;
  isPlaying:    boolean;
  deviceActive: boolean;
  loading:      boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Convert Discord presence → SpotifyTrack so the rest of the app stays unchanged. */
function toTrack(p: DiscordPresence): SpotifyTrack {
  // Provide three "image sizes" so the bar thumbnail (images[2]) and stage bg (images[0]) both work.
  const images = p.albumArt
    ? [
        { url: p.albumArt, height: 640, width: 640 },
        { url: p.albumArt, height: 300, width: 300 },
        { url: p.albumArt, height: 64,  width: 64  },
      ]
    : [];

  return {
    id:          p.trackId,
    name:        p.trackName,
    duration_ms: p.endMs - p.startMs,
    artists:     [{ id: '', name: p.artist }],
    album:       { id: '', name: p.album, images },
    uri:         `spotify:track:${p.trackId}`,
  };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Connects to the Beattastic bot's WebSocket server and streams real-time
 * Spotify playback data via Discord presence events.
 *
 * Returns the same shape as `usePlaybackState` so the rest of the app is
 * completely unaware of the data source.
 *
 * @param userId – Discord user ID obtained after OAuth; null = disabled.
 */
export function useDiscordPlayback(userId: string | null): UseDiscordPlaybackResult {
  const [presence, setPresence] = useState<DiscordPresence | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [progressMs, setProgressMs] = useState(0);

  const presenceRef = useRef<DiscordPresence | null>(null);
  const rafRef      = useRef<number>(0);

  // rAF clock – no server polling needed; Discord timestamps are exact
  const tick = useCallback(() => {
    const p = presenceRef.current;
    if (p?.isPlaying) {
      setProgressMs(Math.max(0, Date.now() - p.startMs));
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  // WebSocket connection with auto-reconnect
  useEffect(() => {
    if (!userId || !BOT_WS_URL) {
      setLoading(false);
      return;
    }

    let ws:             WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let isMounted = true;

    const connect = () => {
      ws = new WebSocket(`${BOT_WS_URL}?userId=${userId}`);

      ws.onopen = () => {
        if (isMounted) setLoading(false);
      };

      ws.onmessage = (event: MessageEvent<string>) => {
        if (!isMounted) return;
        try {
          const msg = JSON.parse(event.data) as
            | { type: 'presence'; data: DiscordPresence }
            | { type: 'idle' };

          if (msg.type === 'presence') {
            presenceRef.current = msg.data;
            setPresence(msg.data);
            setProgressMs(Math.max(0, Date.now() - msg.data.startMs));
          } else {
            presenceRef.current = null;
            setPresence(null);
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        if (isMounted) {
          reconnectTimer = setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => ws.close();
    };

    connect();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [userId]);

  return {
    track:        presence ? toTrack(presence) : null,
    progressMs,
    isPlaying:    presence?.isPlaying ?? false,
    deviceActive: presence !== null,
    loading,
  };
}
