import type { PresetConfig } from './types';

export const flip: PresetConfig = {
  id: 'flip',
  name: '3D Flip',
  activeFontSize: 'clamp(2.5rem, 8.5vw, 6rem)',
  passiveFontSize: 'clamp(0.9rem, 2.6vw, 1.8rem)',
  fontFamily: '"Bebas Neue", cursive',
  fontWeight: 400,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  activeVariants: {
    initial: { opacity: 0, rotateX: 78, y: 14 },
    animate: { opacity: 1, rotateX: 0, y: 0 },
    exit:    { opacity: 0, rotateX: -38, y: -10 },
  },
  activeTransition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] },
  passiveVariants: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
  passiveTransition: { duration: 0.25 },
  activeColor: '#F0EBE3',
  passiveColor: '#F0EBE3',
  nextColor: '#524c48',
  textAlign: 'center',
  backgroundBlur: '44px',
  backgroundOpacity: 0.2,
  glow: '0 6px 28px rgba(240,235,227,0.12)',
  cssClass: 'lyric-enter-flip',
};
