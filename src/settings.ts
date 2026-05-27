export interface AppSettings {
  fontScale: number;    // 0.75 | 1.0 | 1.3
  bgOpacity: number;   // 0 | 0.1 | 0.2 | 0.36
  accentColor: string; // one of ACCENT_COLORS[].value
}

export const DEFAULT_SETTINGS: AppSettings = {
  fontScale: 1.0,
  bgOpacity: 0.18,
  accentColor: 'auto',
};

export const FONT_SCALES = [
  { value: 0.75, label: 'S' },
  { value: 1.0,  label: 'M' },
  { value: 1.3,  label: 'L' },
] as const;

export const BG_OPACITIES = [
  { value: 0,    label: 'Aus' },
  { value: 0.1,  label: '░' },
  { value: 0.2,  label: '▒' },
  { value: 0.36, label: '█' },
] as const;

export const ACCENT_COLORS = [
  { value: 'auto',    label: 'Auto' },
  { value: '#FF6B00', label: 'Amber' },
  { value: '#F0EBE3', label: 'Weiß' },
  { value: '#00D4FF', label: 'Cyan' },
  { value: '#FF4D7D', label: 'Rose' },
] as const;
