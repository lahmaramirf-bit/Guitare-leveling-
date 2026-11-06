import { emptySave, type Save } from './model';
import { QUESTS, RANKS } from '../content';
import { ITEM } from './catalog';

export const STORAGE_KEY = 'guitar-leveling:v2';
export const BACKUP_KEY = 'guitar-leveling:v2:backup';
/** Clé du projet de base : reprise automatique si présente dans ce navigateur. */
export const LEGACY_KEY = 'guitar-leveling-v1';

export interface KV { getItem(k: string): string | null; setItem(k: string, v: string): void }

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const QIDS = new Set(QUESTS.map((q) => q.id as string));
const RIDS = new Set(RANKS.map((r) => r.id as string));
const isDay = (k: string) => /^\d{4}-\d{2}-\d{2}$/.test(k);
const nat = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.floor(v) : undefined);
const strArr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

/**
 * Nettoie une sauvegarde (v2 ou format du projet de base) champ par champ.
 * Une donnée invalide est ignorée, jamais l'ensemble de la sauvegarde.
 */
export function sanitize(raw: unknown): Save {
  const r = obj(raw);
  const s = emptySave();
  for (const [k, v] of Object.entries(obj(r.days))) {
    if (!isDay(k)) continue;
    const d = obj(v);
    const day: Save['days'][string] = { q: strArr(d.q).filter((x) => QIDS.has(x)) as Save['days'][string]['q'] };
    for (const f of ['train', 'sr', 'jam', 'sess', 'pk'] as const) { const n = nat(d[f]); if (n) day[f] = n; }
    for (const f of ['ex', 'rev'] as const) { const a = strArr(d[f]); if (a.length) day[f] = a; }
    for (const f of ['urg', 'lb'] as const) if (typeof d[f] === 'string' && RIDS.has(d[f] as string)) day[f] = d[f] as never;
    if (typeof d.lbt === 'string') day.lbt = d.lbt.slice(0, 120);
    if (d.lbo) day.lbo = 1;
    if (d.lbr) day.lbr = 1;
    if (d.freeze) day.freeze = 1;
    s.days[k] = day;
  }
  for (const [k, v] of Object.entries(obj(r.items))) if (v && /^[\w-]+$/.test(k)) s.items[k] = typeof v === 'string' && isDay(v) ? v : true;
  for (const [k, v] of Object.entries(obj(r.weeks))) if (isDay(k)) s.weeks[k] = strArr(v).filter((x) => /^w\d+$/.test(x));
  for (const [k, v] of Object.entries(obj(r.records))) {
    const R = obj(v); const best = nat(R.best);
    if (best) s.records[k] = { best, beats: nat(R.beats) ?? 1, date: typeof R.date === 'string' ? R.date : '' };
  }
  const peak = obj(r.meta).peak;
  if (typeof peak === 'string' && RIDS.has(peak)) s.meta.peak = peak as Save['meta']['peak'];
  for (const [k, v] of Object.entries(obj(r.rep))) {
    const e = obj(v); const out: Save['rep'][string] = {};
    if (typeof e.s === 'string' && ['', 'c', 'w', 'm'].includes(e.s)) out.s = e.s as Save['rep'][string]['s'];
    if (Array.isArray(e.st)) out.st = e.st.filter((x): x is number => Number.isInteger(x) && x >= 0 && x < 8);
    if (Array.isArray(e.lb)) out.lb = e.lb.filter((x): x is number => Number.isInteger(x) && x >= 0 && x < 3);
    const t = nat(e.t); if (t) out.t = t;
    const b = nat(e.bpm); if (b) out.bpm = b;
    s.rep[k] = out;
  }
  for (const [k, v] of Object.entries(obj(r.repc))) {
    const c = obj(v);
    if (typeof c.t === 'string' && c.t.trim()) s.repc[k] = { t: c.t.slice(0, 80), by: typeof c.by === 'string' ? c.by.slice(0, 80) : '', g: typeof c.g === 'string' ? c.g : 'chanson', d: Math.min(5, Math.max(1, nat(c.d) ?? 1)) };
  }
  const p = obj(r.profile);
  if (typeof p.name === 'string' && p.name.trim()) s.profile.name = p.name.slice(0, 24);
  if (p.avatar === 'girl') s.profile.avatar = 'girl';
  if (p.theme === 'cyberpunk' || p.theme === 'ombre' || p.theme === 'sakura') s.profile.theme = p.theme;
  s.profile.onboarded = p.onboarded === true;
  s.profile.avatarConfirmed = p.avatarConfirmed === true && (p.avatar === 'boy' || p.avatar === 'girl');
  if (p.sfx === false) s.profile.sfx = false;
  const sh = obj(r.shop);
  s.shop.spent = nat(sh.spent) ?? 0;
  s.shop.owned = strArr(sh.owned).filter((id) => ITEM[id] && ITEM[id].price !== undefined);
  for (const [k, v] of Object.entries(obj(sh.equipped))) if (v === null || (typeof v === 'string' && ITEM[v])) (s.shop.equipped as Record<string, string | null>)[k] = v;
  const inv = obj(sh.inv);
  s.shop.inv = { c_scroll: nat(inv.c_scroll) ?? 0, c_key: nat(inv.c_key) ?? 0 };
  return s;
}

export function load(kv: KV): { save: Save; migrated: boolean } {
  try {
    const txt = kv.getItem(STORAGE_KEY);
    if (txt) return { save: sanitize(JSON.parse(txt)), migrated: false };
    const legacy = kv.getItem(LEGACY_KEY);
    if (legacy) return { save: sanitize(JSON.parse(legacy)), migrated: true };
  } catch {
    try { const txt = kv.getItem(STORAGE_KEY); if (txt) kv.setItem(BACKUP_KEY + ':corrupt:' + Date.now(), txt); } catch { /* stockage indisponible */ }
  }
  return { save: emptySave(), migrated: false };
}

export function save(kv: KV, s: Save): boolean {
  try { kv.setItem(STORAGE_KEY, JSON.stringify(s)); return true; } catch { return false; }
}

export function exportJson(s: Save): string {
  return JSON.stringify({ app: 'guitar-leveling', exportedAt: new Date().toISOString(), save: s }, null, 2);
}

/** Accepte un export v2 OU l'état du projet de base ({days, items, weeks, …}). */
export function importJson(kv: KV, txt: string, current: Save): Save {
  const parsed = obj(JSON.parse(txt));
  const data = 'save' in parsed ? obj(parsed.save) : parsed;
  if (!('days' in data) || !('items' in data)) throw new Error('Fichier de sauvegarde non reconnu.');
  try { kv.setItem(BACKUP_KEY, JSON.stringify(current)); } catch { /* ignore */ }
  const s = sanitize(data);
  s.profile.onboarded = true;
  return s;
}

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
