import { describe, expect, it } from 'vitest';
import { emptySave } from './model';
import * as A from './actions';
import { compute, levelOf, streak, bestStreak, shadows, masteryState, effRank } from './engine';
import { progress, crystals } from './progress';
import { questDescs, todayPortal, weeklyChallenges, penalty, lbToday } from './daily';
import { ITEM, SHOP } from './catalog';
import { QUESTS, RANKS, COLLS, SONGS } from '../content';
import { load, save, importJson, exportJson, sanitize, STORAGE_KEY, LEGACY_KEY, type KV } from './storage';
import { addDays } from './dates';

const T = '2026-11-06';
const all7 = (s = emptySave(), day = T) => QUESTS.reduce((acc, q) => A.toggleQuest(acc, q.id, day), s);
const kv = (): KV & { m: Map<string, string> } => { const m = new Map<string, string>(); return { m, getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v) }; };

describe('quêtes quotidiennes', () => {
  it('7 quêtes = 200 XP + 80 de bonus (journée parfaite)', () => {
    const c = compute(all7());
    expect(c.src.quetes).toBe(QUESTS.reduce((a, q) => a + q.xp, 0) + 80);
    expect(c.perfectDays).toBe(1);
  });
  it('cocher deux fois annule', () => {
    const s = A.toggleQuest(A.toggleQuest(emptySave(), 'arp', T), 'arp', T);
    expect(compute(s).xp).toBe(0);
  });
  it('la série tient avec 5 quêtes sur 7', () => {
    let s = emptySave();
    for (let i = 0; i < 3; i++) for (const q of QUESTS.slice(0, 5)) s = A.toggleQuest(s, q.id, addDays(T, -i));
    expect(streak(s, T)).toBe(3);
    expect(bestStreak(s, T)).toBe(3);
  });
  it('consignes adaptées au rang', () => {
    const d = questDescs(emptySave(), RANKS[0], T);
    expect(d.theo).toContain('Fiche du rang E');
    expect(d.morceau).toContain('Ode à la joie');
  });
});

describe('portail, hebdo, Limit Break', () => {
  it('portail déterministe, fermeture = XP du rang', () => {
    const p = todayPortal(emptySave(), RANKS[0], T);
    expect(todayPortal(emptySave(), RANKS[0], T)).toEqual(p);
    expect(compute(A.togglePortal(emptySave(), p.r, T)).src.portails).toBe(120);
  });
  it('3 défis hebdo, +150 XP chacun', () => {
    const w = weeklyChallenges(T);
    expect(w.list).toHaveLength(3);
    expect(compute(A.toggleWeekly(emptySave(), w.list[0].id, T)).src.hebdo).toBe(150);
  });
  it('Limit Break verrouillé avant 7/7, puis +XP du rang du défi', () => {
    expect(() => A.lbOpen(emptySave(), T)).toThrow();
    let s = A.lbOpen(all7(), T);
    const [ch, rk] = lbToday(s, RANKS[0], T);
    s = A.lbDone(s, T, rk, ch[0]);
    expect(compute(s).src.limit).toBeGreaterThanOrEqual(80);
  });
  it('pénalité si hier manqué, parchemin sauve la série', () => {
    let s = all7(emptySave(), addDays(T, -2));
    expect(penalty(s, T).show).toBe(true);
    s = { ...s, shop: { ...s.shop, inv: { c_scroll: 1, c_key: 0 } } };
    expect(penalty(s, T).canSave).toBe(true);
    s = A.useScroll(s, T);
    expect(streak(s, T)).toBe(2);
  });
});

describe('donjons, records, ombres', () => {
  it('boss vaincu + morceau → ombres', () => {
    let s = A.toggleItem(emptySave(), 'E-boss-0', T);
    s = A.toggleItem(s, 'E-morceau-1', T);
    expect(compute(s).boss).toBe(1);
    expect(shadows(s, T).map((x) => x.id)).toEqual(['E-morceau-1', 'E-boss-0']);
    expect(shadows(s, addDays(T, 60))[0].power).toBeLessThan(5);
    s = A.toggleRevision(s, 'E-boss-0', addDays(T, 60));
    expect(shadows(s, addDays(T, 60)).find((x) => x.id === 'E-boss-0')!.power).toBe(100);
  });
  it('record : seulement s’il est battu', () => {
    let s = A.beatRecord(emptySave(), 'gamme', 80, T);
    expect(() => A.beatRecord(s, 'gamme', 80, T)).toThrow();
    s = A.beatRecord(s, 'gamme', 84, T);
    expect(compute(s).src.records).toBe(80);
  });
  it('le rang atteint ne redescend jamais (peak)', () => {
    let s = emptySave();
    for (const id of ['E-boss-0', 'D-boss-0', 'C-boss-0', 'B-boss-0', 'A-boss-0', 'S-boss-0']) s = A.toggleItem(s, id, T);
    for (let i = 0; i < 30; i++) s = all7(s, addDays(T, -i));
    const top = effRank(s, compute(s).xp).id;
    s = A.toggleItem(s, 'S-boss-0', T);
    expect(effRank(s, compute(s).xp).id).toBe(top);
  });
});

