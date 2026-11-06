import { useGame } from '../ui/store';
import { Bar, Crystal, fmt } from '../ui/bits';
import { Avatar, AvatarPending } from '../avatar/Avatar';
import { AmbienceCanvas } from '../appearance/AmbienceCanvas';
import { WORLDS } from '../appearance/worlds';
import { effRank, levelOf, streak, xpFor } from '../game/engine';
import { QUESTS, RANKS, RANK_INDEX } from '../content';
import { equipped } from '../game/actions';
import { ITEM } from '../game/catalog';
import type { Screen } from '../App';

const ENTRIES: { id: Screen; label: string; hint: string; icon: string }[] = [
  { id: 'quetes', label: 'Quêtes', hint: 'Les 7 quêtes du jour, portail, défis', icon: '📜' },
  { id: 'entrainement', label: 'Entraînement', hint: 'Session guidée, exercices, métronome', icon: '🎸' },
  { id: 'donjons', label: 'Donjons', hint: 'Objectifs et boss de ton rang', icon: '⛩' },
  { id: 'repertoire', label: 'Répertoire', hint: 'Tes morceaux et collections', icon: '♫' },
  { id: 'heros', label: 'Boutique', hint: 'Cosmétiques gagnés en jouant', icon: '✧' },
  { id: 'journal', label: 'Journal', hint: 'Carte de pratique, ombres, succès', icon: '📘' },
];

/** Hub : le héros entier dans son univers, l'état de progression et les entrées du jeu. */
export function Hub({ go }: { go: (s: Screen) => void }) {
  const { save, today, p, crystals, celebrating } = useGame();
  const w = WORLDS[save.profile.theme];
  const xp = p.c.xp;
  const L = levelOf(xp);
  const r = effRank(save, xp);
  const next = RANKS[RANK_INDEX(r.id) + 1];
  const done = save.days[today]?.q.length ?? 0;
  const title = equipped(save, 'title');
  const sk = streak(save, today);
  const bgFinal = w.background.status === 'approved';

  return (
    <section className={`hub world-${w.id}`} aria-label={`Hub — ${w.place}`}>
      <div className="hub-stage" data-testid="hub-stage">
        <div className="hub-backdrop" aria-hidden="true">
          {bgFinal
            ? <picture><source media="(max-width: 760px)" srcSet={w.background.mobile ?? undefined} /><img src={w.background.desktop ?? ''} alt="" /></picture>
            : <div className="hub-backdrop-provisional" style={{ backgroundImage: `url(${w.provisional})` }} />}
          <div className="hub-light" />
        </div>
        <AmbienceCanvas kind={w.ambience} />
        <div className="hub-floor" aria-hidden="true" />
        <div className="hub-hero">
          {save.profile.avatarConfirmed
            ? <Avatar avatar={save.profile.avatar} guitar={equipped(save, 'guitar')} state={celebrating ? 'celebrate' : 'idle'} />
            : <AvatarPending />}
        </div>

        <div className="hub-status">
          <div className={`rank-gem small rank-${r.id}`} title={`Rang ${r.id} — ${r.name}`}><span>{r.id === 'N' ? 'S+' : r.id}</span></div>
          <div className="hub-id">
            <b className="hub-name">{save.profile.name}</b>
            <span className="hub-title">{title ? ITEM[title]?.name : r.title} · Niv. <b data-testid="level">{L}</b></span>
            <Bar label="XP du niveau" value={xp - xpFor(L)} max={xpFor(L + 1) - xpFor(L)} />
          </div>
        </div>
        <div className="hub-chips">
          <span className="chip"><Crystal /> {fmt(crystals)}</span>
          <span className={`chip streak ${sk > 0 ? 'on' : ''}`}>🔥 {sk} j</span>
        </div>
        {!bgFinal && <span className="provisional-tag" title={`Fichiers attendus : ${w.background.expected.join(', ')}`}>Décor provisoire · {w.name}</span>}
      </div>

      <div className="hub-actions">
        <button className="btn btn-primary btn-big" onClick={() => go('entrainement')}>Commencer l’entraînement ♪</button>
        <button className="btn btn-big" onClick={() => go('quetes')}>Quêtes du jour <b className="mono">{done}/{QUESTS.length}</b></button>
        {next && <span className="muted small hub-next">Encore {fmt(Math.max(0, xpFor(next.lv) - xp))} XP avant le rang {next.id === 'N' ? 'final' : next.id}</span>}
      </div>

      <nav className="hub-menu" aria-label="Lieux du hub">
        {ENTRIES.map((e) => (
          <button key={e.id} className="hub-tile" onClick={() => go(e.id)}>
            <span className="hub-tile-ico" aria-hidden="true">{e.icon}</span>
            <span className="hub-tile-text"><b>{e.label}</b><span className="small muted">{e.hint}</span></span>
          </button>
        ))}
      </nav>
    </section>
  );
}
