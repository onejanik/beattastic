import type { SpotifyTrack } from './types';

const BASE = 'https://api.spotify.com/v1';

export interface CurrentlyPlayingResult {
  track: SpotifyTrack | null;
  progressMs: number;
  isPlaying: boolean;
}

export async function fetchCurrentlyPlaying(
  token: string,
): Promise<CurrentlyPlayingResult | null> {
  const res = await fetch(`${BASE}/me/player/currently-playing`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // 204: nothing playing; 404: no active device
  if (res.status === 204 || res.status === 404) {
    return { track: null, progressMs: 0, isPlaying: false };
  }

  // 401: token expired – caller must refresh
  if (res.status === 401) return null;

  if (!res.ok) return null;

  const data = await res.json();

  // Only handle track types (not podcast episodes etc.)
  if (data.currently_playing_type !== 'track') {
    return { track: null, progressMs: 0, isPlaying: false };
  }

  return {
    track: data.item as SpotifyTrack,
    progressMs: (data.progress_ms as number) ?? 0,
    isPlaying: (data.is_playing as boolean) ?? false,
  };
}
