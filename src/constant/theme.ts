export type ThemeColor = 'purple' | 'blue' | 'pink' | 'green' | 'orange';

export interface ThemeColorOption {
  label: string;
  value: ThemeColor;
  color: string;
  hue: number;
}

export const THEME_COLORS: ThemeColorOption[] = [
  { label: 'Purple', value: 'purple', color: '#7C3AED', hue: 262 },
  { label: 'Blue', value: 'blue', color: '#155DFC', hue: 221 },
  { label: 'Pink', value: 'pink', color: '#DB2777', hue: 330 },
  { label: 'Green', value: 'green', color: '#059669', hue: 145 },
  { label: 'Orange', value: 'orange', color: '#EA580C', hue: 25 },
];

export const DEFAULT_THEME_COLOR: ThemeColor = 'blue';
