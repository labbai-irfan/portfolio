// Literal colours for places CSS variables can't reach: generated images (satori), the web
// manifest and the favicon. They mirror the tokens in styles/globals.css (ink, ground, signal and
// the dark-mode variants); change them together. Components never import this file.
export const BRAND = {
  ink: '#0a0f1c',
  ground: '#f5f6f8',
  surface: '#ffffff',
  signal: '#1d4ed8',
  body: '#2e3a4f',
  muted: '#556274',
  grid: '#e3e7ed',
  darkInk: '#0b1120',
  darkText: '#f3f6fb',
  darkSignal: '#7fa2ff',
} as const;
