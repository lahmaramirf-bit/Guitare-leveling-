import type { GameState } from './types';
import { hashString, mulberry32 } from './rng';
import { minutesOn, sessionsOn, currentStreak } from './sessions';
import { levelFromXp } from './levels';
import { exerciseById, type ExerciseCategory } from './exercises';

export interface QuestProgress {
  current: number;
  target: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  rewardCrystals: number;
  progress: (s: GameState, today: string) => QuestProgress;
}

function categoryMinutes(cat: ExerciseCategory) {
  return (s: GameState, today: string): QuestProgress => ({
    current: sessionsOn(s, today)
      .filter((x) => exerciseById(x.exerciseId)?.category === cat)
      .reduce((a, x) => a + x.minutes, 0),
    target: 10,
  });
}

/** Pool de quêtes quotidiennes ; progression calculée à partir des séances réelles déclarées. */
export const DAILY_POOL: Quest[] = [
  { id: 'd_minutes_15', title: 'Échauffement', description: 'Joue au moins 15 minutes aujourd’hui.', rewardXp: 40, rewardCrystals: 15, progress: (s, t) => ({ current: minutesOn(s, t), target: 15 }) },
  { id: 'd_minutes_30', title: 'Séance sérieuse', description: 'Cumule 30 minutes de pratique.', rewardXp: 80, rewardCrystals: 25, progress: (s, t) => ({ current: minutesOn(s, t), target: 30 }) },
  { id: 'd_two_sessions', title: 'Matin et soir', description: 'Fais 2 séances séparées.', rewardXp: 50, rewardCrystals: 20, progress: (s, t) => ({ current: sessionsOn(s, t).length, target: 2 }) },
  { id: 'd_chords', title: 'Doigts d’acier', description: '10 minutes sur les accords ou leurs changements.', rewardXp: 50, rewardCrystals: 20, progress: (s, t) => {
    const a = categoryMinutes('accords')(s, t).current + categoryMinutes('changements')(s, t).current;
    return { current: a, target: 10 };
  } },
  { id: 'd_rhythm', title: 'Gardien du tempo', description: '10 minutes de rythme au métronome.', rewardXp: 50, rewardCrystals: 20, progress: categoryMinutes('rythme') },
  { id: 'd_scales', title: 'Gammes du jour', description: '10 minutes de gammes.', rewardXp: 50, rewardCrystals: 20, progress: categoryMinutes('gammes') },
  { id: 'd_song', title: 'Répertoire vivant', description: 'Travaille un morceau de ton répertoire.', rewardXp: 60, rewardCrystals: 20, progress: (s, t) => ({ current: sessionsOn(s, t).filter((x) => x.songId).length, target: 1 }) },
  { id: 'd_clean', title: 'Propreté avant vitesse', description: 'Termine une séance que tu juges « propre ».', rewardXp: 40, rewardCrystals: 15, progress: (s, t) => ({ current: sessionsOn(s, t).filter((x) => x.quality === 3).length, target: 1 }) },
];

export const DAILY_COUNT = 3;

/** 3 quêtes du jour, déterministes pour une date donnée. */
export function dailyQuests(day: string): Quest[] {
  const rng = mulberry32(hashString('daily:' + day));
  const pool = [...DAILY_POOL];
  const out: Quest[] = [];
  while (out.length < DAILY_COUNT && pool.length) {
    out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  }
  return out;
}

/** Fil principal : objectifs à long terme. */
export const MAIN_QUESTS: Quest[] = [
  { id: 'm_restart', title: 'Reprendre la guitare', description: 'Termine ta toute première séance. Refuser n’est pas une option.', rewardXp: 100, rewardCrystals: 100, progress: (s) => ({ current: Math.min(1, s.sessions.length), target: 1 }) },
  { id: 'm_first_song', title: 'Un morceau en ligne de mire', description: 'Ajoute un morceau à ton répertoire.', rewardXp: 50, rewardCrystals: 50, progress: (s) => ({ current: Math.min(1, s.songs.length), target: 1 }) },
  { id: 'm_streak_3', title: 'Trois jours d’affilée', description: 'Atteins une série de 3 jours.', rewardXp: 150, rewardCrystals: 100, progress: (s, t) => ({ current: currentStreak(s, t), target: 3 }) },
  { id: 'm_hours_5', title: 'Cinq heures de vol', description: 'Cumule 5 heures de pratique.', rewardXp: 300, rewardCrystals: 200, progress: (s) => ({ current: s.sessions.reduce((a, x) => a + x.minutes, 0), target: 300 }) },
  { id: 'm_level_5', title: 'Niveau 5', description: 'Atteins le niveau 5.', rewardXp: 0, rewardCrystals: 150, progress: (s) => ({ current: levelFromXp(s.xp), target: 5 }) },
  { id: 'm_mastered', title: 'Premier morceau maîtrisé', description: 'Passe un morceau du répertoire en « maîtrisé ».', rewardXp: 300, rewardCrystals: 200, progress: (s) => ({ current: s.songs.filter((x) => x.status === 'maitrise').length, target: 1 }) },
  { id: 'm_rank_d', title: 'Rang D', description: 'Atteins le niveau 17 pour passer au rang D.', rewardXp: 0, rewardCrystals: 500, progress: (s) => ({ current: levelFromXp(s.xp), target: 17 }) },
];

export function isDone(p: QuestProgress): boolean {
  return p.current >= p.target;
}

export function dailyKey(day: string, id: string): string {
  return `${day}:${id}`;
}

/** Quête principale active = première non réclamée. */
export function activeMainQuest(s: GameState): Quest | null {
  return MAIN_QUESTS.find((q) => !s.claimedMain.includes(q.id)) ?? null;
}
