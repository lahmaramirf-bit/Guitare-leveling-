/**
 * Parité avec le projet de base : on exécute son moteur d'XP d'origine dans un bac à sable
 * et on compare avec le nôtre sur des sauvegardes générées aléatoirement.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { compute, levelOf, rankOf } from './engine';
import { sanitize } from './storage';
import { QUESTS, RANKS, EXOS, PIECES, SONGS, RECS } from '../content';
import { mulberry } from './testutil';

const html = readFileSync(new URL('../../handoff/base-project/Guitar_Leveling_2.html', import.meta.url), 'utf8');
const lines = html.split('\n');
const start = lines.findIndex((l) => l === '<script>' ) + 1; // second <script> = app
const js = lines.slice(start).join('\n').split('</script>')[0].split('\n');
const grab = (from: string, to?: string) => {
  const a = js.findIndex((l) => l.startsWith(from));
  const b = to ? js.findIndex((l, i) => i > a && l.startsWith(to)) : a + 1;
  return js.slice(a, b).join('\n');
};

function originalEngine() {
  const code = [
    grab('const QUESTS', 'const $='),
    grab('function compute(', 'function migrate('),
    grab('const DIFF=', 'function REP()'),
    grab('function REP()', 'function maxDiffForRank'),
    grab('const LB_XP=', 'function renderLimit'),
  ].join('\n').replace(/^const CHECK=.*$/m, '');
  const ctx: Record<string, unknown> = {};
  vm.createContext(ctx);
  vm.runInContext('let S={};const today=()=>"2026-11-06";const dkey=d=>d.toISOString().slice(0,10);const dayStart=k=>new Date(k+"T12:00:00").getTime();' + code + ';globalThis.__api={setS:x=>{S=x},compute,levelOf,rankOf};', ctx);
  return ctx.__api as { setS: (x: unknown) => void; compute: () => { xp: number; minutes: number }; levelOf: (x: number) => number; rankOf: (x: number) => { id: string } };
}

function randomSave(seed: number) {
  const r = mulberry(seed);
  const pick = <T,>(a: readonly T[]) => a[Math.floor(r() * a.length)];
  const days: Record<string, unknown> = {};
  for (let i = 0; i < 80; i++) {
    if (r() < 0.3) continue;
    const k = `2026-${String(1 + Math.floor(i / 28)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`;
    const q = QUESTS.filter(() => r() < 0.7).map((x) => x.id);
    const d: Record<string, unknown> = { q };
    if (r() < 0.3) d.train = Math.floor(r() * 200);
    if (r() < 0.3) d.ex = Array.from({ length: Math.floor(r() * 15) }, () => pick(EXOS).id);
    if (r() < 0.2) d.rev = ['E-morceau-0', 'P-' + pick(PIECES).id];
    if (r() < 0.2) d.sr = Math.floor(r() * 9);
    if (r() < 0.2) d.urg = pick(RANKS).id === 'N' ? 'S' : pick(RANKS.slice(0, 6)).id;
    if (r() < 0.1) d.jam = Math.floor(r() * 5000);
    if (r() < 0.1) d.sess = 1 + Math.floor(r() * 3);
    if (r() < 0.1) d.lb = pick(RANKS).id;
    days[k] = d;
  }
  const items: Record<string, string> = {};
  for (const rk of RANKS) for (const kind of ['obj', 'theo', 'etude', 'morceau'] as const) (rk[kind] as unknown[]).forEach((_, i) => { if (r() < 0.3) items[`${rk.id}-${kind}-${i}`] = '2026-02-01'; });
  for (const rk of RANKS) if (r() < 0.2) items[`${rk.id}-boss-0`] = '2026-02-02';
  for (const p of PIECES) if (r() < 0.2) items['P-' + p.id] = '2026-02-03';
  const rep: Record<string, unknown> = {};
  for (const s of SONGS) if (r() < 0.1) { items[s.key] = '2026-02-04'; rep[s.id] = { s: 'm', st: [0, 1, 2], lb: r() < 0.5 ? [0, 2] : [] }; }
  const weeks = { '2026-01-05': ['w1', 'w3'], '2026-02-02': ['w0'] };
  const records = Object.fromEntries(RECS.filter(() => r() < 0.5).map(([id]) => [id, { best: 80, beats: 1 + Math.floor(r() * 4), date: '2026-01-01' }]));
  return { days, items, weeks, records, meta: {}, rep, repc: {} };
}

describe('parité avec le moteur du projet de base', () => {
  const orig = originalEngine();
  it('même XP, niveau et rang sur 200 sauvegardes aléatoires', () => {
    const xps: number[] = [];
    for (let seed = 1; seed <= 200; seed++) {
      const raw = randomSave(seed);
      orig.setS(JSON.parse(JSON.stringify(raw)));
      const o = orig.compute();
      const ours = compute(sanitize(raw));
      expect(ours.xp, `seed ${seed}`).toBe(o.xp);
      xps.push(o.xp);
      expect(Math.round(ours.minutes)).toBe(Math.round(o.minutes));
      expect(levelOf(ours.xp)).toBe(orig.levelOf(o.xp));
      expect(rankOf(ours.xp).id).toBe(orig.rankOf(o.xp).id);
    }
    // garde-fou : le test compare de vraies valeurs, variées (pas des zéros)
    expect(Math.min(...xps)).toBeGreaterThan(1000);
    expect(new Set(xps).size).toBeGreaterThan(190);
    console.log('XP comparées : min', Math.min(...xps), 'max', Math.max(...xps));
  });
});
