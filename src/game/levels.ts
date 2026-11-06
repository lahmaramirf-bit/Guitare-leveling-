/**
 * Courbe de progression.
 * XP nécessaire pour passer du niveau n à n+1 = 150 × n.
 * XP cumulé pour atteindre le niveau L = 150 × L(L−1)/2  (niveau 17 → 20 400 XP, rang D).
 */
export const XP_STEP = 150;
export const MAX_LEVEL = 99;

export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
export const RANKS: { rank: Rank; minLevel: number; label: string }[] = [
  { rank: 'E', minLevel: 1, label: 'Apprenti' },
  { rank: 'D', minLevel: 17, label: 'Musicien' },
  { rank: 'C', minLevel: 30, label: 'Interprète' },
  { rank: 'B', minLevel: 45, label: 'Virtuose en herbe' },
  { rank: 'A', minLevel: 60, label: 'Virtuose' },
  { rank: 'S', minLevel: 80, label: 'Légende' },
];

const TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 1, title: 'Maladroit' },
  { minLevel: 3, title: 'Débutant éveillé' },
  { minLevel: 6, title: 'Gratteur assidu' },
  { minLevel: 10, title: 'Main gauche agile' },
  { minLevel: 17, title: 'Musicien confirmé' },
  { minLevel: 30, title: 'Maître du tempo' },
  { minLevel: 45, title: 'Âme de scène' },
  { minLevel: 60, title: 'Virtuose' },
  { minLevel: 80, title: 'Légende vivante' },
];

export function xpToReachLevel(level: number): number {
  return (XP_STEP * level * (level - 1)) / 2;
}

export function levelFromXp(totalXp: number): number {
  let lvl = 1;
  while (lvl < MAX_LEVEL && totalXp >= xpToReachLevel(lvl + 1)) lvl++;
  return lvl;
}

export function levelProgress(totalXp: number) {
  const level = levelFromXp(totalXp);
  const base = xpToReachLevel(level);
  const needed = level >= MAX_LEVEL ? 0 : XP_STEP * level;
  return { level, current: totalXp - base, needed };
}

export function rankForLevel(level: number) {
  let r = RANKS[0];
  for (const x of RANKS) if (level >= x.minLevel) r = x;
  return r;
}

export function nextRank(level: number) {
  return RANKS.find((r) => r.minLevel > level) ?? null;
}

export function titleForLevel(level: number): string {
  let t = TITLES[0].title;
  for (const x of TITLES) if (level >= x.minLevel) t = x.title;
  return t;
}
