import { useEffect, useRef, useState } from 'react';
import { useGame, uid } from '../ui/store';
import { Panel } from '../ui/bits';
import { EXERCISES, CATEGORY_LABELS, exerciseById, type Exercise } from '../game/exercises';
import { logSession } from '../game/state';
import { sessionXp, MAX_SESSION_MINUTES } from '../game/sessions';
import { cosmeticById } from '../game/cosmetics';
import { titleForLevel } from '../game/levels';
import { Metronome } from '../audio/metronome';
import type { Quality } from '../game/types';

type Phase = 'pick' | 'run' | 'finish';

export function Training({ songId, clearSong }: { songId: string | null; clearSong: () => void }) {
  const { state } = useGame();
  const [phase, setPhase] = useState<Phase>(songId ? 'run' : 'pick');
  const [exercise, setExercise] = useState<Exercise>(songId ? exerciseById('song_practice')! : EXERCISES[0]);
  const [seconds, setSeconds] = useState(0);
  const song = songId ? state.songs.find((s) => s.id === songId) ?? null : null;

  const choose = (e: Exercise) => { setExercise(e); setSeconds(0); setPhase('run'); };
  const reset = () => { setPhase('pick'); setSeconds(0); clearSong(); };

  if (phase === 'pick') {
    return (
      <Panel title="Entraînement" aside={<span className="muted small">Choisis un exercice, joue, puis déclare honnêtement ta séance.</span>}>
        <ul className="exercise-grid">
          {EXERCISES.map((e) => (
            <li key={e.id}>
              <button className="exercise" onClick={() => choose(e)}>
                <span className="exercise-cat">{CATEGORY_LABELS[e.category]}</span>
                <span className="exercise-name">{e.name}</span>
                <span className="exercise-desc">{e.description}</span>
                <span className="exercise-meta">{e.suggestedMinutes} min conseillées{e.suggestedBpm ? ` · ${e.suggestedBpm} BPM` : ''}</span>
              </button>
            </li>
          ))}
        </ul>
      </Panel>
    );
  }
  if (phase === 'run') {
    return <Runner exercise={exercise} songTitle={song?.title ?? null} seconds={seconds} setSeconds={setSeconds} onFinish={() => setPhase('finish')} onCancel={reset} />;
  }
  return <FinishForm exercise={exercise} songId={song?.id ?? null} seconds={seconds} onDone={reset} onBack={() => setPhase('run')} />;
}

