import type { PresetConfig } from './types';

export const slide: PresetConfig = {
  id: 'slide',
  name: 'Editorial Slide',
  activeFontSize: 'clamp(2.2rem, 7.5vw, 5.5rem)',
  passiveFontSize: 'clamp(0.9rem, 2.5vw, 1.6rem)',
  fontFamily: '"Syne", sans-serif',
  fontWeight: 800,
  textTransform: 'none',
  letterSpacing: '-0.03em',
  activeVariants: {
    initial: { opacity: 0, x: -72, skewX: -6 },
    animate: { opacity: 1, x: 0,   skewX: 0 },
    exit:    { opacity: 0, x: 72,  skewX: 6 },
  },
  activeTransition: { duration: 0.42, ease: [0.77, 0, 0.175, 1] },
  passiveVariants: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
  passiveTransition: { duration: 0.25 },
  activeColor: '#F0EBE3',
  passiveColor: '#F0EBE3',
  nextColor: '#5e5850',
  textAlign: 'left',
  backgroundBlur: '56px',
  backgroundOpacity: 0.13,
  glow: '0 2px 32px rgba(240,235,227,0.06)',
  cssClass: 'lyric-enter-slide',
};
