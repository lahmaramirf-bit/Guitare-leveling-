import { describe, expect, it } from 'vitest';
import { placement } from './placement';
import { placeLevel, toggleQuest } from './actions';
import { emptySave } from './model';
import { compute, effRank } from './engine';
import { sanitize } from './storage';

describe('questionnaire de niveau', () => {
  it('place prudemment, de E à B', () => {
    expect(placement([0, 0, 0]).rank).toBe('E');
    expect(placement([1, 1, 1]).rank).toBe('D');
    expect(placement([2, 2, 2]).rank).toBe('C');
    expect(placement([3, 3, 3]).rank).toBe('B');
  });
  it('fixe le rang effectif sans donner d’XP, jamais vers le bas, et survit au nettoyage', () => {
    let s = placeLevel(emptySave(), [2, 2, 2]);
    expect(compute(s).xp).toBe(0);
    expect(effRank(s, 0).id).toBe('C');
    s = placeLevel(s, [0, 0, 0]);
    expect(effRank(s, 0).id).toBe('C');
    s = toggleQuest(s, 'echauf', '2026-11-15');
    const back = sanitize(JSON.parse(JSON.stringify(s)));
    expect(back.meta.place).toEqual([0, 0, 0]);
    expect(effRank(back, compute(back).xp).id).toBe('C');
  });
});
