/**
 * Moteur de progression — portage fidèle du projet de base.
 * Tout est DÉRIVÉ des registres (jours, objets, semaines, records, répertoire) :
 * l'XP n'est jamais stockée, elle est recalculée → pas de triche par incohérence.
 */
import {
  ACH, COLLS, EXOS, GENRES, GRADES, LB_SONG, LB_SONG_XP, LB_XP, PIECES, PLAN, PORTAL_XP, QUESTS, RANKS, RANK_INDEX,
  RANK_MAP, REP_XP, SONG_MAP, STATS, STEP_XP, XP, XPK, DIFF_RANK, type Rank, type RankId, type Song, type StatId,
} from '../content';
import type { Save } from './model';
import { dayStart, addDays } from './dates';

export const xpFor = (L: number) => 75 * L * (L - 1);
export const levelOf = (xp: number) => Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * xp) / 75)) / 2));
export const rankMin = (r: Rank) => xpFor(r.lv);
export function rankOf(xp: number): Rank {
  let r = RANKS[0];
  for (const x of RANKS) if (xp >= rankMin(x)) r = x;
  return r;
}
/** Rang effectif : jamais en dessous du plus haut rang atteint. */
export function effRank(s: Save, xp: number): Rank {
  const r = rankOf(xp);
  const p = s.meta.peak ? RANK_MAP[s.meta.peak] : null;
  return p && RANK_INDEX(p.id) > RANK_INDEX(r.id) ? p : r;
}
export const stars = (L: number) => (L >= 100 ? Math.floor((L - 100) / 10) : 0);

export type XpSource = 'quetes' | 'donjons' | 'partitions' | 'repertoire' | 'entrainement' | 'exercices' | 'ombres' | 'lecture' | 'portails' | 'hebdo' | 'records' | 'jam' | 'sessions' | 'limit';
export const XP_SOURCE_LABELS: [XpSource, string][] = [
  ['quetes', 'Quêtes quotidiennes'], ['donjons', 'Donjons'], ['partitions', 'Partitions'], ['ombres', 'Armée des ombres'],
  ['exercices', 'Exercices'], ['entrainement', 'Quiz et entraînement'], ['lecture', 'Lecture à vue'], ['portails', 'Portails'],
  ['hebdo', 'Défis hebdo'], ['records', 'Records'], ['repertoire', 'Répertoire'], ['jam', 'Accompagnement'],
  ['sessions', 'Sessions guidées'], ['limit', 'Limit Break'],
];

export interface Computed {
  xp: number; src: Record<XpSource, number>; st: Record<StatId, number>; minutes: number;
  daysPlayed: number; perfectDays: number; questsDone: number; weeksDone: number; recBeats: number;
  boss: number; songs: number; pieces: number; exN: number; revN: number; srN: number; portals: number;
  jamSec: number; sessN: number; lbN: number;
}

export function songById(s: Save, id: string): Song | undefined {
  if (SONG_MAP[id]) return SONG_MAP[id];
  const c = s.repc[id];
  return c ? { id, key: 'R-' + id, t: c.t, src: 'Morceau perso', by: c.by, g: c.g, col: null, d: c.d, tech: [], tips: [], custom: true } : undefined;
}
export function allSongs(s: Save): Song[] {
  return [...Object.values(SONG_MAP), ...Object.keys(s.repc).map((id) => songById(s, id)!)];
}
export const isMastered = (s: Save, song: Song) => !!s.items[song.key];

