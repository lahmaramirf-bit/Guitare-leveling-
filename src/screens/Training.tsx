import { useEffect, useRef, useState } from 'react';
import { useGame } from '../ui/store';
import { CheckItem, Panel, Tabs, fmt } from '../ui/bits';
import { EXOS, QUESTS, XP, type QuestId } from '../content';
import { effRank } from '../game/engine';
import { questDescs } from '../game/daily';
import * as A from '../game/actions';
import { Metronome } from '../audio/metronome';
import { DURATIONS, SESSION_PLANS, blockMs, blocksOf, completedWithoutSkip, finishBlock, fmtClock, fmtMinutes, isRunning, newSession, pause, remainingMs, start, type BlockResult } from '../practice/session';
import { useSession } from '../practice/useSession';

type Sub = 'session' | 'exos' | 'metro' | 'soon';
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

const qname = (id: QuestId) => QUESTS.find((q) => q.id === id)?.name ?? id;

/**
 * Séance guidée : blocs chronométrés, métronome intégré, état conservé si l'on change d'onglet,
 * d'écran ou si la page est rechargée ; bilan de fin (temps, XP, cristaux, quêtes).
 */
function Session() {
  const { save, today, p, crystals, act } = useGame();
  const { state: raw, set, now } = useSession();
  const [dur, setDur] = useState(30);
  // Une séance d'un autre jour n'est pas reprise (ses blocs ont déjà été crédités le jour même).
  const state = raw && raw.date === today ? raw : null;
  const desc = questDescs(save, effRank(save, p.c.xp), today);

  const end = (result: BlockResult) => {
    if (!state) return;
    const [qid] = blocksOf(state)[state.idx];
    const { state: next, countedMs } = finishBlock(state, result, Date.now());
    const bonus = completedWithoutSkip(next);
    act((s) => {
      let d = result === 'done' ? A.sessionBlockDone(s, qid, today) : s;
      d = A.addPractice(d, countedMs / 1000, today);
      return bonus ? A.sessionComplete(d, today) : d;
    }, result === 'done' && !save.days[today]?.q.includes(qid) ? `Bloc terminé : ${qname(qid)}.` : undefined);
    set(next);
  };
  const remain = state ? remainingMs(state, now) : 0;
  useEffect(() => { if (state && isRunning(state) && remain <= 0) { beep(); end('done'); } }); // eslint-disable-line react-hooks/exhaustive-deps

  if (!state) {
    const plan = SESSION_PLANS[dur];
    return (
      <Panel title="Session guidée">
        <p>Une séance enchaîne des blocs chronométrés. Chaque bloc terminé valide la quête du jour correspondante et ton temps de pratique est enregistré.</p>
        <div className="row" role="radiogroup" aria-label="Durée de la séance">
          {DURATIONS.map((d) => <button key={d} type="button" role="radio" aria-checked={dur === d} className={`btn ${dur === d ? 'btn-gold' : ''}`} onClick={() => setDur(d)}>{d} min</button>)}
        </div>
        <ol className="plan-list">{plan.map(([q, m]) => <li key={q}><span>{qname(q)}</span><span className="mono muted">{m} min</span></li>)}</ol>
        <button className="btn btn-primary btn-big" data-testid="sess-start" onClick={() => set(start(newSession(dur, today, p.c.xp, crystals), Date.now()))}>Démarrer la séance · {dur} min ♪</button>
      </Panel>
    );
  }

  const blocks = blocksOf(state);
  if (state.finished) {
    const done = state.results.filter((r) => r === 'done').length;
    const bonus = completedWithoutSkip(state);
    const qToday = save.days[today]?.q.length ?? 0;
    return (
      <Panel title="Bilan de la séance">
        <div className="recap" data-testid="sess-recap">
          <div className="recap-grid">
            <div><span className="muted small">Temps pratiqué</span><b className="mono">{fmtMinutes(state.practiced)}</b></div>
            <div><span className="muted small">Blocs terminés</span><b className="mono">{done} / {blocks.length}</b></div>
            <div><span className="muted small">XP gagnée</span><b className="mono">+{fmt(Math.max(0, p.c.xp - state.startXp))}</b></div>
            <div><span className="muted small">Cristaux</span><b className="mono">+{fmt(Math.max(0, crystals - state.startCrystals))}</b></div>
          </div>
          <p>{bonus ? `Séance complète sans bloc sauté : bonus de ${XP.sess} XP inclus.` : 'Un bloc a été sauté : pas de bonus de séance cette fois.'} Quêtes du jour : <b>{qToday} / {QUESTS.length}</b>{qToday >= 5 ? ' — ta série est assurée.' : ` — encore ${5 - qToday} pour garder ta série.`}</p>
          <p className="muted small">Pratique chronométrée aujourd’hui : {fmtMinutes(A.practiceSeconds(save, today) * 1000)}.</p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => set(null)}>Nouvelle séance</button>
            <a className="btn" href="#/quetes">Voir mes quêtes</a>
            <a className="btn" href="#/repertoire">Mon morceau</a>
          </div>
        </div>
      </Panel>
    );
  }

  const [qid, min] = blocks[state.idx];
  const running = isRunning(state);
  return (
    <Panel title="Séance en cours" aside={<span className="muted small">{state.dur} min · pratiqué {fmtMinutes(state.practiced + Math.min(blockMs(state), state.acc + (state.since ? now - state.since : 0)))}</span>}>
      <div className="session-steps" aria-hidden="true">{blocks.map(([b], i) => <i key={i} className={i < state.idx ? (state.results[i] === 'skipped' ? 'skip' : 'done') : i === state.idx ? 'cur' : ''} title={qname(b)} />)}</div>
      <p className="eyebrow">Bloc {state.idx + 1} / {blocks.length} · {min} min</p>
      <h3>{qname(qid)}</h3>
      <p>{desc[qid]}</p>
      <div className={`timer mono ${running ? '' : 'paused'}`} data-testid="sess-clock" aria-live="off">{fmtClock(remain)}</div>
      <div className="row">
        <button className="btn btn-primary" data-testid="sess-toggle" onClick={() => set(running ? pause(state, Date.now()) : start(state, Date.now()))}>{running ? 'Pause' : 'Reprendre'}</button>
        <button className="btn btn-gold" onClick={() => end('done')}>Bloc terminé</button>
        <button className="btn" onClick={() => end('skipped')}>Sauter le bloc</button>
        <button className="btn btn-ghost" onClick={() => { if (window.confirm('Abandonner la séance ? Les blocs déjà terminés restent validés.')) set(null); }}>Abandonner</button>
      </div>
      <details className="inline-metro" open>
        <summary>Métronome</summary>
        <MetronomeControls compact />
      </details>
      <p className="muted small">Ta séance est conservée si tu changes d’onglet ou d’écran, ou si tu recharges la page. Le minuteur continue pendant que tu joues ; il s’arrête seulement si tu mets en pause.</p>
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
  return (
    <Panel title="Métronome">
      <MetronomeControls />
      <p className="muted small">Méthode : commence assez lent pour jouer sans aucune faute. 3 fois propre d’affilée → +4 au tempo. Une faute → reviens au tempo précédent. Note ton record dans le Journal. (Subdivisions, mesures muettes et accélérateur : lot 3.)</p>
    </Panel>
  );
}

