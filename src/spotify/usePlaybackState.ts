import { useCallback, useEffect, useRef, useState } from 'react';
import { useSpotify } from '../auth/SpotifyProvider';
import { fetchCurrentlyPlaying } from './api';
import type { SpotifyTrack } from './types';

const POLL_MS = 3000;

export interface UsePlaybackStateResult {
  track: SpotifyTrack | null;
  progressMs: number;
  isPlaying: boolean;
  deviceActive: boolean;
  loading: boolean;
}

export function usePlaybackState(): UsePlaybackStateResult {
  const { getToken, isAuthenticated } = useSpotify();

  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceActive, setDeviceActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progressMs, setProgressMs] = useState(0);

  // Refs so the RAF callback always reads current values without stale closures
  const progressRef = useRef(0);
  const lastTickRef = useRef(Date.now());
  const isPlayingRef = useRef(false);
  const rafRef = useRef(0);

  // Local clock: advances progressMs at ~60 fps while playing, drifts are corrected on each poll
  const tick = useCallback(() => {
    const now = Date.now();
    const delta = now - lastTickRef.current;
    lastTickRef.current = now;

    if (isPlayingRef.current) {
      progressRef.current += delta;
      setProgressMs(progressRef.current);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const poll = useCallback(async () => {
    if (!isAuthenticated) return;
    const token = await getToken();
    if (!token) return;

    const result = await fetchCurrentlyPlaying(token);
    if (result === null) return; // 401 or network error – keep current state

    setDeviceActive(result.track !== null);
    setIsPlaying(result.isPlaying);
    isPlayingRef.current = result.isPlaying;

    if (result.track) {
      setTrack((prev) => (prev?.id !== result.track!.id ? result.track : prev));
      // Correct drift: snap local clock to server value
      progressRef.current = result.progressMs;
      lastTickRef.current = Date.now();
      setProgressMs(result.progressMs);
    } else {
      setTrack(null);
      progressRef.current = 0;
      setProgressMs(0);
    }

    setLoading(false);
  }, [isAuthenticated, getToken]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [isAuthenticated, poll]);

  return { track, progressMs, isPlaying, deviceActive, loading };
}
