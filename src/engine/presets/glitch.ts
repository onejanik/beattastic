import type { PresetConfig } from './types';

export const glitch: PresetConfig = {
  id: 'glitch',
  name: 'Glitch',
  activeFontSize: 'clamp(2rem, 6.5vw, 4.8rem)',
  passiveFontSize: 'clamp(0.8rem, 2vw, 1.4rem)',
  fontFamily: '"JetBrains Mono", monospace',
  fontWeight: 400,
  textTransform: 'none',
  letterSpacing: '0.01em',
  activeVariants: {
    initial: { opacity: 0, x: -8, filter: 'blur(10px)' },
    animate: {
      opacity:  [0, 1, 0.82, 1],
      x:        [-8, 4, -3, 0],
      filter:   ['blur(10px)', 'blur(0px)', 'blur(2px)', 'blur(0px)'],
    },
    exit: { opacity: 0, x: 12, filter: 'blur(8px)' },
  },
  activeTransition: { duration: 0.3, ease: 'easeOut', times: [0, 0.35, 0.65, 1] },
  passiveVariants: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
  passiveTransition: { duration: 0.2 },
  activeColor: '#00D4FF',
  passiveColor: '#F0EBE3',
  nextColor: '#2e5460',
  textAlign: 'left',
  backgroundBlur: '60px',
  backgroundOpacity: 0.12,
  glow: '0 0 32px rgba(0,212,255,0.28)',
  cssClass: 'lyric-glitch',
};
