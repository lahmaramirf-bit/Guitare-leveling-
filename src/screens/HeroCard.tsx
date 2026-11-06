import { useState } from 'react';
import { useGame } from '../ui/store';
import { Bar, Crystal, Panel, fmt } from '../ui/bits';
import { AvatarPortrait } from '../avatar/Avatar';
import { effRank, levelOf, stars, streak, xpFor } from '../game/engine';
import { RANKS, RANK_INDEX, STATS } from '../content';
import { equipped } from '../game/actions';
import { ITEM } from '../game/catalog';

/** Fiche du héros : niveau, rang, XP, série, cristaux, statistiques. */
export function HeroCard({ onCustomize }: { onCustomize: () => void }) {
  const { save, today, p, crystals } = useGame();
  const [open, setOpen] = useState(false);
  const xp = p.c.xp;
  const L = levelOf(xp);
  const r = effRank(save, xp);
  const next = RANKS[RANK_INDEX(r.id) + 1];
  const sk = streak(save, today);
  const title = equipped(save, 'title');
  return (
    <Panel className="hero-card compact">
      <div className="hero-strip">
        {save.profile.avatarConfirmed ? <AvatarPortrait avatar={save.profile.avatar} size={64} /> : <span className="avatar-portrait pending" style={{ width: 64, height: 64 }} aria-hidden="true" />}
        <div className="hero-level">
          <span className="lv-label">Niv.</span> <span className="lv-num" data-testid="level">{L}</span>
          {stars(L) > 0 && <span className="lv-stars"> {'★'.repeat(Math.min(5, stars(L)))}</span>}
          <div className="lv-title">{r.title}</div>
        </div>
        <span className="spacer" />
        <div className={`rank-gem small rank-${r.id}`} title={`Rang ${r.id} — ${r.name}`}><span>{r.id === 'N' ? 'S+' : r.id}</span></div>
      </div>
      <div className="hero-body">
        <div className="hero-name-row">
          <h1 className="hero-name">{save.profile.name}</h1>
          <span className="tag">{title ? ITEM[title]?.name : r.title}</span>
          <span className="spacer" />
          <span className={`streak ${sk > 0 ? 'on' : ''}`} title="Jours consécutifs avec au moins 5 quêtes sur 7">🔥 {sk} jour{sk > 1 ? 's' : ''}</span>
          <button className="btn btn-gold" onClick={onCustomize}>Personnaliser</button>
        </div>
        <Bar label="XP du niveau" value={xp - xpFor(L)} max={xpFor(L + 1) - xpFor(L)} />
        {next ? <Bar label={`Vers le rang ${next.id === 'N' ? 'final' : next.id} · niveau ${next.lv}`} value={xp} max={xpFor(next.lv)} />
          : <p className="muted small">Rang final atteint. Prochaine étoile au niveau {100 + (stars(L) + 1) * 10}.</p>}
        <div className="hero-foot">
          <div className="chip"><Crystal /> <b data-testid="crystals">{fmt(crystals)}</b> cristaux</div>
          <div className="chip">⏱ <b>{(Math.round(p.c.minutes / 6) / 10).toLocaleString('fr-FR')}</b> h jouées</div>
          <span className="spacer" />
          <button className="link-btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>Statistiques {open ? '▾' : '▸'}</button>
        </div>
        {open && (
          <dl className="stats">
            {STATS.map(([k, n, d]) => <div key={k} title={`${n} · ${d}`}><dt>{k} · {n}</dt><dd>{10 + p.c.st[k]}</dd><span className="small muted">{d}</span></div>)}
          </dl>
        )}
      </div>
    </Panel>
  );
}
