export interface LrcLine {
  startMs: number;
  text: string;
}

// Matches [mm:ss.cs] or [mm:ss.ms3] with optional trailing text
const LINE_RE = /^\[(\d{2}):(\d{2})\.(\d{2,3})\]\s*(.*)/;

export function parseLrc(lrc: string): LrcLine[] {
  return lrc
    .split('\n')
    .map((raw) => {
      const m = LINE_RE.exec(raw.trim());
      if (!m) return null;
      const [, min, sec, frac, text] = m;
      // 2-digit fracs are centiseconds (×10), 3-digit are milliseconds
      const fracMs = frac.length === 2 ? Number(frac) * 10 : Number(frac);
      const startMs = Number(min) * 60_000 + Number(sec) * 1_000 + fracMs;
      return { startMs, text: text.trim() };
    })
    .filter((l): l is LrcLine => l !== null && l.text.length > 0)
    .sort((a, b) => a.startMs - b.startMs);
}
