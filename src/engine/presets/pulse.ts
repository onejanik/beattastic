import type { PresetConfig } from './types';

export const pulse: PresetConfig = {
  id: 'pulse',
  name: 'Neon Pulse',
  activeFontSize: 'clamp(2.8rem, 9vw, 6.5rem)',
  passiveFontSize: 'clamp(1rem, 2.8vw, 2rem)',
  fontFamily: '"Bebas Neue", cursive',
  fontWeight: 400,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  activeVariants: {
    initial: { opacity: 0, scale: 0.88, y: 36 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit:    { opacity: 0, scale: 1.06, y: -24 },
  },
  activeTransition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  passiveVariants: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
  passiveTransition: { duration: 0.28 },
  activeColor: '#FF6B00',
  passiveColor: '#F0EBE3',
  nextColor: '#7a6e66',
  textAlign: 'center',
  backgroundBlur: '36px',
  backgroundOpacity: 0.18,
  glow: '0 0 48px rgba(255,107,0,0.45), 0 0 100px rgba(255,107,0,0.15)',
  cssClass: 'lyric-enter-pulse',
};
