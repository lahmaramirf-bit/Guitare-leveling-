import { useEffect, useRef, useState } from 'react';
import { useGame } from '../ui/store';
import { CheckItem, Panel, Tabs } from '../ui/bits';
import { EXOS, QUESTS, XP, type QuestId } from '../content';
import { effRank } from '../game/engine';
import { questDescs } from '../game/daily';
import * as A from '../game/actions';
import { Metronome } from '../audio/metronome';

type Sub = 'session' | 'exos' | 'metro' | 'soon';
const SESS: Record<number, [QuestId, number][]> = {
  15: [['echauf', 2], ['arp', 3], ['gamme', 2], ['etude', 4], ['morceau', 4]],
  30: [['echauf', 3], ['arp', 4], ['gamme', 4], ['lect', 2], ['etude', 7], ['morceau', 10]],
  45: [['echauf', 3], ['arp', 5], ['gamme', 5], ['theo', 5], ['lect', 2], ['etude', 10], ['morceau', 15]],
  60: [['echauf', 5], ['arp', 7], ['gamme', 7], ['theo', 6], ['lect', 5], ['etude', 12], ['morceau', 18]],
};
const EXCAT: [string, string][] = [['all', 'Tout'], ['mg', 'Main gauche'], ['md', 'Main droite'], ['coord', 'Coordination'], ['expr', 'Son et effets']];

export function Training() {
  const [sub, setSub] = useState<Sub>('session');
  return (
    <div className="stack">
      <Tabs label="Entraînement" value={sub} onChange={setSub} items={[['session', 'Session guidée'], ['exos', 'Exercices'], ['metro', 'Métronome'], ['soon', 'Autres salles']]} />
      {sub === 'session' && <Session />}
      {sub === 'exos' && <Exercises />}
      {sub === 'metro' && <MetronomePanel />}
      {sub === 'soon' && <ComingSoon />}
    </div>
  );
}

