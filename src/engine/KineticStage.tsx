import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useActiveLyric } from './useActiveLyric';
import type { PresetConfig } from './presets/types';
import type { LrcLine } from '../lyrics/lrcParser';
import type { SpotifyTrack } from '../spotify/types';
import type { AppSettings } from '../settings';
import type { CSSProperties } from 'react';

interface KineticStageProps {
  track: SpotifyTrack | null;
  lines: LrcLine[];
  progressMs: number;
  isPlaying: boolean;
  preset: PresetConfig;
  settings: AppSettings;
  instrumental: boolean;
  hasSync: boolean;
  lyricsLoading: boolean;
}

function scaledSize(base: string, scale: number): string {
  return scale === 1 ? base : `calc(${base} * ${scale})`;
}

// ─── Scrollable lyrics list ───────────────────────────────────────────────────
// All lines are always in the DOM; CSS transitions handle opacity/color/size
// changes as the active index moves. scrollIntoView smoothly centres the line.
// This avoids AnimatePresence enter/exit timing issues entirely.
interface LyricsListProps {
  lines: LrcLine[];
  activeIndex: number;
  preset: PresetConfig;
  settings: AppSettings;
}

function LyricsList({ lines, activeIndex, preset, settings }: LyricsListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLParagraphElement>(null);

  // Reset scroll when a new song loads
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [lines]);

  // Smooth-scroll to keep the active line centred
  useEffect(() => {
    if (activeIndex < 0) return;
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeIndex]);

  const activeColor = settings.accentColor;
  const activeFontSize = scaledSize(preset.activeFontSize, settings.fontScale);
  const passiveFontSize = scaledSize(preset.passiveFontSize, settings.fontScale);

  return (
    <div ref={scrollRef} className={`lyrics-scroll-wrap lyrics-preset-${preset.id}`}>
      <div className="lyrics-list">
        {lines.map((line, i) => {
          const dist = i - activeIndex;
          const absDist = Math.abs(dist);
          const isActive = i === activeIndex;
          const isNear = absDist === 1;

          const opacity = isActive ? 1
            : isNear  ? 0.35
            : Math.max(0, 0.16 - absDist * 0.025);

          const color = isActive ? activeColor
            : dist === 1 ? preset.nextColor
            : preset.passiveColor;

          const shadow = isActive && preset.glow !== 'none' ? preset.glow : 'none';

          return (
            <p
              key={line.startMs}
              ref={isActive ? activeRef : undefined}
              // cssClass triggers its CSS entrance animation when this line
              // becomes active (class added → browser restarts animation).
              className={[
                'lyrics-line',
                isActive ? 'lyrics-line--active' : '',
                isActive && preset.cssClass ? preset.cssClass : '',
              ].filter(Boolean).join(' ')}
              style={{
                fontFamily: preset.fontFamily,
                fontWeight: preset.fontWeight,
                fontSize: isActive ? activeFontSize : passiveFontSize,
                textTransform: preset.textTransform as CSSProperties['textTransform'],
                letterSpacing: preset.letterSpacing,
                textAlign: preset.textAlign,
                lineHeight: 1.1,
                opacity,
                color,
                textShadow: shadow,
              } as CSSProperties}
            >
              {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main stage ───────────────────────────────────────────────────────────────
export function KineticStage({
  track,
  lines,
  progressMs,
  isPlaying,
  preset,
  settings,
  instrumental,
  hasSync,
  lyricsLoading,
}: KineticStageProps) {
  const { activeIndex } = useActiveLyric(lines, progressMs);

  const albumArt = track?.album.images[0]?.url;
  const bgOpacity = settings.bgOpacity;

  return (
    <div className={`kinetic-stage stage-align-${preset.textAlign}`}>
      {/* Blurred album-art backdrop */}
      <AnimatePresence>
        {albumArt && (
          <motion.div
            key={albumArt}
            className="stage-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: bgOpacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ '--blur': preset.backgroundBlur } as CSSProperties}
          >
            <img src={albumArt} alt="" className="stage-bg-img" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="stage-vignette" />

      {/* Non-sync states – centred in the stage */}
      {(!track || instrumental || lyricsLoading || !hasSync) && (
        <div className="stage-content">
          {!track && (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }} animate={{ opacity: 0.28 }}
              className="stage-idle"
              style={{ fontFamily: preset.fontFamily, color: preset.passiveColor }}
            >
              Spotify auf einem Gerät starten …
            </motion.p>
          )}

          {track && instrumental && (
            <motion.p
              key="instrumental"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 0.6, y: 0 }}
              style={{
                fontFamily: preset.fontFamily,
                fontSize: scaledSize(preset.activeFontSize, settings.fontScale),
                color: settings.accentColor,
                textAlign: preset.textAlign,
              }}
            >
              ♫ Instrumental
            </motion.p>
          )}

          {track && !instrumental && lyricsLoading && (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 0.22 }}
              className="stage-dots"
              style={{ fontFamily: preset.fontFamily, color: preset.passiveColor }}
            >
              ···
            </motion.span>
          )}

          {track && !instrumental && !lyricsLoading && !hasSync && (
            <motion.p
              key="no-lyrics"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.32, y: 0 }}
              style={{
                fontFamily: preset.fontFamily,
                fontSize: scaledSize(preset.passiveFontSize, settings.fontScale),
                color: preset.passiveColor,
                textAlign: preset.textAlign,
              }}
            >
              Keine Sync-Lyrics verfügbar
            </motion.p>
          )}
        </div>
      )}

      {/* Synced lyrics – full-height scrollable stack */}
      {track && !instrumental && hasSync && !lyricsLoading && (
        <LyricsList
          lines={lines}
          activeIndex={activeIndex}
          preset={preset}
          settings={settings}
        />
      )}

      {/* Subtle "playing" indicator – only shown when playing */}
      {isPlaying && track && hasSync && (
        <div className="stage-playing-pulse" />
      )}

      {/* Ambient mode hint – only visible when UI is hidden */}
      <p className="stage-hint">Bewegen zum Einblenden · F = Vollbild · 1–5 = Preset</p>
    </div>
  );
}
