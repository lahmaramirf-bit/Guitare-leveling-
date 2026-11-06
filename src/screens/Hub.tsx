import { useState } from 'react';
import { useGame } from '../ui/store';
import { Bar, Crystal, Panel, fmt } from '../ui/bits';
import { Avatar, AvatarPending } from '../avatar/Avatar';
import { AmbienceCanvas } from '../appearance/AmbienceCanvas';
import { WORLDS, activePanel, panelFromUrl } from '../appearance/worlds';
import { CANVAS } from '../avatar/manifest';
import { effRank, levelOf, streak, xpFor } from '../game/engine';
import { PLAN, QUESTS, RANKS, RANK_INDEX } from '../content';
import { equipped } from '../game/actions';
import { currentSong } from '../game/daily';
import { ITEM } from '../game/catalog';
import type { Screen } from '../App';
import { peekSession } from '../practice/useSession';
import { blocksOf, fmtMinutes } from '../practice/session';
import { practiceSeconds } from '../game/actions';

/** Hauteur de la boîte avatar, en fraction de la hauteur du décor. */
export const AVATAR_BOX_H = 0.92;

/**
 * Accueil : panneau personnage compact (décor + héros entier) puis la progression
 * et les actions de pratique. Pas de HUD ni de menu de jeu par-dessus le décor.
 */
export function Hub({ go }: { go: (s: Screen) => void }) {
  const { save, today, p, crystals, celebrating } = useGame();
  const w = WORLDS[save.profile.theme];
  const [pick, setPick] = useState<string | null>(panelFromUrl);
  const panel = activePanel(w.panel, pick);
  const variantIds = w.panel.variants && w.panel.status !== 'approved' ? ['v1', ...Object.keys(w.panel.variants)] : [];
  const xp = p.c.xp;
  const L = levelOf(xp);
  const r = effRank(save, xp);
  const next = RANKS[RANK_INDEX(r.id) + 1];
  const done = save.days[today]?.q.length ?? 0;
  const title = equipped(save, 'title');
  const sk = streak(save, today);
  const song = currentSong(save);
  const steps = song ? save.rep[song.id]?.st?.length ?? 0 : 0;
  const live = (() => { const x = peekSession(); return x && x.date === today && !x.finished ? x : null; })();
  const pracToday = practiceSeconds(save, today);
  const hasBg = panel.status !== 'planned_missing' && !!panel.file;
  // Pieds du personnage sur la ligne de sol du décor : bas de la boîte = sol + marge sous les pieds du canevas.
  const boxBottom = (1 - panel.groundY) * 100 - ((CANVAS.height - CANVAS.groundY) / CANVAS.height) * AVATAR_BOX_H * 100;

  return (
    <section className={`hub world-${w.id}`} aria-label="Accueil">
      <Panel className="char-panel">
        <div className={`char-scene ${hasBg ? 'has-bg' : 'no-bg'}`} data-testid="hub-stage" data-panel-status={panel.status} data-panel-variant={panel.variant} data-ground={panel.groundY}>
          {hasBg
            ? <img className="char-bg" src={panel.file!} alt="" draggable={false} />
            : <div className="char-bg-provisional" style={{ backgroundImage: `url(${w.provisional})` }} aria-hidden="true" />}
          {!hasBg && <AmbienceCanvas kind={w.ambience} />}
          <div className="hub-hero" style={{ height: `${AVATAR_BOX_H * 100}%`, bottom: `${boxBottom}%` }}>
            {save.profile.avatarConfirmed
              ? <Avatar avatar={save.profile.avatar} guitar={equipped(save, 'guitar')} state={celebrating ? 'celebrate' : 'idle'} />
              : <AvatarPending />}
          </div>
          <div className="char-level"><span className="lv-label">Niv.</span> <span className="lv-num" data-testid="level">{L}</span><div className="lv-title">{r.title}</div></div>
          <div className={`rank-gem small rank-${r.id}`} title={`Rang ${r.id} — ${r.name}`}><span>{r.id === 'N' ? 'S+' : r.id}</span></div>
          {variantIds.length > 1 && (
            <div className="variant-switch" role="group" aria-label="Comparer les versions du décor">
              {variantIds.map((id) => (
                <button key={id} type="button" aria-pressed={panel.variant === id} className={panel.variant === id ? 'sel' : ''} onClick={() => setPick(id)} data-testid={`panel-${id}`}>{id.toUpperCase()}</button>
              ))}
            </div>
          )}
          {panel.status === 'candidate' && <span className="provisional-tag"><span className="t-long">Décor candidat · à valider</span><span className="t-short">Candidat</span></span>}
          {panel.status === 'planned_missing' && <span className="provisional-tag" title={`Fichier attendu : ${panel.expected}`}><span className="t-long">Décor provisoire · {w.name}</span><span className="t-short">Provisoire</span></span>}
        </div>

        <div className="hero-body">
          <div className="hero-name-row">
            <h1 className="hero-name">{save.profile.name}</h1>
            <span className="tag">{title ? ITEM[title]?.name : r.title}</span>
            <span className="spacer" />
            <span className={`streak ${sk > 0 ? 'on' : ''}`} title="Jours consécutifs avec au moins 5 quêtes sur 7">🔥 {sk} jour{sk > 1 ? 's' : ''}</span>
            <button className="btn btn-gold" onClick={() => go('heros')}>Personnaliser</button>
          </div>
          <Bar label="XP du niveau" value={xp - xpFor(L)} max={xpFor(L + 1) - xpFor(L)} />
          {next && <Bar label={`Vers le rang ${next.id === 'N' ? 'final' : next.id} · niveau ${next.lv}`} value={xp} max={xpFor(next.lv)} />}
          <div className="hero-foot"><span className="chip"><Crystal /> <b>{fmt(crystals)}</b> cristaux</span></div>
        </div>
      </Panel>

      <Panel title="Pratiquer aujourd’hui">
        <div className="practice">
          {live
            ? <button className="btn btn-primary btn-big" data-testid="hub-resume" onClick={() => go('entrainement')}>Reprendre ma séance · bloc {live.idx + 1} / {blocksOf(live).length} ♪</button>
            : <button className="btn btn-primary btn-big" onClick={() => go('entrainement')}>S’entraîner · session guidée ♪</button>}
          {pracToday > 0 && <p className="small muted" data-testid="hub-practice">Pratique chronométrée aujourd’hui : <b>{fmtMinutes(pracToday * 1000)}</b></p>}
          <button className="practice-row" onClick={() => go('quetes')}>
            <span><b>Quêtes du jour</b><span className="small muted">≈ 38 min · 5 sur 7 gardent la série</span></span>
            <b className="mono">{done} / {QUESTS.length}</b>
          </button>
          <button className="practice-row" onClick={() => go('repertoire')}>
            <span><b>{song ? `Morceau en cours : ${song.t}` : 'Choisir un morceau à apprendre'}</b>
              <span className="small muted">{song ? (steps < PLAN.length ? `Étape ${steps + 1} / ${PLAN.length} : ${PLAN[steps]}` : 'Plan terminé : joue-le en entier') : 'Répertoire de 193 morceaux, classés par niveau'}</span></span>
            <span aria-hidden="true">›</span>
          </button>
          <button className="practice-row" onClick={() => go('donjons')}>
            <span><b>Objectifs du rang {r.id === 'N' ? 'S+' : r.id}</b><span className="small muted">{r.name}</span></span>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </Panel>
    </section>
  );
}
