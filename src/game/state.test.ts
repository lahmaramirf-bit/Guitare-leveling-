import { describe, expect, it } from 'vitest';
import { newGame, logSession, claimDaily, claimMain, openChest, invoke, equip, setAvatar, addSong, setSongStatus, grantMilestones } from './state';
import { dailyQuests } from './quests';
import { mulberry32 } from './rng';
import { currentStreak, sessionXp } from './sessions';
import { PULL_COST, PITY_LIMIT, rollRarity, RATES } from './gacha';
import type { GameState } from './types';

const NOW = new Date('2026-11-06T10:00:00');
const DAY = '2026-11-06';
const input = { exerciseId: 'open_chords', songId: null, minutes: 20, bpm: null, quality: 2 as const, notes: '' };

describe('séances', () => {
  it('XP = 10/min pondéré par la propreté, plafonné à 90 min', () => {
    expect(sessionXp(20, 2)).toBe(200);
    expect(sessionXp(20, 3)).toBe(240);
    expect(sessionXp(20, 1)).toBe(160);
    expect(sessionXp(500, 2)).toBe(900);
  });
  it('logSession crédite XP + cristaux et journalise', () => {
    const o = logSession(newGame(NOW), input, NOW, DAY, 's1');
    expect(o.xp).toBe(200);
    expect(o.state.xp).toBe(200);
    expect(o.state.crystals).toBe(4);
    expect(o.state.sessions).toHaveLength(1);
    expect(o.levelAfter).toBe(2);
  });
  it('série de jours consécutifs', () => {
    let s = newGame(NOW);
    for (const d of ['2026-11-03', '2026-11-04', '2026-11-05']) s = logSession(s, input, NOW, d, d).state;
    expect(currentStreak(s, DAY)).toBe(3); // hier compte encore
    expect(currentStreak(s, '2026-11-08')).toBe(0);
  });
});

describe('quêtes', () => {
  it('3 quêtes quotidiennes déterministes', () => {
    expect(dailyQuests(DAY).map((q) => q.id)).toEqual(dailyQuests(DAY).map((q) => q.id));
    expect(new Set(dailyQuests(DAY).map((q) => q.id)).size).toBe(3);
  });
  it('quête non terminée non réclamable ; réclamée une seule fois', () => {
    let s = newGame(NOW);
    const q = dailyQuests(DAY)[0];
    expect(claimDaily(s, q.id, DAY)).toBe(s);
    for (let i = 0; i < 3; i++) s = logSession(s, { ...input, minutes: 30, quality: 3, songId: 'x', exerciseId: ['open_chords', 'strumming_basic', 'pentatonic_minor'][i] }, NOW, DAY, 'id' + i).state;
    const before = s.xp;
    const after = claimDaily(s, q.id, DAY);
    expect(after.xp).toBe(before + q.rewardXp);
    expect(claimDaily(after, q.id, DAY)).toBe(after);
  });
  it('quête principale « Reprendre la guitare »', () => {
    let s = newGame(NOW);
    expect(claimMain(s, 'm_restart', DAY)).toBe(s);
    s = logSession(s, input, NOW, DAY, 'a').state;
    expect(claimMain(s, 'm_restart', DAY).crystals).toBe(s.crystals + 100);
  });
});

describe('coffre et invocation', () => {
  it('coffre une fois par jour, 20–50 cristaux', () => {
    const r = openChest(newGame(NOW), DAY, mulberry32(1));
    expect(r.reward).toBeGreaterThanOrEqual(20);
    expect(r.reward).toBeLessThanOrEqual(50);
    expect(openChest(r.state, DAY, mulberry32(2)).reward).toBe(0);
  });
  it('invocation impossible sans cristaux', () => {
    const s = newGame(NOW);
    expect(invoke(s, mulberry32(1)).result).toBeNull();
  });
  it('invocation débite, ajoute à l’inventaire ou rend des éclats', () => {
    let s: GameState = { ...newGame(NOW), crystals: PULL_COST * 30 };
    const rng = mulberry32(42);
    for (let i = 0; i < 30; i++) s = invoke(s, rng).state;
    expect(s.crystals).toBe(0);
    expect(s.inventory.length).toBeGreaterThan(newGame(NOW).inventory.length);
  });
  it('taux = 100 % et garantie légendaire', () => {
    expect(RATES.reduce((a, r) => a + r.pct, 0)).toBe(100);
    expect(rollRarity(() => 0.0, PITY_LIMIT - 1)).toBe('legendary');
  });
  it('distribution proche des taux affichés (100 000 tirages)', () => {
    const rng = mulberry32(7);
    const n = 100000;
    const c: Record<string, number> = {};
    for (let i = 0; i < n; i++) { const r = rollRarity(rng, 0); c[r] = (c[r] ?? 0) + 1; }
    for (const r of RATES) expect(Math.abs((c[r.rarity] / n) * 100 - r.pct)).toBeLessThan(0.6);
  });
});

describe('personnalisation', () => {
  it('impossible d’équiper un objet non possédé', () => {
    const s = newGame(NOW);
    expect(equip(s, 'guitar', 'guitar_crystal')).toBe(s);
  });
  it('déblocage par progrès musical (5 séances → casque)', () => {
    let s = newGame(NOW);
    for (let i = 0; i < 5; i++) s = logSession(s, input, NOW, DAY, 'k' + i).state;
    expect(s.inventory).toContain('acc_headphones');
    expect(equip(s, 'accessory', 'acc_headphones').appearance.loadout.accessory).toBe('acc_headphones');
  });
  it('rang D débloque la guitare de cristal', () => {
    const s = grantMilestones({ ...newGame(NOW), xp: 20400 }, DAY).state;
    expect(s.inventory).toContain('guitar_crystal');
  });
  it('changer d’avatar garde les objets compatibles et remplace les spécifiques', () => {
    const s = setAvatar(newGame(NOW), 'girl');
    expect(s.appearance.loadout.hair).toBe('hair_girl_coral');
    expect(s.appearance.loadout.bottom).toBe('bottom_pleated');
    expect(s.appearance.loadout.guitar).toBe('guitar_acoustic');
  });
});

describe('répertoire', () => {
  it('ajout / statut', () => {
    let s = addSong(newGame(NOW), { title: '  Wonderwall ', artist: 'Oasis', targetBpm: 87 }, 'w');
    expect(s.songs[0]).toMatchObject({ title: 'Wonderwall', status: 'a_apprendre' });
    s = setSongStatus(s, 'w', 'maitrise');
    expect(s.songs[0].status).toBe('maitrise');
    expect(addSong(s, { title: '   ', artist: '', targetBpm: null }, 'z')).toBe(s);
  });
});
