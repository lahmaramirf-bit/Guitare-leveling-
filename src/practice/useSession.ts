import { useCallback, useEffect, useState } from 'react';
import { SESSION_KEY, isRunning, parseSession, type SessionState } from './session';

const read = (): SessionState | null => { try { return parseSession(localStorage.getItem(SESSION_KEY)); } catch { return null; } };
const write = (s: SessionState | null) => { try { if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s)); else localStorage.removeItem(SESSION_KEY); } catch { /* stockage indisponible : la séance reste en mémoire */ } };

/** Séance guidée persistée (localStorage, clé séparée de la sauvegarde) + horloge qui rafraîchit l'affichage. */
export function useSession() {
  const [state, setState] = useState<SessionState | null>(read);
  const [now, setNow] = useState(() => Date.now());
  const set = useCallback((s: SessionState | null) => { write(s); setState(s); }, []);
  const running = !!state && isRunning(state);
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setNow(Date.now()), 250);
    const vis = () => setNow(Date.now());
    document.addEventListener('visibilitychange', vis);
    return () => { window.clearInterval(t); document.removeEventListener('visibilitychange', vis); };
  }, [running]);
  return { state, set, now: running ? now : Date.now() };
}

/** Lecture seule (accueil) : y a-t-il une séance non terminée ? */
export const peekSession = read;