export function compute(s: Save): Computed {
  const src = Object.fromEntries(XP_SOURCE_LABELS.map(([k]) => [k, 0])) as Record<XpSource, number>;
  const st = Object.fromEntries(STATS.map(([k]) => [k, 0])) as Record<StatId, number>;
  const c: Computed = { xp: 0, src, st, minutes: 0, daysPlayed: 0, perfectDays: 0, questsDone: 0, weeksDone: 0, recBeats: 0, boss: 0, songs: 0, pieces: 0, exN: 0, revN: 0, srN: 0, portals: 0, jamSec: 0, sessN: 0, lbN: 0 };
  const qm = Object.fromEntries(QUESTS.map((q) => [q.id, q]));
  const em = Object.fromEntries(EXOS.map((e) => [e.id, e]));
  const exStat: Record<string, StatId> = { mg: 'FOR', md: 'DEX', coord: 'AGI', expr: 'CHA' };

  for (const k in s.days) {
    const d = s.days[k];
    const q = d.q ?? [];
    let act = q.length > 0;
    for (const id of q) {
      const Q = qm[id];
      if (!Q) continue;
      src.quetes += Q.xp; st[Q.stat]++; c.minutes += Q.min; c.questsDone++;
    }
    if (q.length === QUESTS.length) { src.quetes += XP.bonus; c.perfectDays++; }
    const tr = Math.min(XP.trainCap, d.train ?? 0);
    if (tr) { src.entrainement += tr; st.PER += Math.floor(tr / 12); act = true; }
    const ex = d.ex ?? [];
    if (ex.length) {
      c.exN += ex.length; src.exercices += Math.min(XP.exCap, ex.length) * XP.ex; c.minutes += ex.length * 3;
      ex.slice(0, XP.exCap).forEach((id) => { const E = em[id]; if (E && exStat[E.cat]) st[exStat[E.cat]]++; });
      act = true;
    }
    const rv = d.rev ?? [];
    if (rv.length) { c.revN += rv.length; src.ombres += Math.min(XP.revCap, rv.length) * XP.rev; c.minutes += rv.length * 4; st.CHA += Math.min(XP.revCap, rv.length); act = true; }
    if (d.sr) { c.srN += d.sr; src.lecture += Math.min(XP.srCap, d.sr) * XP.sr; c.minutes += d.sr * 2; st.PER += Math.min(XP.srCap, d.sr); act = true; }
    if (d.urg) { c.portals++; src.portails += PORTAL_XP[d.urg] ?? 120; st.END += 2; act = true; }
    if (d.jam) { c.jamSec += d.jam; src.jam += Math.min(XP.jamCap, Math.floor(d.jam / 60) * XP.jamMin); c.minutes += d.jam / 60; st.CHA += Math.floor(d.jam / 600); act = true; }
    if (d.sess) { c.sessN += d.sess; src.sessions += Math.min(XP.sessCap, d.sess) * XP.sess; st.END += d.sess; act = true; }
    if (d.lb) { c.lbN++; src.limit += LB_XP[d.lb] ?? 80; st.END++; act = true; }
    if (act) c.daysPlayed++;
  }
  for (const k in s.weeks) { const n = (s.weeks[k] ?? []).length; c.weeksDone += n; src.hebdo += n * XP.week; }
  for (const k in s.records) { const n = s.records[k]?.beats ?? 0; c.recBeats += n; src.records += n * XP.rec; }

  // Répertoire : morceaux maîtrisés + étapes du plan
  for (const k in s.items) {
    if (!s.items[k] || !k.startsWith('R-')) continue;
    const song = songById(s, k.slice(2));
    if (!song) continue;
    src.repertoire += REP_XP[song.d] ?? 0; c.songs++; st.CHA += 1; if (song.d >= 4) st.DEX += 1;
  }
  for (const id in s.rep) {
    const e = s.rep[id];
    if (e?.st?.length && (SONG_MAP[id] || s.repc[id])) src.repertoire += Math.min(PLAN.length, e.st.length) * STEP_XP;
    // Limit Break de morceau
    if (e?.lb?.length) { const song = songById(s, id); if (song && isMastered(s, song)) { const n = Math.min(LB_SONG.length, e.lb.length); src.limit += n * LB_SONG_XP; c.lbN += n; } }
  }
  // Donjons et partitions
  for (const id in s.items) {
    if (!s.items[id] || id.startsWith('R-')) continue;
    if (id.startsWith('P-')) { if (PIECES.some((p) => 'P-' + p.id === id)) { src.partitions += XPK.P; c.pieces++; st.CHA++; } continue; }
    const kind = id.split('-')[1] as keyof typeof XPK;
    src.donjons += XPK[kind] ?? 0;
    if (kind === 'boss') { c.boss++; st.END += 3; } else if (kind === 'morceau') { c.songs++; st.CHA += 2; } else if (kind === 'theo') st.INT += 2; else if (kind === 'etude') st.END += 2; else if (kind === 'obj') st.FOR++;
  }
  c.xp = Object.values(src).reduce((a, b) => a + b, 0);
  return c;
}

/** Une journée compte pour la série avec 5 quêtes sur 7 (ou un parchemin). */
export function qualifies(s: Save, k: string): boolean {
  const d = s.days[k];
  return !!(d && ((d.q ?? []).length >= 5 || d.freeze));
}
export function streak(s: Save, today: string): number {
  let k = qualifies(s, today) ? today : addDays(today, -1);
  let n = 0;
  while (qualifies(s, k)) { n++; k = addDays(k, -1); }
  return n;
}
export function bestStreak(s: Save, today: string): number {
  const ks = Object.keys(s.days).filter((k) => qualifies(s, k)).sort();
  let best = 0, cur = 0, prev: number | null = null;
  for (const k of ks) { const t = dayStart(k); cur = prev !== null && Math.round((t - prev) / 86400000) === 1 ? cur + 1 : 1; best = Math.max(best, cur); prev = t; }
  return Math.max(best, streak(s, today));
}

