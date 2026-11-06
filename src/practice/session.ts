/**
 * Séance guidée : état persistant et minuteur basé sur l'horloge (pas sur un compteur de ticks).
 * - survit à un changement d'onglet/d'écran et à un rechargement de page ;
 * - reste juste si l'onglet est mis en arrière-plan (les navigateurs ralentissent setInterval).
 * Module pur : `now` est toujours passé en paramètre pour être testable.
 */
import type { QuestId } from '../content';

export const SESSION_PLANS: Record<number, [QuestId, number][]> = {
  15: [['echauf', 2], ['arp', 3], ['gamme', 2], ['etude', 4], ['morceau', 4]],
  30: [['echauf', 3], ['arp', 4], ['gamme', 4], ['lect', 2], ['etude', 7], ['morceau', 10]],
  45: [['echauf', 3], ['arp', 5], ['gamme', 5], ['theo', 5], ['lect', 2], ['etude', 10], ['morceau', 15]],
  60: [['echauf', 5], ['arp', 7], ['gamme', 7], ['theo', 6], ['lect', 5], ['etude', 12], ['morceau', 18]],
};
export const DURATIONS = [15, 30, 45, 60] as const;

export type BlockResult = 'done' | 'skipped';
export interface SessionState {
  dur: number;
  /** jour de la séance (YYYY-MM-DD) */
  date: string;
  idx: number;
  /** ms déjà écoulées sur le bloc courant (hors segment en cours) */
  acc: number;
  /** horodatage du début du segment en cours, null = en pause */
  since: number | null;
  results: BlockResult[];
  /** ms de pratique chronométrée cumulées sur toute la séance */
  practiced: number;
  finished: boolean;
  /** XP / cristaux au démarrage, pour le bilan */
  startXp: number;
  startCrystals: number;
}

export const blocksOf = (s: SessionState) => SESSION_PLANS[s.dur] ?? SESSION_PLANS[30];
export const blockMs = (s: SessionState) => blocksOf(s)[Math.min(s.idx, blocksOf(s).length - 1)][1] * 60_000;
export const elapsed = (s: SessionState, now: number) => s.acc + (s.since !== null ? Math.max(0, now - s.since) : 0);
export const remainingMs = (s: SessionState, now: number) => Math.max(0, blockMs(s) - elapsed(s, now));
export const isRunning = (s: SessionState) => s.since !== null && !s.finished;
export const isPristine = (s: SessionState) => s.idx === 0 && s.acc === 0 && s.since === null && s.results.length === 0;

export function newSession(dur: number, date: string, startXp: number, startCrystals: number): SessionState {
  return { dur: SESSION_PLANS[dur] ? dur : 30, date, idx: 0, acc: 0, since: null, results: [], practiced: 0, finished: false, startXp, startCrystals };
}
export function start(s: SessionState, now: number): SessionState {
  return s.finished || s.since !== null ? s : { ...s, since: now };
}
export function pause(s: SessionState, now: number): SessionState {
  return s.since === null ? s : { ...s, acc: elapsed(s, now), since: null };
}

/**
 * Termine (done) ou saute le bloc courant. Le temps réellement chronométré sur le bloc est
 * compté comme pratique (plafonné à la durée du bloc). Retourne aussi le temps compté, en ms.
 */
export function finishBlock(s: SessionState, result: BlockResult, now: number): { state: SessionState; countedMs: number } {
  if (s.finished) return { state: s, countedMs: 0 };
  const countedMs = Math.min(blockMs(s), elapsed(s, now));
  const results = [...s.results, result];
  const last = s.idx + 1 >= blocksOf(s).length;
  const wasRunning = s.since !== null;
  return {
    countedMs,
    state: { ...s, results, practiced: s.practiced + countedMs, idx: last ? s.idx : s.idx + 1, acc: 0, since: !last && wasRunning ? now : null, finished: last },
  };
}

export const completedWithoutSkip = (s: SessionState) => s.finished && s.results.length === blocksOf(s).length && s.results.every((r) => r === 'done');

/** Lecture tolérante depuis le stockage : toute donnée invalide → null (aucune séance en cours). */
export function parseSession(raw: string | null): SessionState | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Partial<SessionState>;
    if (!o || typeof o !== 'object' || !SESSION_PLANS[o.dur as number] || typeof o.date !== 'string') return null;
    const n = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) && x >= 0 ? x : 0);
    const len = SESSION_PLANS[o.dur as number].length;
    const results = Array.isArray(o.results) ? o.results.filter((r): r is BlockResult => r === 'done' || r === 'skipped').slice(0, len) : [];
    return {
      dur: o.dur as number, date: o.date, idx: Math.min(len - 1, Math.floor(n(o.idx))), acc: n(o.acc),
      since: typeof o.since === 'number' && Number.isFinite(o.since) ? o.since : null,
      results, practiced: n(o.practiced), finished: !!o.finished, startXp: n(o.startXp), startCrystals: n(o.startCrystals),
    };
  } catch { return null; }
}

export const SESSION_KEY = 'guitar-leveling:session';
export const fmtClock = (ms: number) => { const sec = Math.ceil(ms / 1000); return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`; };
export const fmtMinutes = (ms: number) => { const m = Math.round(ms / 60_000); return m < 1 ? '< 1 min' : `${m} min`; };
