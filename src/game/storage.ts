import type { GameState } from './types';
import { newGame } from './state';
import { COSMETICS, defaultLoadout, type AvatarId } from './cosmetics';

export const STORAGE_KEY = 'guitar-leveling:save';
export const BACKUP_KEY = 'guitar-leveling:save:backup';

export interface KV {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

const THEMES = ['sakura', 'cyberpunk', 'ombre'] as const;

/**
 * Valide et répare une sauvegarde inconnue. Toute donnée invalide est
 * remplacée par la valeur par défaut, champ par champ (jamais d'écrasement global).
 */
export function sanitize(raw: unknown): GameState {
  const base = newGame();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const num = (v: unknown, d: number) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : d);
  const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  const app = (r.appearance ?? {}) as Record<string, unknown>;
  const avatarId: AvatarId = app.avatarId === 'girl' ? 'girl' : 'boy';
  const known = new Set(COSMETICS.map((c) => c.id));
  const inventory = [...new Set([...base.inventory, ...arr<string>(r.inventory).filter((id) => known.has(id))])];
  const loadout = { ...defaultLoadout(avatarId), ...((app.loadout as object) ?? {}) } as GameState['appearance']['loadout'];
  for (const k of Object.keys(loadout) as (keyof typeof loadout)[]) {
    const id = loadout[k];
    if (id !== null && (typeof id !== 'string' || !inventory.includes(id))) loadout[k] = defaultLoadout(avatarId)[k];
  }
  return {
    schemaVersion: 1,
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : base.createdAt,
    profile: { name: typeof (r.profile as { name?: unknown })?.name === 'string' ? ((r.profile as { name: string }).name.slice(0, 24) || base.profile.name) : base.profile.name },
    appearance: {
      avatarId,
      themeId: (THEMES as readonly string[]).includes(app.themeId as string) ? (app.themeId as GameState['appearance']['themeId']) : 'sakura',
      loadout,
    },
    xp: num(r.xp, 0),
    crystals: num(r.crystals, 0),
    shards: num(r.shards, 0),
    sessions: arr<GameState['sessions'][number]>(r.sessions).filter((x) => x && typeof x.day === 'string' && typeof x.minutes === 'number'),
    songs: arr<GameState['songs'][number]>(r.songs).filter((x) => x && typeof x.title === 'string'),
    inventory,
    pity: num(r.pity, 0),
    chestLastDay: typeof r.chestLastDay === 'string' ? r.chestLastDay : null,
    claimedDaily: arr<string>(r.claimedDaily).filter((x) => typeof x === 'string'),
    claimedMain: arr<string>(r.claimedMain).filter((x) => typeof x === 'string'),
    onboarded: r.onboarded === true,
  };
}

export function load(kv: KV): GameState {
  try {
    const txt = kv.getItem(STORAGE_KEY);
    if (!txt) return newGame();
    return sanitize(JSON.parse(txt));
  } catch {
    // Sauvegarde corrompue : on la met de côté au lieu de la perdre.
    try {
      const txt = kv.getItem(STORAGE_KEY);
      if (txt) kv.setItem(BACKUP_KEY + ':corrupt:' + Date.now(), txt);
    } catch { /* stockage indisponible */ }
    return newGame();
  }
}

export function save(kv: KV, s: GameState): boolean {
  try {
    kv.setItem(STORAGE_KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

export function exportJson(s: GameState): string {
  return JSON.stringify({ app: 'guitar-leveling', exportedAt: new Date().toISOString(), save: s }, null, 2);
}

export function importJson(kv: KV, txt: string, current: GameState): GameState {
  const parsed = JSON.parse(txt);
  const data = parsed && typeof parsed === 'object' && 'save' in parsed ? parsed.save : parsed;
  if (!data || typeof data !== 'object' || (data as { schemaVersion?: unknown }).schemaVersion !== 1) {
    throw new Error('Fichier de sauvegarde non reconnu.');
  }
  try { kv.setItem(BACKUP_KEY, JSON.stringify(current)); } catch { /* ignore */ }
  return sanitize(data);
}

/** Stockage du navigateur, avec repli mémoire si indisponible (navigation privée…). */
export function browserKV(): KV {
  try {
    const t = '__gl_test__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    return window.localStorage;
  } catch {
    const mem = new Map<string, string>();
    return { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v) };
  }
}
