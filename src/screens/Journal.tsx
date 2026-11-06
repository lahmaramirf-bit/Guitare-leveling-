import { useGame } from '../ui/store';
import { Panel, fmt } from '../ui/bits';
import { ACH, RECS, XP } from '../content';
import { bestStreak, shadows, XP_SOURCE_LABELS } from '../game/engine';
import { addDays, mondayOf } from '../game/dates';
import * as A from '../game/actions';
import { useState } from 'react';

export function Journal() {
  const { save, today, p, act } = useGame();
  const c = p.c;
  // Carte de pratique : 53 semaines, lundi → dimanche
  const start = addDays(mondayOf(today), -52 * 7);
  const cells = Array.from({ length: 53 * 7 }, (_, i) => {
    const k = addDays(start, i);
    const D = save.days[k];
    const n = D?.q.length ?? 0;
    const other = D && (D.train || D.sr || D.ex?.length || D.rev?.length || D.jam || D.urg) ? 1 : 0;
    const cls = k > today ? 'future' : n === 7 ? 'l4' : n >= 5 ? 'l3' : n >= 3 ? 'l2' : n >= 1 || other ? 'l1' : '';
    return <i key={k} className={cls} title={`${new Date(k + 'T12:00:00').toLocaleDateString('fr-FR')} : ${n} quête${n > 1 ? 's' : ''}`} />;
  });
  const sh = shadows(save, today).sort((a, b) => a.power - b.power || a.n.localeCompare(b.n));
  const rev = save.days[today]?.rev ?? [];
  const avg = sh.length ? Math.round(sh.reduce((a, s) => a + s.power, 0) / sh.length) : 0;
  const mx = Math.max(1, ...XP_SOURCE_LABELS.map(([k]) => c.src[k]));

  return (
    <div className="stack">
      <Panel title="Carte de pratique" aside={<span className="muted small">12 derniers mois · quêtes faites : 0 · 1–2 · 3–4 · 5–6 · 7</span>}>
        <div className="heat" aria-label="Carte de pratique des 12 derniers mois">{cells}</div>
        <div className="kpis">
          <div><span className="k">Jours</span><b>{fmt(c.daysPlayed)}</b><span className="small muted">de pratique</span></div>
          <div><span className="k">Record</span><b>{bestStreak(save, today)} j</b><span className="small muted">meilleure série</span></div>
          <div><span className="k">Heures</span><b>{(Math.round(c.minutes / 6) / 10).toLocaleString('fr-FR')}</b><span className="small muted">au total</span></div>
          <div><span className="k">XP</span><b>{fmt(c.xp)}</b><span className="small muted">au total</span></div>
        </div>
      </Panel>

      <Panel title="Armée des ombres" aside={<span className="muted small">{sh.length} ombre{sh.length > 1 ? 's' : ''}{sh.length ? ` · puissance moyenne ${avg} %` : ''}</span>}>
        <p className="small muted">Ton répertoire. Une ombre perd de la puissance après 7 jours sans être jouée, et disparaît presque après 2 mois. Rejouer une ombre : +{XP.rev} XP (5 par jour max).</p>
        {sh.length === 0 ? <p className="muted">Ton armée est vide. Chaque morceau appris dans un donjon, une partition ou le répertoire devient une ombre.</p> : (
          <ul className="shadow-grid">
            {sh.map((s) => {
              const on = rev.includes(s.id);
              return (
                <li key={s.id} className={`shadow ${s.power >= 70 ? 'ok' : s.power >= 35 ? 'mid' : 'low'}`}>
                  <div className="row tight"><span className="tag">{s.grade}</span><span className="chip small">{s.o}</span></div>
                  <h4>{s.n}</h4>
                  <div className="power" title={`Puissance ${s.power} %`}><i style={{ width: `${s.power}%` }} /></div>
                  <span className="small muted">{s.ago == null ? 'Jamais rejouée' : s.ago === 0 ? 'Jouée aujourd’hui' : `Il y a ${s.ago} j`} · {s.count} révision{s.count > 1 ? 's' : ''}</span>
                  <button className={`btn ${on ? '' : 'btn-primary'}`} aria-pressed={on} onClick={() => act((x) => A.toggleRevision(x, s.id, today), on ? undefined : `Ombre renforcée : ${s.n}.`)}>{on ? 'Rejouée ✓' : 'Rejouer'}</button>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <div className="grid-2">
        <Panel title="Sources d’XP">
          {XP_SOURCE_LABELS.map(([k, n]) => (
            <div key={k} className="src-row"><span>{n}</span><span className="src-bar"><i style={{ width: `${(c.src[k] / mx) * 100}%` }} /></span><b className="mono">{fmt(c.src[k])}</b></div>
          ))}
        </Panel>
        <Panel title="Records">
          <p className="small muted">Note un record seulement s’il est propre 3 fois d’affilée. Chaque record battu rapporte {XP.rec} XP.</p>
          {RECS.map(([id, n, u, type]) => <RecordRow key={id} id={id} n={n} u={u} type={type} />)}
        </Panel>
      </div>

      <Panel title="Succès" aside={<span className="muted small">{p.achievements.length} / {ACH.length}</span>}>
        <ul className="ach-grid">
          {ACH.map((a) => <li key={a.id} className={p.achievements.includes(a.id) ? 'on' : 'off'}><b>{a.name}</b><span className="small">{a.desc}</span></li>)}
        </ul>
      </Panel>
    </div>
  );
}

function RecordRow({ id, n, u, type }: { id: string; n: string; u: string; type: 'bpm' | 'count' }) {
  const { save, today, act } = useGame();
  const [v, setV] = useState('');
  const R = save.records[id];
  return (
    <form className="rec" onSubmit={(e) => { e.preventDefault(); if (act((x) => A.beatRecord(x, id, parseInt(v, 10), today), `Nouveau record : ${v}.`)) setV(''); }}>
      <div><b>{n}</b><span className="small muted"> {u}</span></div>
      <div className="mono">{R ? `${type === 'bpm' ? '♩ ' : ''}${R.best}` : '–'}<span className="small muted"> {R?.date ? new Date(R.date + 'T12:00:00').toLocaleDateString('fr-FR') : 'aucun'}</span></div>
      <input type="number" min={1} max={400} inputMode="numeric" placeholder={type === 'bpm' ? '♩' : 'nb'} aria-label={`Nouveau record ${n}`} value={v} onChange={(e) => setV(e.target.value)} />
      <button className="btn" type="submit">Noter</button>
    </form>
  );
}
