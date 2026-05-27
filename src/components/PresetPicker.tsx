import { motion } from 'framer-motion';
import { PRESETS, type PresetConfig } from '../engine/presets';

interface PresetPickerProps {
  selected: PresetConfig;
  onSelect: (p: PresetConfig) => void;
}

export function PresetPicker({ selected, onSelect }: PresetPickerProps) {
  return (
    <div className="preset-picker" role="radiogroup" aria-label="Visual preset">
      {PRESETS.map((p) => (
        <button
          key={p.id}
          role="radio"
          aria-checked={p.id === selected.id}
          className={`preset-pill${p.id === selected.id ? ' preset-pill--active' : ''}`}
          onClick={() => onSelect(p)}
        >
          {p.id === selected.id && (
            <motion.span
              layoutId="preset-indicator"
              className="preset-indicator"
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
          <span className="preset-label">{p.name}</span>
        </button>
      ))}
    </div>
  );
}
