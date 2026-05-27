import type { Variants, Transition } from 'framer-motion';

export interface PresetConfig {
  id: string;
  name: string;
  activeFontSize: string;
  passiveFontSize: string;
  fontFamily: string;
  fontWeight: number | string;
  textTransform: string;
  letterSpacing: string;
  activeVariants: Variants;
  activeTransition: Transition;
  passiveVariants: Variants;
  passiveTransition: Transition;
  activeColor: string;
  passiveColor: string;
  nextColor: string;
  textAlign: 'left' | 'center' | 'right';
  backgroundBlur: string;
  backgroundOpacity: number;
  glow: string;
  /** Extra inline style applied to the stage content wrapper (e.g. perspective for 3D) */
  stageStyle?: Record<string, string | number>;
  /** Extra CSS class added to the active lyric line (e.g. for glitch animation) */
  cssClass?: string;
}
