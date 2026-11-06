import type { GameState, Quality, Session } from './types';
import { addDays } from './dates';

export const MAX_SESSION_MINUTES = 90;
const QUALITY_MULT: Record<Quality, number> = { 1: 0.8, 2: 1, 3: 1.2 };

/**
 * XP d'une séance : 10 XP par minute réellement déclarée (plafond 90 min),
 * pondéré par l'auto-évaluation de propreté. Validation déclarative : l'app
 * ne prétend pas analyser le son.
 */
export function sessionXp(minutes: number, quality: Quality): number {
  const m = Math.max(0, Math.min(MAX_SESSION_MINUTES, Math.floor(minutes)));
  return Math.round(m * 10 * QUALITY_MULT[quality]);
}

/** Cristaux gagnés par séance : 1 par tranche de 5 minutes. */
export function sessionCrystals(minutes: number): number {
  return Math.floor(Math.max(0, Math.min(MAX_SESSION_MINUTES, minutes)) / 5);
}

export function sessionsOn(state: Pick<GameState, 'sessions'>, day: string): Session[] {
  return state.sessions.filter((s) => s.day === day);
}

export function minutesOn(state: Pick<GameState, 'sessions'>, day: string): number {
  return sessionsOn(state, day).reduce((a, s) => a + s.minutes, 0);
}

/** Série : jours consécutifs avec au moins une séance, se terminant aujourd'hui ou hier. */
export function currentStreak(state: Pick<GameState, 'sessions'>, today: string): number {
  const days = new Set(state.sessions.map((s) => s.day));
  let cursor = days.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (days.has(cursor)) {
    n++;
    cursor = addDays(cursor, -1);
  }
  return n;
}

export function bestStreak(state: Pick<GameState, 'sessions'>): number {
  const days = [...new Set(state.sessions.map((s) => s.day))].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of days) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export function totalMinutes(state: Pick<GameState, 'sessions'>): number {
  return state.sessions.reduce((a, s) => a + s.minutes, 0);
}