/** Commandes du métronome (onglet dédié ou intégrées à la séance). Le tempo choisi est mémorisé. */
function MetronomeControls({ compact = false }: { compact?: boolean }) {
  const [bpm, setBpmRaw] = useState(() => { try { const v = Number(localStorage.getItem('guitar-leveling:bpm')); return v >= 30 && v <= 240 ? v : 60; } catch { return 60; } });
  const setBpm = (f: number | ((b: number) => number)) => setBpmRaw((b) => { const v = typeof f === 'function' ? f(b) : f; try { localStorage.setItem('guitar-leveling:bpm', String(v)); } catch { /* ignore */ } return v; });
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
    <div className={`metro ${compact ? 'compact' : ''}`}>
      <div className="beats" aria-hidden="true">{Array.from({ length: bpb }, (_, i) => <span key={i} className={`dot ${beat === i ? 'on' : ''} ${i === 0 ? 'first' : ''}`} />)}</div>
      <label className="bpm"><span className="mono big" data-testid="metro-bpm">{bpm}</span> ♩ par minute
        <input type="range" min={30} max={240} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} aria-label="Tempo" />
      </label>
      <div className="row">
        <button className="btn" onClick={() => setBpm((b) => Math.max(30, b - 4))}>−4</button>
        <button className="btn btn-primary" onClick={toggle} aria-pressed={on}>{on ? 'Arrêter' : 'Lancer'}</button>
        <button className="btn" onClick={() => setBpm((b) => Math.min(240, b + 4))}>+4</button>
        <button className="btn" onClick={tap}>Tap</button>
      </div>
      {!compact && <div className="row">{[2, 3, 4].map((n) => <button key={n} className={`btn ${bpb === n ? 'btn-gold' : ''}`} aria-pressed={bpb === n} onClick={() => setBpb(n)}>{n}/4</button>)}</div>}
    </div>
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
