/** Actions du joueur : fonctions pures (copie → modification → nouvelle sauvegarde). */
import { PLAN, QUESTS, RANK_INDEX, type QuestId, type RankId } from '../content';
import type { AvatarId, Day, Save, Slot, SongState, ThemeId } from './model';
import { compute, rankOf, songById } from './engine';
import { CONSUMABLES, ITEM, defaultLoadout, fitsAvatar } from './catalog';
import { crystals, progress } from './progress';
import { masteryState } from './engine';
import { addDays, mondayOf } from './dates';
import { penalty } from './daily';

export class ActionError extends Error {}

function day(s: Save, k: string): Day {
  return (s.days[k] ??= { q: [] });
}
/** Applique une modification et met à jour le rang le plus haut atteint. */
export function commit(s: Save, fn: (d: Save) => void): Save {
  const d = structuredClone(s);
  fn(d);
  const r = rankOf(compute(d).xp);
  if (RANK_INDEX(r.id) > RANK_INDEX(d.meta.peak ?? 'E')) d.meta.peak = r.id;
  return d;
}
const toggle = <T,>(arr: T[], v: T) => { const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); };

export const toggleQuest = (s: Save, id: QuestId, today: string) =>
  commit(s, (d) => { if (QUESTS.some((q) => q.id === id)) toggle(day(d, today).q, id); });

export const toggleWeekly = (s: Save, wid: string, today: string) =>
  commit(s, (d) => { const wk = mondayOf(today); toggle((d.weeks[wk] ??= []), wid); });

export const togglePortal = (s: Save, rank: RankId, today: string) =>
  commit(s, (d) => { const x = day(d, today); if (x.urg) delete x.urg; else x.urg = rank; });

/** Objectifs / théorie / études / morceaux / boss de donjon, partitions (P-…) */
export const toggleItem = (s: Save, id: string, today: string) =>
  commit(s, (d) => { if (d.items[id]) delete d.items[id]; else d.items[id] = today; });

export function beatRecord(s: Save, id: string, v: number, today: string): Save {
  if (!Number.isInteger(v) || v < 1 || v > 400) throw new ActionError('Entre un nombre entre 1 et 400.');
  const R = s.records[id] ?? { best: 0, beats: 0, date: '' };
  if (v <= R.best) throw new ActionError(`Pas de record cette fois : ton meilleur est ${R.best}.`);
  return commit(s, (d) => { d.records[id] = { best: v, date: today, beats: (R.beats ?? 0) + 1 }; });
}

export const toggleRevision = (s: Save, shadowId: string, today: string) =>
  commit(s, (d) => { const x = day(d, today); toggle((x.rev ??= []), shadowId); });

/** Limit Break : uniquement après les 7 quêtes du jour. */
export function lbOpen(s: Save, today: string): Save {
  if ((s.days[today]?.q.length ?? 0) < QUESTS.length) throw new ActionError('Termine d’abord les 7 quêtes du jour.');
  return commit(s, (d) => { day(d, today).lbo = 1; });
}
export const lbReroll = (s: Save, today: string) => commit(s, (d) => { day(d, today).lbr = 1; });
export function lbDone(s: Save, today: string, rank: RankId, title: string): Save {
  if (!s.days[today]?.lbo) throw new ActionError('Ouvre d’abord le défi.');
  return commit(s, (d) => { const x = day(d, today); x.lb = rank; x.lbt = title; });
}

export function useScroll(s: Save, today: string): Save {
  const p = penalty(s, today);
  if (!p.canSave) throw new ActionError('Aucune série à sauver.');
  return commit(s, (d) => { d.shop.inv.c_scroll--; day(d, addDays(today, -1)).freeze = 1; });
}
export function useKey(s: Save, today: string): Save {
  if (s.shop.inv.c_key < 1) throw new ActionError('Pas de clé de portail.');
  if (s.days[today]?.urg) throw new ActionError('Le portail du jour est déjà fermé.');
  return commit(s, (d) => { d.shop.inv.c_key--; const x = day(d, today); x.pk = (x.pk ?? 0) + 1; });
}

/** Achat en boutique : condition de progression remplie + cristaux suffisants. */
export function buy(s: Save, id: string, today: string): Save {
  const it = ITEM[id];
  if (!it || it.price === undefined || !it.req) throw new ActionError('Objet introuvable.');
  if (s.shop.owned.includes(id)) throw new ActionError('Tu possèdes déjà cet objet.');
  const p = progress(s, today);
  const [k, n] = it.req;
  if (p.values[k] < n) throw new ActionError('Condition non remplie.');
  if (crystals(s, p) < it.price) throw new ActionError('Pas assez de cristaux : continue tes quêtes.');
  return commit(s, (d) => { d.shop.owned.push(id); d.shop.spent += it.price!; });
}
export function buyConsumable(s: Save, id: 'c_scroll' | 'c_key', today: string): Save {
  const c = CONSUMABLES.find((x) => x.id === id)!;
  if (crystals(s, progress(s, today)) < c.price) throw new ActionError('Pas assez de cristaux.');
  return commit(s, (d) => { d.shop.inv[id]++; d.shop.spent += c.price; });
}

