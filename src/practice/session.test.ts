import { describe, expect, it } from 'vitest';
import { blocksOf, completedWithoutSkip, finishBlock, newSession, parseSession, pause, remainingMs, start } from './session';
import { addPractice, practiceSeconds, sessionBlockDone } from '../game/actions';
import { emptySave } from '../game/model';
import { sanitize } from '../game/storage';
import { compute } from '../game/engine';

const T0 = 1_700_000_000_000;
const D = '2026-11-06';

describe('séance guidée — minuteur basé sur l’horloge', () => {
  it('décompte juste, pause et reprise', () => {
    let s = start(newSession(15, D, 0, 0), T0);           // bloc 1 = 2 min
    expect(remainingMs(s, T0 + 30_000)).toBe(90_000);
    s = pause(s, T0 + 30_000);
    expect(remainingMs(s, T0 + 600_000)).toBe(90_000);    // en pause : le temps ne file pas
    s = start(s, T0 + 600_000);
    expect(remainingMs(s, T0 + 610_000)).toBe(80_000);
  });
  it('un onglet en arrière-plan ne fausse pas le temps (aucun tick requis)', () => {
    const s = start(newSession(15, D, 0, 0), T0);
    expect(remainingMs(s, T0 + 5 * 60_000)).toBe(0);
  });
  it('survit à un aller-retour par le stockage (changement d’onglet, rechargement)', () => {
    const s = start(newSession(30, D, 120, 7), T0);
    const back = parseSession(JSON.stringify(s))!;
    expect(back).toEqual(s);
    expect(remainingMs(back, T0 + 10_000)).toBe(remainingMs(s, T0 + 10_000));
  });
  it('stockage corrompu → aucune séance, jamais de plantage', () => {
    for (const bad of [null, '', '{', '{"dur":7,"date":"x"}', '[]', '{"dur":30}']) expect(parseSession(bad)).toBeNull();
    expect(parseSession('{"dur":30,"date":"2026-11-06","idx":99,"acc":-5,"results":["done","x"]}')).toMatchObject({ idx: 5, acc: 0, results: ['done'] });
  });
  it('blocs terminés/sautés, temps compté plafonné, bonus seulement sans saut', () => {
    let s = start(newSession(15, D, 0, 0), T0);
    const n = blocksOf(s).length;
    let total = 0;
    for (let i = 0; i < n; i++) { const r = finishBlock(s, 'done', T0 + (i + 1) * 3_600_000); total += r.countedMs; s = r.state; }
    expect(s.finished).toBe(true);
    expect(completedWithoutSkip(s)).toBe(true);
    expect(total).toBe(15 * 60_000);                      // plafonné à la durée prévue de chaque bloc
    let k = start(newSession(15, D, 0, 0), T0);
    k = finishBlock(k, 'skipped', T0 + 1000).state;
    while (!k.finished) k = finishBlock(k, 'done', T0 + 2000).state;
    expect(completedWithoutSkip(k)).toBe(false);
  });
});

describe('temps de pratique enregistré dans la sauvegarde', () => {
  it('s’additionne, survit au nettoyage, et ne change pas l’XP', () => {
    let s = sessionBlockDone(emptySave(), 'echauf', D);
    const xp = compute(s).xp;
    s = addPractice(s, 125.4, D);
    s = addPractice(s, 60, D);
    expect(practiceSeconds(s, D)).toBe(185);
    expect(compute(s).xp).toBe(xp);
    expect(practiceSeconds(sanitize(JSON.parse(JSON.stringify(s))), D)).toBe(185);
    expect(practiceSeconds(addPractice(s, 1e9, D), D)).toBe(43_200);
  });
});
