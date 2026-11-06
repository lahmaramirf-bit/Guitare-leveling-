import type { GameState, Quality, Song, SongStatus, ThemeId } from './types';
import { COSMETICS, cosmeticById, defaultLoadout, fitsAvatar, type AvatarId, type Slot } from './cosmetics';
import { levelFromXp, rankForLevel, RANKS } from './levels';
import { currentStreak, bestStreak, sessionXp, sessionCrystals, MAX_SESSION_MINUTES } from './sessions';
import { dailyQuests, dailyKey, isDone, MAIN_QUESTS } from './quests';
import { chestReward, pull, PULL_COST, type PullResult } from './gacha';
import type { Rng } from './rng';

export function newGame(now: Date = new Date()): GameState {
  const avatarId: AvatarId = 'boy';
  return {
    schemaVersion: 1,
    createdAt: now.toISOString(),
    profile: { name: 'Héros' },
    appearance: { avatarId, themeId: 'sakura', loadout: defaultLoadout(avatarId) },
    xp: 0,
    crystals: 0,
    shards: 0,
    sessions: [],
    songs: [],
    inventory: COSMETICS.filter((c) => c.unlock.type === 'default').map((c) => c.id),
    pity: 0,
    chestLastDay: null,
    claimedDaily: [],
    claimedMain: [],
    onboarded: false,
  };
}

/** Accorde les cosmétiques débloqués par des progrès musicaux. Renvoie les nouveaux ids. */
export function grantMilestones(s: GameState, today: string): { state: GameState; granted: string[] } {
  const level = levelFromXp(s.xp);
  const rankIdx = RANKS.findIndex((r) => r.rank === rankForLevel(level).rank);
  const streak = Math.max(currentStreak(s, today), bestStreak(s));
  const granted: string[] = [];
  for (const c of COSMETICS) {
    if (s.inventory.includes(c.id)) continue;
    const u = c.unlock;
    const ok =
      (u.type === 'level' && level >= (u.value as number)) ||
      (u.type === 'rank' && rankIdx >= RANKS.findIndex((r) => r.rank === u.value)) ||
      (u.type === 'streak' && streak >= (u.value as number)) ||
      (u.type === 'sessions' && s.sessions.length >= (u.value as number));
    if (ok) granted.push(c.id);
  }
  return granted.length ? { state: { ...s, inventory: [...s.inventory, ...granted] }, granted } : { state: s, granted };
}

export interface SessionInput {
  exerciseId: string;
  songId: string | null;
  minutes: number;
  bpm: number | null;
  quality: Quality;
  notes: string;
}

export interface SessionOutcome {
  state: GameState;
  xp: number;
  crystals: number;
  levelBefore: number;
  levelAfter: number;
  granted: string[];
}

export function logSession(s: GameState, input: SessionInput, now: Date, today: string, id: string): SessionOutcome {
  const minutes = Math.max(1, Math.min(MAX_SESSION_MINUTES, Math.round(input.minutes)));
  const xp = sessionXp(minutes, input.quality);
  const crystals = sessionCrystals(minutes);
  const levelBefore = levelFromXp(s.xp);
  let next: GameState = {
    ...s,
    xp: s.xp + xp,
    crystals: s.crystals + crystals,
    sessions: [
      ...s.sessions,
      { id, day: today, at: now.toISOString(), exerciseId: input.exerciseId, songId: input.songId, minutes, bpm: input.bpm, quality: input.quality, notes: input.notes.trim().slice(0, 500), xp },
    ],
  };
  const g = grantMilestones(next, today);
  next = g.state;
  return { state: next, xp, crystals, levelBefore, levelAfter: levelFromXp(next.xp), granted: g.granted };
}

export function claimDaily(s: GameState, questId: string, today: string): GameState {
  const q = dailyQuests(today).find((x) => x.id === questId);
  const key = dailyKey(today, questId);
  if (!q || s.claimedDaily.includes(key) || !isDone(q.progress(s, today))) return s;
  const keep = s.claimedDaily.filter((k) => k.startsWith(today)); // purge des jours passés
  return grantMilestones({ ...s, xp: s.xp + q.rewardXp, crystals: s.crystals + q.rewardCrystals, claimedDaily: [...keep, key] }, today).state;
}

export function claimMain(s: GameState, questId: string, today: string): GameState {
  const q = MAIN_QUESTS.find((x) => x.id === questId);
  if (!q || s.claimedMain.includes(questId) || !isDone(q.progress(s, today))) return s;
  return grantMilestones({ ...s, xp: s.xp + q.rewardXp, crystals: s.crystals + q.rewardCrystals, claimedMain: [...s.claimedMain, questId] }, today).state;
}

export function openChest(s: GameState, today: string, rng: Rng): { state: GameState; reward: number } {
  if (s.chestLastDay === today) return { state: s, reward: 0 };
  const reward = chestReward(rng);
  return { state: { ...s, crystals: s.crystals + reward, chestLastDay: today }, reward };
}

export function invoke(s: GameState, rng: Rng): { state: GameState; result: PullResult | null } {
  if (s.crystals < PULL_COST) return { state: s, result: null };
  const r = pull(rng, s.pity, s.inventory);
  return {
    state: {
      ...s,
      crystals: s.crystals - PULL_COST,
      shards: s.shards + r.shards,
      pity: r.pity,
      inventory: r.duplicate ? s.inventory : [...s.inventory, r.item.id],
    },
    result: { item: r.item, duplicate: r.duplicate, shards: r.shards },
  };
}

export function equip(s: GameState, slot: Slot, itemId: string | null): GameState {
  if (itemId !== null) {
    const c = cosmeticById(itemId);
    if (!c || c.slot !== slot || !s.inventory.includes(itemId) || !fitsAvatar(c, s.appearance.avatarId)) return s;
  }
  if (itemId === null && slot !== 'accessory') return s; // seuls les accessoires sont optionnels
  return { ...s, appearance: { ...s.appearance, loadout: { ...s.appearance.loadout, [slot]: itemId } } };
}

export function setAvatar(s: GameState, avatarId: AvatarId): GameState {
  if (s.appearance.avatarId === avatarId) return s;
  const loadout = defaultLoadout(avatarId);
  // conserve les objets compatibles déjà équipés
  for (const [slot, id] of Object.entries(s.appearance.loadout) as [Slot, string | null][]) {
    const c = id ? cosmeticById(id) : null;
    if (c && fitsAvatar(c, avatarId)) loadout[slot] = id;
    if (slot === 'accessory' && id === null) loadout.accessory = null;
  }
  return { ...s, appearance: { ...s.appearance, avatarId, loadout } };
}

export function setTheme(s: GameState, themeId: ThemeId): GameState {
  return { ...s, appearance: { ...s.appearance, themeId } };
}

export function setName(s: GameState, name: string): GameState {
  const n = name.trim().slice(0, 24);
  return n ? { ...s, profile: { ...s.profile, name: n } } : s;
}

export function addSong(s: GameState, song: Omit<Song, 'id' | 'status'>, id: string): GameState {
  const title = song.title.trim().slice(0, 80);
  if (!title) return s;
  return { ...s, songs: [...s.songs, { id, title, artist: song.artist.trim().slice(0, 80), targetBpm: song.targetBpm, status: 'a_apprendre' }] };
}

export function setSongStatus(s: GameState, id: string, status: SongStatus): GameState {
  return { ...s, songs: s.songs.map((x) => (x.id === id ? { ...x, status } : x)) };
}

export function removeSong(s: GameState, id: string): GameState {
  return { ...s, songs: s.songs.filter((x) => x.id !== id) };
}
