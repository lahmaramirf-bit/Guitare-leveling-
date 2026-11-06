/**
 * Univers des 3 thèmes (doc 03) : décor, sol, éclairage, ambiance, matières d'interface.
 * Les décors finaux ne sont PAS livrés : chaque emplacement indique le fichier attendu.
 */
import type { ThemeId } from '../game/model';
import type { AssetStatus } from '../avatar/manifest';

export type Ambience = 'petals' | 'rain' | 'motes';
export type PanelStatus = 'planned_missing' | 'candidate' | 'approved';

/**
 * Décor du panneau personnage compact (direction produit v0.7 : app d'entraînement,
 * personnage dans un panneau, pas de hub plein écran).
 */
export interface PanelBg {
  status: PanelStatus;
  /** fichier local dans public/ (jamais une URL externe) */
  file: string | null;
  expected: string;
  size: [number, number];
  /** ligne de sol, en fraction de la hauteur de l'image (pieds du personnage) */
  groundY: number;
  /** autres versions candidates du même décor (comparaison QA, jamais affichées par défaut) */
  variants?: Record<string, { status: PanelStatus; file: string; groundY: number }>;
}

/** Variante demandée dans l'adresse : `?panel=v2`, accepté aussi après le `#` (ex. `#/hub?panel=v2`). */
export function panelFromUrl(href = typeof location !== 'undefined' ? location.href : ''): string | null {
  const m = /[?&]panel=([a-z0-9]+)/i.exec(href);
  return m ? m[1].toLowerCase() : null;
}

/** Décor actif : la version par défaut (v1), ou une variante candidate (comparaison, jamais par défaut). */
export function activePanel(panel: PanelBg, search: string | null = panelFromUrl()): PanelBg & { variant: string } {
  const id = search && search.includes('panel=') ? panelFromUrl(search) : search;
  const v = id ? panel.variants?.[id] : undefined;
  return v ? { ...panel, ...v, variant: id! } : { ...panel, variant: 'v1' };
}

export interface World {
  id: ThemeId;
  name: string;
  place: string;
  /** décor final attendu (1920×1080 / 1080×1920) */
  background: { status: AssetStatus; desktop: string | null; mobile: string | null; expected: [string, string] };
  /** premier plan / sol attendu */
  foreground: { status: AssetStatus; file: string | null; expected: string };
  /** décor provisoire autorisé : vignette de la planche approuvée, étiquetée comme telle */
  provisional: string;
  panel: PanelBg;
  ambience: Ambience;
  materials: string;
}

export const WORLDS: Record<ThemeId, World> = {
  sakura: {
    id: 'sakura', name: 'Sakura', place: 'Village musical japonais-fantasy',
    background: { status: 'planned_missing', desktop: null, mobile: null, expected: ['bg_sakura_desktop.png', 'bg_sakura_mobile.png'] },
    foreground: { status: 'planned_missing', file: null, expected: 'fg_sakura.png' },
    provisional: './concept/theme-sakura.jpg',
    panel: { status: 'candidate', file: './art/panel/panel_bg_sakura.png', expected: 'panel_bg_sakura.png', size: [1400, 620], groundY: 0.9,
      variants: { v2: { status: 'candidate', file: './art/panel/panel_bg_sakura_v2.png', groundY: 0.9 } } }, ambience: 'petals',
    materials: 'bois clair, papier crème, cadres dorés, pétales',
  },
  cyberpunk: {
    id: 'cyberpunk', name: 'Cyberpunk', place: 'Place de concert néon, nuit après la pluie',
    background: { status: 'planned_missing', desktop: null, mobile: null, expected: ['bg_cyberpunk_desktop.png', 'bg_cyberpunk_mobile.png'] },
    foreground: { status: 'planned_missing', file: null, expected: 'fg_cyberpunk.png' },
    provisional: './concept/theme-cyberpunk.jpg',
    panel: { status: 'planned_missing', file: null, expected: 'panel_bg_cyberpunk.png', size: [1400, 620], groundY: 0.9 }, ambience: 'rain',
    materials: 'métal sombre, verre holographique, panneaux lumineux',
  },
  ombre: {
    id: 'ombre', name: 'Ombre', place: 'Scène de concert gothique-fantasy',
    background: { status: 'planned_missing', desktop: null, mobile: null, expected: ['bg_ombre_desktop.png', 'bg_ombre_mobile.png'] },
    foreground: { status: 'planned_missing', file: null, expected: 'fg_ombre.png' },
    provisional: './concept/theme-ombre.jpg',
    panel: { status: 'planned_missing', file: null, expected: 'panel_bg_ombre.png', size: [1400, 620], groundY: 0.9 }, ambience: 'motes',
    materials: 'pierre sombre, velours bordeaux, or ancien',
  },
};

export const PANEL_ASPECT = 1400 / 620;
