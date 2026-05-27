export { pulse }   from './pulse';
export { slide }   from './slide';
export { minimal } from './minimal';
export { flip }    from './flip';
export { glitch }  from './glitch';
export type { PresetConfig } from './types';

import { pulse }   from './pulse';
import { slide }   from './slide';
import { minimal } from './minimal';
import { flip }    from './flip';
import { glitch }  from './glitch';
import type { PresetConfig } from './types';

export const PRESETS: PresetConfig[] = [pulse, slide, flip, glitch, minimal];
