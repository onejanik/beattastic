import type { PresetConfig } from './types';

export const minimal: PresetConfig = {
  id: 'minimal',
  name: 'Minimal',
  activeFontSize: 'clamp(1.4rem, 4.5vw, 3.2rem)',
  passiveFontSize: 'clamp(0.75rem, 1.8vw, 1.2rem)',
  fontFamily: '"JetBrains Mono", monospace',
  fontWeight: 300,
  textTransform: 'none',
  letterSpacing: '-0.01em',
  activeVariants: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -10 },
  },
  activeTransition: { duration: 0.22, ease: 'easeInOut' },
  passiveVariants: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
  passiveTransition: { duration: 0.18 },
  activeColor: '#F0EBE3',
  passiveColor: '#F0EBE3',
  nextColor: '#4a4640',
  textAlign: 'center',
  backgroundBlur: '80px',
  backgroundOpacity: 0.07,
  glow: 'none',
};
