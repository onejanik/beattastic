import { useEffect, useRef, useState } from 'react';
import { getLyrics } from './lrclib';
import { parseLrc, type LrcLine } from './lrcParser';
import type { SpotifyTrack } from '../spotify/types';

export interface UseLyricsResult {
  lines: LrcLine[];
  plainLyrics: string | null;
  instrumental: boolean;
  isLoading: boolean;
  hasSync: boolean;
}

// In-memory cache keyed by Spotify track ID
const cache = new Map<string, UseLyricsResult>();

const EMPTY: UseLyricsResult = {
  lines: [],
  plainLyrics: null,
  instrumental: false,
  isLoading: false,
  hasSync: false,
};

export function useLyrics(track: SpotifyTrack | null): UseLyricsResult {
  const [result, setResult] = useState<UseLyricsResult>(EMPTY);
  const inflight = useRef<string | null>(null);

  useEffect(() => {
    if (!track) {
      setResult(EMPTY);
      return;
    }

    if (cache.has(track.id)) {
      setResult(cache.get(track.id)!);
      return;
    }

    inflight.current = track.id;
    setResult({ ...EMPTY, isLoading: true });

    const durationSec = track.duration_ms / 1000;
    const artistName = track.artists[0]?.name ?? '';

    getLyrics(track.name, artistName, track.album.name, durationSec).then((data) => {
      if (inflight.current !== track.id) return; // track changed while loading

      let r: UseLyricsResult;

      if (!data) {
        r = EMPTY;
      } else if (data.instrumental) {
        r = { lines: [], plainLyrics: null, instrumental: true, isLoading: false, hasSync: false };
      } else {
        const lines = data.syncedLyrics ? parseLrc(data.syncedLyrics) : [];
        r = {
          lines,
          plainLyrics: data.plainLyrics,
          instrumental: false,
          isLoading: false,
          hasSync: lines.length > 0,
        };
      }

      cache.set(track.id, r);
      setResult(r);
    });
  }, [track?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return result;
}
