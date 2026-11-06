/**
 * Univers des 3 thèmes (doc 03) : décor, sol, éclairage, ambiance, matières d'interface.
 * Les décors finaux ne sont PAS livrés : chaque emplacement indique le fichier attendu.
 */
import type { ThemeId } from '../game/model';
import type { AssetStatus } from '../avatar/manifest';

export type Ambience = 'petals' | 'rain' | 'motes';

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
  ambience: Ambience;
  materials: string;
}

export const WORLDS: Record<ThemeId, World> = {
  sakura: {
    id: 'sakura', name: 'Sakura', place: 'Village musical japonais-fantasy',
    background: { status: 'planned_missing', desktop: null, mobile: null, expected: ['bg_sakura_desktop.png', 'bg_sakura_mobile.png'] },
    foreground: { status: 'planned_missing', file: null, expected: 'fg_sakura.png' },
    provisional: './concept/theme-sakura.jpg', ambience: 'petals',
    materials: 'bois clair, papier crème, cadres dorés, pétales',
  },
  cyberpunk: {
    id: 'cyberpunk', name: 'Cyberpunk', place: 'Place de concert néon, nuit après la pluie',
    background: { status: 'planned_missing', desktop: null, mobile: null, expected: ['bg_cyberpunk_desktop.png', 'bg_cyberpunk_mobile.png'] },
    foreground: { status: 'planned_missing', file: null, expected: 'fg_cyberpunk.png' },
    provisional: './concept/theme-cyberpunk.jpg', ambience: 'rain',
    materials: 'métal sombre, verre holographique, panneaux lumineux',
  },
  ombre: {
    id: 'ombre', name: 'Ombre', place: 'Scène de concert gothique-fantasy',
    background: { status: 'planned_missing', desktop: null, mobile: null, expected: ['bg_ombre_desktop.png', 'bg_ombre_mobile.png'] },
    foreground: { status: 'planned_missing', file: null, expected: 'fg_ombre.png' },
    provisional: './concept/theme-ombre.jpg', ambience: 'motes',
    materials: 'pierre sombre, velours bordeaux, or ancien',
  },
};
