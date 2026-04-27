export type HabitTheme = {
  /** primary highlight tone of the card (used for accents & glow) */
  accent: string;
  /** top-left and bottom-right colors of the card gradient */
  gradient: [string, string];
  /** color used for filled progress cells */
  progress: string;
  /** color used for empty progress cells */
  progressEmpty: string;
};

const THEMES: Record<string, HabitTheme> = {
  green: {
    accent: '#7FE3B6',
    gradient: ['#1A4A36', '#0B2218'],
    progress: '#7FE3B6',
    progressEmpty: 'rgba(127, 227, 182, 0.18)',
  },
  purple: {
    accent: '#E29CFF',
    gradient: ['#5B1F60', '#240A29'],
    progress: '#E29CFF',
    progressEmpty: 'rgba(226, 156, 255, 0.16)',
  },
  charcoal: {
    accent: '#9AA4B2',
    gradient: ['#2A2A2A', '#101012'],
    progress: '#D5DBE6',
    progressEmpty: 'rgba(213, 219, 230, 0.14)',
  },
  lime: {
    accent: '#D2E66E',
    gradient: ['#3F4A14', '#1A2007'],
    progress: '#D2E66E',
    progressEmpty: 'rgba(210, 230, 110, 0.16)',
  },
  pink: {
    accent: '#FF9CC2',
    gradient: ['#5C1F40', '#260A1B'],
    progress: '#FF9CC2',
    progressEmpty: 'rgba(255, 156, 194, 0.16)',
  },
  amber: {
    accent: '#FFC371',
    gradient: ['#5A3A0F', '#221408'],
    progress: '#FFC371',
    progressEmpty: 'rgba(255, 195, 113, 0.16)',
  },
  cyan: {
    accent: '#7FD7FF',
    gradient: ['#163E55', '#08182A'],
    progress: '#7FD7FF',
    progressEmpty: 'rgba(127, 215, 255, 0.16)',
  },
  rose: {
    accent: '#FF8E8E',
    gradient: ['#591C1C', '#220A0A'],
    progress: '#FF8E8E',
    progressEmpty: 'rgba(255, 142, 142, 0.16)',
  },
};

export const THEME_PALETTE = Object.keys(THEMES);

export function getTheme(name: string | undefined): HabitTheme {
  if (name && THEMES[name]) return THEMES[name];
  return THEMES.green;
}

/**
 * Stable hash → palette pick, used as a fallback for habits without a theme.
 */
export function pickThemeFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 2_147_483_647;
  }
  const idx = Math.abs(hash) % THEME_PALETTE.length;
  return THEME_PALETTE[idx];
}
