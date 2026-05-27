import { useMemo } from 'react';
import type { LrcLine } from '../lyrics/lrcParser';

export interface ActiveLyricResult {
  activeIndex: number;
  activeLine: LrcLine | null;
  nextLine: LrcLine | null;
  previousLine: LrcLine | null;
}

// Show lyrics slightly before their timestamp to feel more natural
const LOOKAHEAD_MS = 150;

export function useActiveLyric(lines: LrcLine[], progressMs: number): ActiveLyricResult {
  return useMemo(() => {
    if (lines.length === 0) {
      return { activeIndex: -1, activeLine: null, nextLine: null, previousLine: null };
    }

    const adjusted = progressMs + LOOKAHEAD_MS;
    let activeIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startMs <= adjusted) {
        activeIndex = i;
      } else {
        break;
      }
    }

    return {
      activeIndex,
      activeLine: activeIndex >= 0 ? lines[activeIndex] : null,
      nextLine: activeIndex + 1 < lines.length ? lines[activeIndex + 1] : null,
      previousLine: activeIndex > 0 ? lines[activeIndex - 1] : null,
    };
  }, [lines, progressMs]);
}
