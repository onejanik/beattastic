import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useSpotify } from '../auth/SpotifyProvider';
import { PresetPicker } from './PresetPicker';
import { SettingsPanel } from './SettingsPanel';
import type { SpotifyTrack } from '../spotify/types';
import type { PresetConfig } from '../engine/presets';
import type { AppSettings } from '../settings';

interface NowPlayingBarProps {
  track: SpotifyTrack | null;
  progressMs: number;
  isPlaying: boolean;
  preset: PresetConfig;
  onPresetSelect: (p: PresetConfig) => void;
  settings: AppSettings;
  onSettingsChange: (patch: Partial<AppSettings>) => void;
  onFullscreen: () => void;
}

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export function NowPlayingBar({
  track,
  progressMs,
  isPlaying,
  preset,
  onPresetSelect,
  settings,
  onSettingsChange,
  onFullscreen,
}: NowPlayingBarProps) {
  const { logout } = useSpotify();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const progress = track ? Math.min(1, progressMs / track.duration_ms) : 0;

  return (
    <div className="now-playing-bar">
      {/* Settings panel – anchored above bar */}
      <AnimatePresence>
        {settingsOpen && (
          <SettingsPanel settings={settings} onChange={onSettingsChange} />
        )}
      </AnimatePresence>

      {/* Progress line */}
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          style={{ scaleX: progress, transformOrigin: 'left' }}
        />
      </div>

      <div className="bar-inner">
        {/* Track info */}
        <div className="bar-track-info">
          <AnimatePresence mode="wait">
            {track ? (
              <motion.div
                key={track.id}
                className="bar-track-meta"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
              >
                {track.album.images[2]?.url && (
                  <img
                    src={track.album.images[2].url}
                    alt={track.album.name}
                    className="bar-album-art"
                  />
                )}
                <div className="bar-text">
                  <span className="bar-track-name">{track.name}</span>
                  <span className="bar-artist-name">
                    {track.artists.map((a) => a.name).join(', ')}
                  </span>
                </div>
                {isPlaying && <span className="bar-playing-dot" title="Spielt gerade" />}
              </motion.div>
            ) : (
              <motion.span
                key="idle"
                className="bar-idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
              >
                Nichts spielt gerade
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Time */}
        {track && (
          <div className="bar-time">
            <span>{fmt(progressMs)}</span>
            <span className="bar-time-sep">/</span>
            <span className="bar-time-total">{fmt(track.duration_ms)}</span>
          </div>
        )}

        {/* Preset picker */}
        <PresetPicker selected={preset} onSelect={onPresetSelect} />

        {/* Fullscreen */}
        <button
          className="bar-icon-btn"
          onClick={onFullscreen}
          title="Vollbild (F)"
          aria-label="Vollbild umschalten"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Settings */}
        <button
          className={`bar-icon-btn${settingsOpen ? ' bar-icon-btn--active' : ''}`}
          onClick={() => setSettingsOpen((v) => !v)}
          title="Einstellungen"
          aria-pressed={settingsOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <circle cx="12" cy="12" r="3" strokeLinecap="round" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Disconnect */}
        <button className="bar-icon-btn" onClick={logout} title="Trennen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
