import { useGame } from '../ui/store';
import { Panel } from '../ui/bits';
import { exerciseById } from '../game/exercises';

const Q = { 1: 'Difficile', 2: 'Correct', 3: 'Propre' } as const;

export function Journal() {
  const { state } = useGame();
  const sessions = [...state.sessions].sort((a, b) => b.at.localeCompare(a.at));
  const byDay = new Map<string, typeof sessions>();
  for (const s of sessions) byDay.set(s.day, [...(byDay.get(s.day) ?? []), s]);

  return (
    <Panel title="Journal d’entraînement">
      {sessions.length === 0 ? <p className="muted">Ton journal est vide. Ta première séance s’écrira ici.</p> : (
        <div className="journal">
          {[...byDay.entries()].map(([day, list]) => (
            <section key={day}>
              <h3 className="journal-day">{new Date(day + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} · {list.reduce((a, s) => a + s.minutes, 0)} min</h3>
              <ul>
                {list.map((s) => {
                  const song = s.songId ? state.songs.find((x) => x.id === s.songId) : null;
                  return (
                    <li key={s.id} className="journal-entry">
                      <span className="mono">{new Date(s.at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span><b>{exerciseById(s.exerciseId)?.name ?? s.exerciseId}</b>{song ? ` — ${song.title}` : ''}</span>
                      <span>{s.minutes} min{s.bpm ? ` · ${s.bpm} BPM` : ''} · {Q[s.quality]}</span>
                      <span className="xp">+{s.xp} XP</span>
                      {s.notes && <p className="journal-notes">{s.notes}</p>}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Panel>
  );
}
