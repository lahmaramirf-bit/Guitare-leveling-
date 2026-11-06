/** Agrégats de progression utilisés par la boutique, les cristaux et l'interface. */
import { ACH, RANK_INDEX } from '../content';
import type { Save } from './model';
import { bestStreak, compute, effRank, levelOf, masteryState, shadows, unlockedAchievements, type Computed } from './engine';
import type { ReqKey } from './catalog';

export interface Progress {
  c: Computed; level: number; rankIdx: number; achievements: string[]; best: number; mastered: number; shadowCount: number;
  values: Record<ReqKey, number>;
}

export function progress(s: Save, today: string): Progress {
  const c = compute(s);
  const level = levelOf(c.xp);
  const rankIdx = RANK_INDEX(effRank(s, c.xp).id);
  const achievements = unlockedAchievements(s, c, today);
  const best = bestStreak(s, today);
  const mastered = masteryState(s).total;
  const shadowCount = shadows(s, today).length;
  return {
    c, level, rankIdx, achievements, best, mastered, shadowCount,
    values: {
      level, rank: rankIdx, quests: c.questsDone, perfectDays: c.perfectDays, daysPlayed: c.daysPlayed,
      hours: Math.floor(c.minutes / 60), bestStreak: best, portals: c.portals, weeks: c.weeksDone, records: c.recBeats,
      boss: c.boss, achievements: achievements.length, mastered, limitBreaks: c.lbN, shadows: shadowCount,
    },
  };
}

/**
 * Cristaux : entièrement déterminés par la progression réelle (aucun achat, aucun hasard).
 * Reprend la formule du projet de base ; les coffres aléatoires sont remplacés par des primes fixes.
 */
export function crystalParts(p: Progress) {
  return {
    'Expérience (1 / 50 XP)': Math.floor(p.c.xp / 50),
    'Niveaux (20 par niveau)': 20 * (p.level - 1),
    'Rangs (150 par rang)': 150 * p.rankIdx,
    'Succès (25 chacun)': 25 * p.achievements.length,
    'Journées parfaites (10)': 10 * p.c.perfectDays,
    'Portails fermés (10)': 10 * p.c.portals,
    'Défis hebdo (15)': 15 * p.c.weeksDone,
    'Boss vaincus (100)': 100 * p.c.boss,
    'Limit Break (20)': 20 * p.c.lbN,
  };
}
export function crystalsEarned(p: Progress): number {
  return Object.values(crystalParts(p)).reduce((a, b) => a + b, 0);
}
export function crystals(s: Save, p: Progress): number {
  return crystalsEarned(p) - s.shop.spent;
}

export const ACH_TOTAL = ACH.length;