describe('répertoire et maîtrise', () => {
  it('plan d’apprentissage + maîtrise = XP du niveau du morceau', () => {
    const song = SONGS.find((x) => x.d === 2 && !x.pd)!;
    let s = A.toggleStep(emptySave(), song.id, 0, 1);
    expect(s.rep[song.id].s).toBe('c');
    s = A.setSongStatus(s, song.id, 'm', T);
    expect(compute(s).src.repertoire).toBe(10 + 250);
    expect(questDescs(A.setSongStatus(emptySave(), song.id, 'c', T, 5), RANKS[0], T).morceau).toContain(song.t);
  });
  it('collection complète → personnalisation « Maîtrise » débloquée', () => {
    const [key, C] = Object.entries(COLLS)[0];
    const songs = SONGS.filter((x) => x.col === key).slice(0, C.need);
    let s = emptySave();
    for (const x of songs) s = A.setSongStatus(s, x.id, 'm', T);
    expect(masteryState(s).un.has(C.rw)).toBe(true);
    expect(A.isOwned(s, C.rw)).toBe(true);
  });
  it('morceau perso', () => {
    const s = A.addCustomSong(emptySave(), { t: 'Ma compo', by: 'Moi', g: 'chanson', d: 2 }, 'x1');
    expect(() => A.addCustomSong(s, { t: ' ', by: '', g: 'chanson', d: 1 }, 'x2')).toThrow();
    expect(A.deleteCustomSong(s, 'x1').repc).toEqual({});
  });
});

describe('boutique sans hasard', () => {
  it('aucun objet aléatoire : chaque objet de boutique a un prix ET une condition', () => {
    for (const it of SHOP) { expect(it.price).toBeGreaterThan(0); expect(it.req).toBeDefined(); }
  });
  it('cristaux dérivés de la progression uniquement', () => {
    const s = all7();
    const p = progress(s, T);
    expect(crystals(s, p)).toBe(Math.floor(p.c.xp / 50) + 20 * (levelOf(p.c.xp) - 1) + 10);
  });
  it('condition non remplie → refus, même avec assez de cristaux', () => {
    let s = emptySave();
    for (let i = 0; i < 40; i++) s = all7(s, addDays(T, -i));
    expect(() => A.buy(s, 'guitar_crystal', T)).toThrow('Condition');
  });
  it('condition remplie + cristaux → achat, débit, équipement', () => {
    let s = emptySave();
    for (let i = 0; i < 3; i++) s = all7(s, addDays(T, -i));
    const before = crystals(s, progress(s, T));
    s = A.buy(s, 't1', T);
    expect(crystals(s, progress(s, T))).toBe(before - ITEM.t1.price!);
    expect(() => A.buy(s, 't1', T)).toThrow();
    s = A.equip(s, 'title', 't1');
    expect(A.equipped(s, 'title')).toBe('t1');
  });
  it('pas assez de cristaux → refus', () => {
    const s = A.toggleQuest(A.toggleQuest(emptySave(), 'arp', T), 'gamme', T);
    expect(() => A.buyConsumable(s, 'c_scroll', T)).toThrow('cristaux');
  });
  it('objet de maîtrise non équipable avant déblocage', () => {
    expect(() => A.equip(emptySave(), 'hair', 'h_blanc')).toThrow();
  });
});

describe('sauvegarde', () => {
  it('aller-retour sans perte', () => {
    const k = kv();
    const s = A.toggleItem(all7(), 'E-obj-0', T);
    save(k, s);
    expect(load(k).save).toEqual(s);
  });
  it('reprend automatiquement la sauvegarde du projet de base', () => {
    const k = kv();
    k.setItem(LEGACY_KEY, JSON.stringify({ days: { [T]: { q: ['arp', 'gamme', 'bidon'], train: 30 } }, items: { 'E-obj-0': '2026-11-01' }, weeks: {}, records: {}, meta: { v: 4, peak: 'D' }, gacha: { spent: 99 }, rep: {}, repc: {}, ui: {} }));
    const { save: s, migrated } = load(k);
    expect(migrated).toBe(true);
    expect(s.days[T].q).toEqual(['arp', 'gamme']);
    expect(s.meta.peak).toBe('D');
    expect(compute(s).xp).toBe(30 + 30 + 30 + 120);
  });
  it('export/import + sauvegarde corrompue conservée', () => {
    const k = kv();
    const s = all7();
    expect(compute(importJson(k, exportJson(s), emptySave())).xp).toBe(compute(s).xp);
    expect(() => importJson(k, '{"x":1}', s)).toThrow();
    k.setItem(STORAGE_KEY, '{oops');
    expect(load(k).save.days).toEqual({});
    expect([...k.m.keys()].some((x) => x.includes('corrupt'))).toBe(true);
  });
  it('données invalides ignorées champ par champ', () => {
    const s = sanitize({ days: { 'pas-une-date': { q: ['arp'] }, [T]: { q: ['arp'], urg: 'Z', train: -5 } }, items: { 'E-obj-0': 1 }, shop: { owned: ['inexistant', 't1'], spent: 'x' } });
    expect(Object.keys(s.days)).toEqual([T]);
    expect(s.days[T].urg).toBeUndefined();
    expect(s.shop.owned).toEqual(['t1']);
    expect(s.shop.spent).toBe(0);
  });
});