const clock = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(Math.max(0, sec) % 60).padStart(2, '0')}`;

function beep() {
  try {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new C();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = 880; g.gain.setValueAtTime(0.25, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.4);
    window.setTimeout(() => void ctx.close(), 600);
  } catch { /* audio indisponible */ }
}

/** Session guidée : enchaîne les blocs avec un minuteur ; chaque bloc terminé valide la quête correspondante. */
function Session() {
  const { save, today, p, act } = useGame();
  const [dur, setDur] = useState(30);
  const blocks = SESS[dur];
  const [idx, setIdx] = useState(0);
  const [remain, setRemain] = useState(blocks[0][1] * 60);
  const [running, setRunning] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const desc = questDescs(save, effRank(save, p.c.xp), today);

  const reset = (d = dur) => { setIdx(0); setRemain(SESS[d][0][1] * 60); setRunning(false); setSkipped(false); setFinished(false); };
  useEffect(() => { if (!running) return; const t = window.setInterval(() => setRemain((r) => r - 1), 1000); return () => window.clearInterval(t); }, [running]);

  const advance = (completed: boolean) => {
    const [qid] = blocks[idx];
    if (completed) act((s) => A.sessionBlockDone(s, qid, today), save.days[today]?.q.includes(qid) ? undefined : `Bloc terminé : ${QUESTS.find((q) => q.id === qid)?.name}.`);
    const wasSkipped = skipped || !completed;
    if (!completed) setSkipped(true);
    if (idx + 1 >= blocks.length) {
      setFinished(true); setRunning(false);
      if (!wasSkipped) act((s) => A.sessionComplete(s, today), 'Session guidée complète.');
    } else { setIdx(idx + 1); setRemain(blocks[idx + 1][1] * 60); }
  };
  useEffect(() => { if (running && remain <= 0) { beep(); advance(true); } }, [remain, running]); // eslint-disable-line react-hooks/exhaustive-deps

  const [qid, min] = blocks[Math.min(idx, blocks.length - 1)];
  const Q = QUESTS.find((q) => q.id === qid)!;
  return (
    <Panel title="Session guidée" aside={<label className="inline">Durée <select value={dur} onChange={(e) => { const d = Number(e.target.value); setDur(d); reset(d); }} disabled={running}>{[15, 30, 45, 60].map((d) => <option key={d} value={d}>{d} min</option>)}</select></label>}>
      {finished ? (
        <div className="session-done"><div className="timer">✓</div><p><b>Session terminée.</b> {skipped ? 'Un bloc a été sauté : pas de bonus de session cette fois.' : `+${XP.sess} XP de bonus de session.`}</p><button className="btn btn-primary" onClick={() => reset()}>Recommencer</button></div>
      ) : (
        <>
          <div className="session-steps" aria-hidden="true">{blocks.map(([b], i) => <i key={i} className={i < idx ? 'done' : i === idx ? 'cur' : ''} title={QUESTS.find((q) => q.id === b)?.name} />)}</div>
          <p className="eyebrow">Bloc {idx + 1} / {blocks.length} · {min} min</p>
          <h3>{Q.name}</h3>
          <p>{desc[qid]}</p>
          <div className="timer mono" data-testid="sess-clock">{clock(remain)}</div>
          <div className="row">
            <button className="btn btn-primary" onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : idx === 0 && remain === blocks[0][1] * 60 ? 'Démarrer' : 'Reprendre'}</button>
            <button className="btn btn-gold" onClick={() => advance(true)}>Bloc terminé</button>
            <button className="btn" onClick={() => advance(false)}>Sauter le bloc</button>
            <button className="btn btn-ghost" onClick={() => reset()}>Recommencer</button>
          </div>
        </>
      )}
      <p className="muted small">Le minuteur enchaîne les blocs avec un signal sonore. Chaque bloc terminé valide la quête du jour correspondante, et une session complète sans sauter de bloc rapporte {XP.sess} XP de plus.</p>
    </Panel>
  );
}

function Exercises() {
  const { save, today, act } = useGame();
  const [cat, setCat] = useState('all');
  const done = save.days[today]?.ex ?? [];
  return (
    <Panel title="Bibliothèque d’exercices" aside={<span className="muted small">{Math.min(done.length, XP.exCap)} / {XP.exCap} exercices comptés aujourd’hui · {Math.min(done.length, XP.exCap) * XP.ex} XP</span>}>
      <div className="subtabs">{EXCAT.map(([k, n]) => <button key={k} className={`subtab ${cat === k ? 'sel' : ''}`} aria-pressed={cat === k} onClick={() => setCat(k)}>{n} ({k === 'all' ? EXOS.length : EXOS.filter((x) => x.cat === k).length})</button>)}</div>
      <div className="list">
        {EXOS.filter((x) => cat === 'all' || x.cat === cat).map((x) => (
          <CheckItem key={x.id} on={done.includes(x.id)} title={x.n} desc={x.how} xp={XP.ex}
            meta={<><span className="chip small">Rang {x.r}</span>{typeof x.bpm === 'number' && <span className="chip small">♩ = {x.bpm}</span>}</>}
            onToggle={() => act((s) => A.toggleExercise(s, x.id, today), done.includes(x.id) ? undefined : `${x.n} fait.`)} />
        ))}
      </div>
      <p className="muted small">L’écoute des exercices (tablature jouée par une guitare de synthèse) arrive au lot 3.</p>
    </Panel>
  );
}

function MetronomePanel() {
  const [bpm, setBpm] = useState(60);
  const [bpb, setBpb] = useState(4);
  const [on, setOn] = useState(false);
  const [beat, setBeat] = useState(-1);
  const m = useRef<Metronome | null>(null);
  const taps = useRef<number[]>([]);
  useEffect(() => () => m.current?.dispose(), []);
  useEffect(() => { if (m.current) { m.current.bpm = bpm; m.current.beatsPerBar = bpb; } }, [bpm, bpb]);
  const toggle = () => {
    m.current ??= new Metronome();
    if (m.current.running) { m.current.stop(); setOn(false); setBeat(-1); return; }
    m.current.bpm = bpm; m.current.beatsPerBar = bpb; m.current.onBeat = setBeat;
    setOn(m.current.start());
  };
  const tap = () => {
    const t = performance.now();
    taps.current = [...taps.current.filter((x) => t - x < 3000), t];
    if (taps.current.length >= 2) { const iv = (taps.current[taps.current.length - 1] - taps.current[0]) / (taps.current.length - 1); setBpm(Math.max(30, Math.min(240, Math.round(60000 / iv)))); }
  };
  return (
    <Panel title="Métronome">
      <div className="metro">
        <div className="beats" aria-hidden="true">{Array.from({ length: bpb }, (_, i) => <span key={i} className={`dot ${beat === i ? 'on' : ''} ${i === 0 ? 'first' : ''}`} />)}</div>
        <label className="bpm"><span className="mono big">{bpm}</span> ♩ par minute
          <input type="range" min={30} max={240} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} aria-label="Tempo" />
        </label>
        <div className="row">
          <button className="btn" onClick={() => setBpm((b) => Math.max(30, b - 4))}>−4</button>
          <button className="btn btn-primary" onClick={toggle} aria-pressed={on}>{on ? 'Arrêter' : 'Lancer'}</button>
          <button className="btn" onClick={() => setBpm((b) => Math.min(240, b + 4))}>+4</button>
          <button className="btn" onClick={tap}>Tap</button>
        </div>
        <div className="row">{[2, 3, 4].map((n) => <button key={n} className={`btn ${bpb === n ? 'btn-gold' : ''}`} aria-pressed={bpb === n} onClick={() => setBpb(n)}>{n}/4</button>)}</div>
      </div>
      <p className="muted small">Méthode : commence assez lent pour jouer sans aucune faute. 3 fois propre d’affilée → +4 au tempo. Une faute → reviens au tempo précédent. Note ton record dans le Journal. (Subdivisions, mesures muettes et accélérateur : lot 3.)</p>
    </Panel>
  );
}

function ComingSoon() {
  const rooms = [
    ['Manche', 'Nommer / trouver une note sur le manche, par zone.'], ['Portée', 'Lecture de notes sur la portée.'],
    ['Oreille', 'Intervalles, accords, gammes, cadences, mélodies + notes de référence pour accorder.'], ['Rythme', 'Dictée rythmique sur 3 niveaux.'],
    ['Gammes', 'Atlas des gammes sur le manche, écoute et partition.'], ['Accords', 'Dictionnaire d’accords et grilles à travailler.'],
    ['Arpèges', 'Générateur d’arpèges (grille × motif) avec lecture en boucle.'], ['Jam', 'Accompagnement pour improviser, gamme conseillée.'],
  ];
  return (
    <Panel title="Salles à venir (lot 3)">
      <p>Ces salles du projet de base demandent une guitare de synthèse et l’affichage de partitions. Elles seront portées au lot 3, avec les mêmes règles d’XP (quiz : +{XP.quiz} XP par bonne réponse, plafond {XP.trainCap} XP/jour ; jam : {XP.jamMin} XP/min).</p>
      <ul className="list-plain">{rooms.map(([t, d]) => <li key={t}><b>{t}</b> — <span className="muted">{d}</span></li>)}</ul>
    </Panel>
  );
}
