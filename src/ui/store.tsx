import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Save } from '../game/model';
import { browserKV, load, save } from '../game/storage';
import { dayKey } from '../game/dates';
import { applyTheme } from '../appearance/themes';
import { ActionError } from '../game/actions';
import { progress, crystals, type Progress } from '../game/progress';
import { effRank, levelOf, masteryState } from '../game/engine';
import { ACH } from '../content';
import { ITEM } from '../game/catalog';

export interface Toast { id: number; text: string; tone?: 'ok' | 'gold' | 'info' | 'err' }

interface Ctx {
  save: Save; today: string; p: Progress; crystals: number;
  /** Applique une action ; affiche XP gagnée, niveau, rang, succès et déblocages. */
  act: (fn: (s: Save) => Save, msg?: string) => boolean;
  toast: (text: string, tone?: Toast['tone']) => void;
  toasts: Toast[]; saveOk: boolean; migrated: boolean;
}

const GameCtx = createContext<Ctx | null>(null);
export const kv = browserKV();

export function GameProvider({ children }: { children: ReactNode }) {
  const [{ save: initial, migrated }] = useState(() => load(kv));
  const [s, setS] = useState<Save>(initial);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [saveOk, setSaveOk] = useState(true);
  const [today, setToday] = useState(dayKey());
  const nextId = useRef(1);
  const ref = useRef(s);
  ref.current = s;

  useEffect(() => setSaveOk(save(kv, s)), [s]);
  useEffect(() => applyTheme(s.profile.theme), [s.profile.theme]);
  useEffect(() => { const t = window.setInterval(() => setToday(dayKey()), 60_000); return () => window.clearInterval(t); }, []);

  const toast = useCallback((text: string, tone: Toast['tone'] = 'info') => {
    const id = nextId.current++;
    setToasts((t) => [...t.slice(-3), { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const act = useCallback((fn: (x: Save) => Save, msg?: string) => {
    const before = ref.current;
    let after: Save;
    try { after = fn(before); } catch (e) {
      toast(e instanceof ActionError ? e.message : 'Action impossible.', 'err');
      return false;
    }
    const pb = progress(before, today), pa = progress(after, today);
    const diff = pa.c.xp - pb.c.xp;
    if (msg && diff > 0) toast(`${msg} +${diff.toLocaleString('fr-FR')} XP`, 'ok');
    const lb = levelOf(pb.c.xp), la = levelOf(pa.c.xp);
    const rb = effRank(before, pb.c.xp), ra = effRank(after, pa.c.xp);
    if (ra.id !== rb.id && pa.rankIdx > pb.rankIdx) toast(`Promotion ! Rang ${ra.id} · ${ra.title} — donjon « ${ra.name} » ouvert`, 'gold');
    else if (la > lb) toast(`Niveau ${la} !`, 'gold');
    for (const id of pa.achievements.filter((x) => !pb.achievements.includes(x))) toast(`Succès : ${ACH.find((a) => a.id === id)?.name} · +25 cristaux`, 'gold');
    const mb = masteryState(before).un, ma = masteryState(after).un;
    for (const id of ma) if (!mb.has(id) && ITEM[id]) toast(`Personnalisation débloquée : ${ITEM[id].name}`, 'gold');
    setS(after);
    return true;
  }, [today, toast]);

  const p = useMemo(() => progress(s, today), [s, today]);
  const value = useMemo(() => ({ save: s, today, p, crystals: crystals(s, p), act, toast, toasts, saveOk, migrated }), [s, today, p, act, toast, toasts, saveOk, migrated]);
  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export function useGame(): Ctx {
  const c = useContext(GameCtx);
  if (!c) throw new Error('useGame hors GameProvider');
  return c;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
