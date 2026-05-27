import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSpotify } from './auth/SpotifyProvider';
import { ConnectScreen } from './components/ConnectScreen';
import { CallbackHandler } from './components/CallbackHandler';
import { NowPlayingBar } from './components/NowPlayingBar';
import { KineticStage } from './engine/KineticStage';
import { usePlaybackState } from './spotify/usePlaybackState';
import { useLyrics } from './lyrics/useLyrics';
import { PRESETS, type PresetConfig } from './engine/presets';
import { DEFAULT_SETTINGS, type AppSettings } from './settings';
import { useIdle } from './hooks/useIdle';
import { useAlbumColor } from './hooks/useAlbumColor';

// ─── Fullscreen helper ────────────────────────────────────────────────────────
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

// ─── Main view ────────────────────────────────────────────────────────────────
function MainView() {
  const [preset, setPreset] = useState<PresetConfig>(PRESETS[0]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const { track, progressMs, isPlaying, loading } = usePlaybackState();
  const { lines, instrumental, hasSync, isLoading: lyricsLoading } = useLyrics(track);

  // Ambient mode: hide UI after inactivity
  const isIdle = useIdle(3500);

  // Dynamic album colour – only resolved when accentColor === 'auto'
  const albumArtUrl = track?.album.images[0]?.url ?? null;
  const extractedColor = useAlbumColor(
    settings.accentColor === 'auto' ? albumArtUrl : null,
  );
  const resolvedAccentColor =
    settings.accentColor === 'auto'
      ? (extractedColor ?? '#FF6B00')
      : settings.accentColor;

  const resolvedSettings: AppSettings = { ...settings, accentColor: resolvedAccentColor };

  const handleSettingsChange = (patch: Partial<AppSettings>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  // Browser tab title – reflects what's playing even when minimised
  useEffect(() => {
    document.title = track
      ? `${track.name} · ${track.artists[0]?.name} — Beattastic`
      : 'Beattastic';
    return () => { document.title = 'Beattastic'; };
  }, [track?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key.toLowerCase()) {
        case 'f':
          toggleFullscreen();
          break;
        case '1': case '2': case '3': case '4': case '5': {
          const p = PRESETS[Number(e.key) - 1];
          if (p) setPreset(p);
          break;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <motion.div
          className="callback-spinner"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className={`main-view${isIdle ? ' app-idle' : ''}`}>
      <KineticStage
        track={track}
        lines={lines}
        progressMs={progressMs}
        isPlaying={isPlaying}
        preset={preset}
        settings={resolvedSettings}
        instrumental={instrumental}
        hasSync={hasSync}
        lyricsLoading={lyricsLoading}
      />
      <NowPlayingBar
        track={track}
        progressMs={progressMs}
        isPlaying={isPlaying}
        preset={preset}
        onPresetSelect={setPreset}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onFullscreen={toggleFullscreen}
      />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export function App() {
  const { isAuthenticated, isLoading } = useSpotify();

  if (window.location.pathname === '/callback') return <CallbackHandler />;

  if (isLoading) {
    return (
      <div className="app-loading">
        <motion.div
          className="callback-spinner"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        />
      </div>
    );
  }

  if (!isAuthenticated) return <ConnectScreen />;
  return <MainView />;
}
