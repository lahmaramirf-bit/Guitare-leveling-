import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { GameState } from '../game/types';
import { browserKV, load, save } from '../game/storage';
import { dayKey } from '../game/dates';
import { applyTheme } from '../appearance/themes';

export interface Toast { id: number; text: string; tone?: 'ok' | 'gold' | 'info' }

interface Ctx {
  state: GameState;
  today: string;
  update: (fn: (s: GameState) => GameState) => void;
  toast: (text: string, tone?: Toast['tone']) => void;
  toasts: Toast[];
  saveOk: boolean;
}

const GameCtx = createContext<Ctx | null>(null);
const kv = browserKV();

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => load(kv));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [saveOk, setSaveOk] = useState(true);
  const [today, setToday] = useState(dayKey());
  const nextId = useRef(1);

  useEffect(() => setSaveOk(save(kv, state)), [state]);
  useEffect(() => applyTheme(state.appearance.themeId), [state.appearance.themeId]);
  useEffect(() => {
    const t = window.setInterval(() => setToday(dayKey()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const update = useCallback((fn: (s: GameState) => GameState) => setState((s) => fn(s)), []);
  const toast = useCallback((text: string, tone: Toast['tone'] = 'info') => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const value = useMemo(() => ({ state, today, update, toast, toasts, saveOk }), [state, today, update, toast, toasts, saveOk]);
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

export { kv };
