import { motion } from 'framer-motion';
import {
  ACCENT_COLORS,
  BG_OPACITIES,
  FONT_SCALES,
  type AppSettings,
} from '../settings';

interface SettingsPanelProps {
  settings: AppSettings;
  onChange: (patch: Partial<AppSettings>) => void;
}

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  return (
    <motion.div
      className="settings-panel"
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{ opacity: 0, y: 8,  scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Font size */}
      <div className="settings-row">
        <span className="settings-label">Größe</span>
        <div className="settings-options">
          {FONT_SCALES.map(({ value, label }) => (
            <button
              key={value}
              className={`settings-pill${settings.fontScale === value ? ' settings-pill--active' : ''}`}
              onClick={() => onChange({ fontScale: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Background opacity */}
      <div className="settings-row">
        <span className="settings-label">Hintergrund</span>
        <div className="settings-options">
          {BG_OPACITIES.map(({ value, label }) => (
            <button
              key={value}
              className={`settings-pill${settings.bgOpacity === value ? ' settings-pill--active' : ''}`}
              onClick={() => onChange({ bgOpacity: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div className="settings-row">
        <span className="settings-label">Farbe</span>
        <div className="settings-options">
          {ACCENT_COLORS.map(({ value, label }) => (
            <button
              key={value}
              aria-label={label}
              className={`settings-color${settings.accentColor === value ? ' settings-color--active' : ''}`}
              style={{ '--c': value } as React.CSSProperties}
              onClick={() => onChange({ accentColor: value })}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
