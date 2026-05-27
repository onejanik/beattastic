const BASE = 'https://lrclib.net/api';

export interface LrclibResult {
  syncedLyrics: string | null;
  plainLyrics: string | null;
  instrumental: boolean;
}

async function fetchOne(url: string): Promise<LrclibResult | null> {
  // No custom headers – User-Agent is a forbidden header in browser cross-origin requests
  // and would trigger a CORS preflight that LRCLib rejects.
  const res = await fetch(url);
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const d = await res.json();
  return {
    syncedLyrics: (d.syncedLyrics as string | null) || null,
    plainLyrics: (d.plainLyrics as string | null) || null,
    instrumental: Boolean(d.instrumental),
  };
}

export async function getLyrics(
  trackName: string,
  artistName: string,
  albumName: string,
  durationSec: number,
): Promise<LrclibResult | null> {
  const params = new URLSearchParams({
    track_name: trackName,
    artist_name: artistName,
    album_name: albumName,
    duration: String(Math.round(durationSec)),
  });

  // Fire both endpoints simultaneously.
  // The cached endpoint wins if the track is already in LRCLib's DB (usually < 200ms).
  // The full endpoint fetches from external sources in parallel so we don't wait for
  // the sequential fallback – whichever returns a valid result first wins.
  try {
    return await Promise.any([
      fetchOne(`${BASE}/get-cached?${params}`).then((r) => r ?? Promise.reject(new Error('no result'))),
      fetchOne(`${BASE}/get?${params}`).then((r) => r ?? Promise.reject(new Error('no result'))),
    ]);
  } catch {
    return null;
  }
}