export function isOwned(s: Save, id: string): boolean {
  const it = ITEM[id];
  if (!it) return false;
  if (it.default) return true;
  if (it.rarity === 'mastery') return masteryState(s).un.has(id);
  return s.shop.owned.includes(id);
}
export function equipped(s: Save, slot: Slot): string | null {
  const e = s.shop.equipped[slot];
  const def = defaultLoadout(s.profile.avatar)[slot] ?? null;
  if (e === undefined) return def;
  if (e === null) return null;
  const it = ITEM[e];
  return it && isOwned(s, e) && fitsAvatar(it, s.profile.avatar) ? e : def;
}
export function equip(s: Save, slot: Slot, id: string | null): Save {
  if (id !== null) {
    const it = ITEM[id];
    if (!it || it.slot !== slot || !isOwned(s, id) || !fitsAvatar(it, s.profile.avatar)) throw new ActionError('Objet non disponible.');
  } else if (!['accessory', 'aura', 'decor', 'title'].includes(slot)) throw new ActionError('Emplacement obligatoire.');
  return commit(s, (d) => { d.shop.equipped[slot] = id; });
}

// --- Répertoire ---
export function setSongStatus(s: Save, id: string, v: SongState, today: string, now = Date.now()): Save {
  const song = songById(s, id);
  if (!song) throw new ActionError('Morceau introuvable.');
  return commit(s, (d) => {
    const e = (d.rep[id] ??= {});
    const mastered = !!d.items[song.key];
    if (v === 'm') {
      if (mastered) { delete d.items[song.key]; e.s = 'c'; } else { d.items[song.key] = today; e.s = 'm'; e.t = now; }
    } else {
      if (mastered) delete d.items[song.key];
      e.s = !mastered && e.s === v ? '' : v; e.t = now;
    }
  });
}
export function toggleStep(s: Save, id: string, i: number, now = Date.now()): Save {
  if (i < 0 || i >= PLAN.length) throw new ActionError('Étape inconnue.');
  return commit(s, (d) => { const e = (d.rep[id] ??= {}); const st = (e.st ??= []); const k = st.indexOf(i); if (k >= 0) st.splice(k, 1); else { st.push(i); if (!e.s) e.s = 'c'; e.t = now; } });
}
export const setSongBpm = (s: Save, id: string, bpm: number | null) =>
  commit(s, (d) => { const e = (d.rep[id] ??= {}); if (bpm && bpm > 0 && bpm < 400) e.bpm = Math.round(bpm); else delete e.bpm; });
export function toggleSongLB(s: Save, id: string, i: number): Save {
  const song = songById(s, id);
  if (!song || !s.items[song.key]) throw new ActionError('Maîtrise d’abord le morceau.');
  return commit(s, (d) => { const e = (d.rep[id] ??= {}); toggle((e.lb ??= []), i); });
}
export function addCustomSong(s: Save, song: { t: string; by: string; g: string; d: number }, id: string): Save {
  const t = song.t.trim().slice(0, 80);
  if (!t) throw new ActionError('Donne un titre au morceau.');
  return commit(s, (d) => { d.repc[id] = { t, by: song.by.trim().slice(0, 80), g: song.g, d: Math.max(1, Math.min(5, Math.round(song.d))) }; });
}
export const deleteCustomSong = (s: Save, id: string) =>
  commit(s, (d) => { delete d.repc[id]; delete d.rep[id]; delete d.items['R-' + id]; });

// --- Profil ---
export const setName = (s: Save, name: string) => commit(s, (d) => { const n = name.trim().slice(0, 24); if (n) d.profile.name = n; });
/** Choix d'apparence : possible une seule fois. Ensuite l'identité de l'avatar est verrouillée. */
export function confirmAvatar(s: Save, a: AvatarId): Save {
  if (s.profile.avatarConfirmed) throw new ActionError('Ton personnage est déjà choisi.');
  if (a !== 'boy' && a !== 'girl') throw new ActionError('Personnage inconnu.');
  return commit(s, (d) => { d.profile.avatar = a; d.profile.avatarConfirmed = true; d.shop.equipped = {}; });
}
export const needsAvatarChoice = (s: Save) => !s.profile.avatarConfirmed;
export const setTheme = (s: Save, t: ThemeId) => commit(s, (d) => { d.profile.theme = t; });
export function finishOnboarding(s: Save, name: string, a: AvatarId): Save {
  const withAvatar = s.profile.avatarConfirmed ? s : confirmAvatar(s, a);
  return commit(withAvatar, (d) => { if (name.trim() || !d.profile.onboarded) d.profile.name = name.trim().slice(0, 24) || d.profile.name || 'Héros'; d.profile.onboarded = true; });
}

// --- Entraînement ---
/** Bloc de session guidée terminé : valide la quête correspondante. */
export const sessionBlockDone = (s: Save, id: QuestId, today: string) =>
  commit(s, (d) => { const x = day(d, today); if (!x.q.includes(id)) x.q.push(id); });
/** Session guidée complète sans bloc sauté : +50 XP (2 par jour max). */
export const sessionComplete = (s: Save, today: string) =>
  commit(s, (d) => { const x = day(d, today); x.sess = (x.sess ?? 0) + 1; });
export const toggleExercise = (s: Save, id: string, today: string) =>
  commit(s, (d) => { const x = day(d, today); toggle((x.ex ??= []), id); });
