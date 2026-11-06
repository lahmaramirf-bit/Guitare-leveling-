import { describe, expect, it } from 'vitest';
import { levelFromXp, levelProgress, rankForLevel, titleForLevel, xpToReachLevel, nextRank } from './levels';

describe('courbe de niveaux', () => {
  it('niveau 1 → 2 demande 150 XP', () => {
    expect(levelProgress(0)).toEqual({ level: 1, current: 0, needed: 150 });
    expect(levelFromXp(149)).toBe(1);
    expect(levelFromXp(150)).toBe(2);
  });
  it('rang D au niveau 17 = 20 400 XP cumulés', () => {
    expect(xpToReachLevel(17)).toBe(20400);
    expect(rankForLevel(levelFromXp(20399)).rank).toBe('E');
    expect(rankForLevel(levelFromXp(20400)).rank).toBe('D');
    expect(nextRank(1)?.rank).toBe('D');
  });
  it('titres progressifs', () => {
    expect(titleForLevel(1)).toBe('Maladroit');
    expect(titleForLevel(3)).toBe('Débutant éveillé');
  });
});