export interface Shadow { id: string; n: string; o: string; r: RankId; boss?: boolean; last: string | null; count: number; ago: number | null; power: number; grade: string }
/** Armée des ombres : chaque morceau appris perd de la puissance s'il n'est pas rejoué. */
export function shadows(s: Save, today: string): Shadow[] {
  const out: Omit<Shadow, 'last' | 'count' | 'ago' | 'power' | 'grade'>[] = [];
  for (const r of RANKS) {
    r.morceau.forEach((m, i) => { const id = `${r.id}-morceau-${i}`; if (s.items[id]) out.push({ id, n: m[0], o: 'Donjon ' + r.id, r: r.id }); });
    const b = `${r.id}-boss-0`;
    if (s.items[b]) out.push({ id: b, n: r.boss[0], o: 'Boss ' + r.id, r: r.id, boss: true });
  }
  for (const p of PIECES) { const id = 'P-' + p.id; if (s.items[id]) out.push({ id, n: p.t, o: 'Partition', r: p.r }); }
  for (const k in s.items) {
    if (!s.items[k] || !k.startsWith('R-')) continue;
    const song = songById(s, k.slice(2));
    if (song) out.push({ id: k, n: song.t, o: GENRES[song.g]?.n ?? 'Perso', r: DIFF_RANK[song.d] ?? 'E' });
  }
  const last: Record<string, string> = {}, cnt: Record<string, number> = {};
  for (const k in s.days) for (const id of s.days[k].rev ?? []) { cnt[id] = (cnt[id] ?? 0) + 1; if (!last[id] || k > last[id]) last[id] = k; }
  const t0 = dayStart(today);
  return out.map((x) => {
    const v = s.items[x.id];
    const learned = typeof v === 'string' ? v : null;
    const l = last[x.id] ?? learned;
    const ago = l ? Math.max(0, Math.round((t0 - dayStart(l)) / 86400000)) : null;
    const power = ago == null ? 60 : Math.max(0, Math.min(100, Math.round(100 - (Math.max(0, ago - 7) * 100) / 53)));
    const count = cnt[x.id] ?? 0;
    let grade = GRADES[0][1];
    for (const [n, lab] of GRADES) if (count >= n) grade = lab;
    return { ...x, last: l, count, ago, power, grade };
  });
}

export interface Mastery { byG: Record<string, number>; byC: Record<string, number>; un: Set<string>; src: Record<string, { kind: 'g' | 'c'; key: string; need: number; have: number }>; total: number }
/** Personnalisations gagnées en maîtrisant des morceaux (par genre et par collection). */
export function masteryState(s: Save): Mastery {
  const byG: Record<string, number> = {}, byC: Record<string, number> = {};
  let total = 0;
  for (const song of allSongs(s)) {
    if (!isMastered(s, song)) continue;
    total++; byG[song.g] = (byG[song.g] ?? 0) + 1;
    if (song.col) byC[song.col] = (byC[song.col] ?? 0) + 1;
  }
  const un = new Set<string>();
  const src: Mastery['src'] = {};
  for (const [g, G] of Object.entries(GENRES)) for (const [n, id] of G.tiers) { src[id] = { kind: 'g', key: g, need: n, have: byG[g] ?? 0 }; if ((byG[g] ?? 0) >= n) un.add(id); }
  for (const [c, C] of Object.entries(COLLS)) { src[C.rw] = { kind: 'c', key: c, need: C.need, have: byC[c] ?? 0 }; if ((byC[c] ?? 0) >= C.need) un.add(C.rw); }
  return { byG, byC, un, src, total };
}

export function achContext(s: Save, c: Computed, today: string): Record<string, number> {
  const ms = masteryState(s);
  return {
    lb: c.lbN, rep: ms.total, repG: Object.keys(ms.byG).length,
    repC: Object.keys(COLLS).filter((k) => (ms.byC[k] ?? 0) >= COLLS[k].need).length,
    best: bestStreak(s, today), days: c.daysPlayed, hours: c.minutes / 60, boss: c.boss, songs: c.songs, recs: c.recBeats,
    weeks: c.weeksDone, lv: levelOf(c.xp), shadows: shadows(s, today).length, revs: c.revN, sr: c.srN, ex: c.exN,
    portals: c.portals, jamMin: c.jamSec / 60, pieces: c.pieces, piecesTotal: PIECES.length, sess: c.sessN,
  };
}
export function unlockedAchievements(s: Save, c: Computed, today: string): string[] {
  const x = achContext(s, c, today);
  return ACH.filter((a) => (x[a.key] ?? 0) >= (typeof a.min === 'number' ? a.min : x[a.min])).map((a) => a.id);
}
