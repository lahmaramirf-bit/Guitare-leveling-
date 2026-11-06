/**
 * Contenu pédagogique repris du projet de base (Guitar_Leveling_2.html),
 * extrait automatiquement par tools/extract*.cjs. Aucune donnée visuelle.
 */
import base from './base.json';
import rep from './repertoire.json';

export type RankId = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'N';
export type StatId = 'FOR' | 'DEX' | 'AGI' | 'INT' | 'PER' | 'END' | 'CHA';
export type QuestId = 'echauf' | 'arp' | 'gamme' | 'theo' | 'lect' | 'etude' | 'morceau';

export interface Quest { id: QuestId; name: string; stat: StatId; xp: number; min: number }
export interface Rank {
  id: RankId; lv: number; name: string; period: string; short: string; title: string; intro: string;
  obj: [string, string][]; theo: [string, string][]; etude: [string, string][];
  morceau: [string, string, string][]; boss: [string, string];
}
export interface Portal { r: RankId; t: string; d: string }
export interface Achievement { id: string; name: string; desc: string; key: string; min: number | string }
export interface Piece { id: string; t: string; by: string; r: RankId; cat: string; tech?: string[]; tips?: string[]; [k: string]: unknown }
export interface Exo { id: string; cat: string; n: string; r: RankId; how: string; [k: string]: unknown }
export interface Genre { n: string; d: string; L: string; J: string; tiers: [number, string][] }
export interface Collection { n: string; g: string; rw: string; need: number }

const B = base as unknown as {
  QUESTS: Quest[]; XP: Record<string, number>; XPK: Record<string, number>; PORTAL_XP: Record<string, number>;
  STATS: [StatId, string, string][]; DAILY: Record<RankId, Record<'echauf' | 'arp' | 'gamme' | 'lect', string>>;
  RANKS: Rank[]; WEEKLY: [string, string][]; RECS: [string, string, string, 'bpm' | 'count'][];
  ACH: Achievement[]; PORTALS: Portal[]; GRADES: [number, string][];
  PIECES: Piece[]; PCAT: Record<string, string>; LEXG: [string, string][]; LEX: unknown[];
  EXCAT: [string, string][]; EXOS: Exo[]; TCAT: Record<string, [string, string]>; TIPS: [string, string][];
  LAWS: [string, string][]; METHOD: [string, string][]; SESSION_PLAN: [string, number, string][];
  TEMPI: [string, number][];
};
const R = rep as unknown as {
  DIFF: (null | [string, string])[]; DIFF_RANK: (null | RankId)[]; REP_XP: number[]; STEP_XP: number;
  GENRES: Record<string, Genre>; GORDER: string[]; COLLS: Record<string, Collection>;
  SONGS_RAW: [string, string, string, string, string, string | null, number, string, string, unknown?][];
  PIECE_GENRE: Record<string, string>; RANK_DIFF: Record<string, number>; PLAN: string[];
  COMPAS: Record<string, unknown>; LB_XP: Record<RankId, number>; LB_SONG_XP: number;
  LB_POOL: Record<string, [string, string, StatId][]>;
};

export const QUESTS = B.QUESTS;
export const XP = B.XP as {
  bonus: number; week: number; rec: number; ex: number; exCap: number; rev: number; revCap: number; sr: number; srCap: number;
  trainCap: number; quiz: number; jamMin: number; jamCap: number; sess: number; sessCap: number;
};
export const XPK = B.XPK as { obj: number; theo: number; etude: number; morceau: number; boss: number; P: number };
export const PORTAL_XP = B.PORTAL_XP as Record<string, number>;
export const STATS = B.STATS;
export const DAILY = B.DAILY;
export const RANKS = B.RANKS;
export const WEEKLY = B.WEEKLY;
export const RECS = B.RECS;
export const ACH = B.ACH;
export const PORTALS = B.PORTALS;
export const GRADES = B.GRADES;
export const PIECES = B.PIECES;
export const EXOS = B.EXOS;
export const TCAT = B.TCAT;
export const TIPS = B.TIPS;
export const LAWS = B.LAWS;
export const METHOD = B.METHOD;
export const SESSION_PLAN = B.SESSION_PLAN;

export const DIFF = R.DIFF;
export const DIFF_RANK = R.DIFF_RANK;
export const REP_XP = R.REP_XP;
export const STEP_XP = R.STEP_XP;
export const GENRES = R.GENRES;
export const GORDER = R.GORDER;
export const COLLS = R.COLLS;
export const PLAN = R.PLAN;
export const LB_XP = R.LB_XP;
export const LB_SONG_XP = R.LB_SONG_XP;
export const LB_POOL = R.LB_POOL;

export interface Song {
  id: string; key: string; t: string; src: string; by: string; g: string; col: string | null; d: number;
  tech: string[]; tips: { k: string; t: string }[]; imslp?: boolean; pd?: string; custom?: boolean;
}

export const SONGS: Song[] = [
  ...R.SONGS_RAW.map(([id, t, src, by, g, col, d, tech, tips, ex]) => ({
    id, key: 'R-' + id, t, src, by, g, col, d,
    tech: tech.split('|'),
    tips: tips.split('|').map((x) => ({ k: x[0], t: x.slice(2) })),
    imslp: ex === 'imslp',
  })),
  ...PIECES.map((p) => ({
    id: 'p-' + p.id, key: 'P-' + p.id, t: p.t, src: 'Partition jouable', by: p.by,
    g: R.PIECE_GENRE[p.cat] ?? 'chanson', col: null, d: R.RANK_DIFF[p.r] ?? 1,
    tech: p.tech ?? [], tips: (p.tips ?? []).map((x, i) => ({ k: i === 0 ? 'L' : 'J', t: x })), pd: p.id,
  })),
];
export const SONG_MAP: Record<string, Song> = Object.fromEntries(SONGS.map((s) => [s.id, s]));

/** Défis de Limit Break propres à un morceau maîtrisé. */
export const LB_SONG: [string, (bpm?: number) => string][] = [
  ['Tempo +20 %', (bpm) => (bpm ? `Ton tempo noté : ♩ = ${bpm}. Vise ♩ = ${Math.round(bpm * 1.2)}, proprement, trois fois de suite.` : 'Note ton tempo plus bas, puis vise 20 % plus vite, proprement, trois fois de suite.')],
  ['Par cœur, sans filet', () => 'Du début à la fin, sans partition ni tablature, sans t’arrêter.'],
  ['Version concert', () => 'Enregistre-le d’une traite avec les nuances, puis fais-le écouter à quelqu’un.'],
];

export const RANK_INDEX = (id: RankId): number => RANKS.findIndex((r) => r.id === id);
export const RANK_MAP = Object.fromEntries(RANKS.map((r) => [r.id, r])) as Record<RankId, Rank>;
