import themesJson from '../../docs/contracts/themes.json';
import type { ThemeId } from '../game/model';

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  subtitle: string;
  tokensStatus: 'provisional' | 'approved';
  tokens: { bg: string; surface: string; ink: string; accent: string; accent2: string; accent3: string };
  background: { status: 'missing' | 'reference_only' | 'approved'; image: string | null; reference?: string };
  legacyThemeIds?: string[];
}

/** Source unique : docs/contracts/themes.json (validé par scripts/validate_contracts.py). */
export const THEMES = themesJson as ThemeConfig[];

export function themeById(id: ThemeId): ThemeConfig {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/** Vignette concept (recadrage de la planche approuvée) — référence, pas décor final. */
export function themeConceptImage(id: ThemeId): string {
  return `./concept/theme-${id}.jpg`;
}

export function applyTheme(id: ThemeId): void {
  const t = themeById(id);
  const root = document.documentElement;
  root.dataset.theme = t.id;
  for (const [k, v] of Object.entries(t.tokens)) root.style.setProperty(`--${k}`, v);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t.tokens.bg);
}
