import type { QuestId, RankId } from '../content';

/** Journée : registre des actions validées (modèle du projet de base). */
export interface Day {
  q: QuestId[];
  /** XP d'entraînement (quiz, outils) — plafonné par jour */
  train?: number;
  /** exercices faits */
  ex?: string[];
  /** ombres révisées */
  rev?: string[];
  /** lectures à vue */
  sr?: number;
  /** portail du jour fermé (rang du portail) */
  urg?: RankId;
  /** secondes d'accompagnement */
  jam?: number;
  /** sessions guidées complètes */
  sess?: number;
  /** Limit Break réussi (rang du défi) + titre */
  lb?: RankId;
  lbt?: string;
  lbo?: 1;
  lbr?: 1;
  /** portail relancé (clé utilisée) */
  pk?: number;
  /** série sauvée par un parchemin */
  freeze?: 1;
}

export type SongState = '' | 'c' | 'w' | 'm';
export interface RepEntry {
  s?: SongState;
  /** étapes du plan validées */
  st?: number[];
  t?: number;
  bpm?: number;
  /** défis Limit Break du morceau validés */
  lb?: number[];
}
export interface CustomSong { t: string; by: string; g: string; d: number }

export type Slot = 'hair' | 'top' | 'bottom' | 'accessory' | 'guitar' | 'aura' | 'decor' | 'title';
export type AvatarId = 'boy' | 'girl';
export type ThemeId = 'sakura' | 'cyberpunk' | 'ombre';

export interface Save {
  v: 2;
  days: Record<string, Day>;
  /** objets de donjon (E-obj-0…), partitions (P-…), morceaux maîtrisés (R-…) → date */
  items: Record<string, string | true>;
  weeks: Record<string, string[]>;
  records: Record<string, { best: number; date: string; beats: number }>;
  meta: { peak?: RankId };
  rep: Record<string, RepEntry>;
  repc: Record<string, CustomSong>;
  /**
   * avatar : apparence de départ choisie UNE fois (avatarConfirmed). Ce n'est pas une donnée de genre du joueur.
   * Les sauvegardes antérieures sans avatarConfirmed affichent le choix une seule fois, sans perte de données.
   */
  profile: { name: string; avatar: AvatarId; avatarConfirmed: boolean; theme: ThemeId; onboarded: boolean; sfx: boolean };
  shop: { spent: number; owned: string[]; equipped: Partial<Record<Slot, string | null>>; inv: { c_scroll: number; c_key: number } };
}

export function emptySave(): Save {
  return {
    v: 2, days: {}, items: {}, weeks: {}, records: {}, meta: {}, rep: {}, repc: {},
    profile: { name: 'Héros', avatar: 'boy', avatarConfirmed: false, theme: 'sakura', onboarded: false, sfx: true },
    shop: { spent: 0, owned: [], equipped: {}, inv: { c_scroll: 0, c_key: 0 } },
  };
}

export function dayOf(s: Save, k: string): Day {
  return s.days[k] ?? { q: [] };
}