function Runner({ exercise, songTitle, seconds, setSeconds, onFinish, onCancel }: {
  exercise: Exercise; songTitle: string | null; seconds: number; setSeconds: (f: (n: number) => number) => void; onFinish: () => void; onCancel: () => void;
}) {
  const [running, setRunning] = useState(false);
  const [bpm, setBpm] = useState(exercise.suggestedBpm ?? 80);
  const [metroOn, setMetroOn] = useState(false);
  const [beat, setBeat] = useState(-1);
  const metro = useRef<Metronome | null>(null);

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setSeconds((n) => n + 1), 1000);
    return () => window.clearInterval(t);
  }, [running, setSeconds]);

  useEffect(() => () => metro.current?.dispose(), []);
  useEffect(() => { if (metro.current) metro.current.bpm = bpm; }, [bpm]);

  const toggleMetro = () => {
    metro.current ??= new Metronome();
    const m = metro.current;
    if (m.running) { m.stop(); setMetroOn(false); setBeat(-1); return; }
    m.bpm = bpm;
    m.onBeat = setBeat;
    setMetroOn(m.start());
  };

  const finish = () => { metro.current?.stop(); setMetroOn(false); setRunning(false); onFinish(); };
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="stack">
      <Panel title={exercise.name} aside={<button className="link-btn" onClick={() => { metro.current?.stop(); onCancel(); }}>← Changer d’exercice</button>}>
        {songTitle && <p className="tag">Morceau : {songTitle}</p>}
        <p>{exercise.description}</p>
        <ol className="howto">{exercise.howTo.map((h) => <li key={h}>{h}</li>)}</ol>
      </Panel>
      <div className="grid-2">
        <Panel title="Chrono">
          <div className="timer mono" aria-live="off">{mm}:{ss}</div>
          <div className="row">
            <button className="btn btn-primary" onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : seconds ? 'Reprendre' : 'Démarrer'}</button>
            <button className="btn btn-gold" onClick={finish} disabled={seconds < 1}>Terminer la séance</button>
          </div>
          <p className="muted small">Conseil : {exercise.suggestedMinutes} minutes.</p>
        </Panel>
        <Panel title="Métronome">
          <div className="metro">
            <div className="beats" aria-hidden="true">{[0, 1, 2, 3].map((i) => <span key={i} className={`dot ${beat === i ? 'on' : ''} ${i === 0 ? 'first' : ''}`} />)}</div>
            <label className="bpm">
              <span className="mono big">{bpm}</span> BPM
              <input type="range" min={40} max={220} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} aria-label="Tempo en BPM" />
            </label>
            <div className="row">
              <button className="btn" onClick={() => setBpm((b) => Math.max(40, b - 4))} aria-label="Ralentir de 4 BPM">−4</button>
              <button className="btn btn-primary" onClick={toggleMetro} aria-pressed={metroOn}>{metroOn ? 'Arrêter' : 'Lancer le clic'}</button>
              <button className="btn" onClick={() => setBpm((b) => Math.min(220, b + 4))} aria-label="Accélérer de 4 BPM">+4</button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function FinishForm({ exercise, songId, seconds, onDone, onBack }: { exercise: Exercise; songId: string | null; seconds: number; onDone: () => void; onBack: () => void }) {
  const { state, today, update, toast } = useGame();
  const [minutes, setMinutes] = useState(Math.max(1, Math.round(seconds / 60)));
  const [bpm, setBpm] = useState<string>(exercise.suggestedBpm ? String(exercise.suggestedBpm) : '');
  const [quality, setQuality] = useState<Quality>(2);
  const [notes, setNotes] = useState('');

  const submit = () => {
    const o = logSession(state, { exerciseId: exercise.id, songId, minutes, bpm: bpm ? Number(bpm) : null, quality, notes }, new Date(), today, uid());
    update(() => o.state);
    toast(`+${o.xp} XP · +${o.crystals} cristaux`, 'ok');
    if (o.levelAfter > o.levelBefore) toast(`Niveau ${o.levelAfter} ! Titre : ${titleForLevel(o.levelAfter)}`, 'gold');
    for (const id of o.granted) toast(`Débloqué : ${cosmeticById(id)?.name}`, 'gold');
    onDone();
  };

  return (
    <Panel title="Bilan de la séance" aside={<button className="link-btn" onClick={onBack}>← Revenir au chrono</button>}>
      <p className="notice">Validation <b>déclarative</b> : l’application ne reconnaît pas encore les notes jouées. Sois honnête, c’est ta progression réelle qui compte.</p>
      <div className="form">
        <label>Durée réelle (minutes)
          <input type="number" min={1} max={MAX_SESSION_MINUTES} value={minutes} onChange={(e) => setMinutes(Math.max(1, Math.min(MAX_SESSION_MINUTES, Number(e.target.value) || 1)))} />
        </label>
        <label>Tempo atteint proprement (BPM, facultatif)
          <input type="number" min={20} max={300} value={bpm} onChange={(e) => setBpm(e.target.value)} placeholder="—" />
        </label>
        <fieldset className="quality">
          <legend>Propreté du jeu</legend>
          {([1, 2, 3] as Quality[]).map((q) => (
            <label key={q} className={quality === q ? 'sel' : ''}>
              <input type="radio" name="quality" checked={quality === q} onChange={() => setQuality(q)} />
              {q === 1 ? 'Difficile' : q === 2 ? 'Correct' : 'Propre'}
            </label>
          ))}
        </fieldset>
        <label className="full">Notes (score, passage difficile…)
          <textarea rows={3} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
      </div>
      <div className="row">
        <span className="muted">Gain prévu : <b>{sessionXp(minutes, quality)} XP</b></span>
        <span className="spacer" />
        <button className="btn btn-gold" onClick={submit}>Valider la séance</button>
      </div>
    </Panel>
  );
}
