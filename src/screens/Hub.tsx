import { useEffect, useRef, useState } from 'react';
import { CHORDS, strum } from '../audio/strum';
import { CANVAS, playReady } from '../avatar/manifest';
import { Avatar, AvatarPending, usePrefersReducedMotion } from '../avatar/Avatar';
import { useGame } from '../ui/store';
import { Icon } from '../ui/icons';
import { fmt } from '../ui/bits';
import { AmbienceCanvas } from '../appearance/AmbienceCanvas';
import { WORLDS } from '../appearance/worlds';
import { effRank, levelOf, streak, xpFor } from '../game/engine';
import { PLAN, QUESTS, RANKS, RANK_INDEX } from '../content';
import { equipped, practiceSeconds } from '../game/actions';
import { currentSong, tipOfDay } from '../game/daily';
import { ITEM } from '../game/catalog';
import { peekSession } from '../practice/useSession';
import { blocksOf, fmtMinutes } from '../practice/session';
import type { Screen } from '../App';

/** Hauteur de la boîte avatar, en fraction de la hauteur de la scène (plus petit sur l'accueil : le décor respire, la grande version reste sur le Profil). */
export const AVATAR_BOX_H = 0.66;

/**
 * Page principale : le décor du thème EST l'écran (bord à bord), le personnage se tient sur sa ligne de sol,
 * et l'interface flotte par-dessus (boutons ronds, compteurs), comme dans un jeu mobile. Sous la scène, une
 * planche dans la matière du thème porte le profil, le bouton de pratique, les raccourcis et le conseil du jour.
 */
export function Hub({ go, openSettings, openThemes }: { go: (s: Screen) => void; openSettings: () => void; openThemes: () => void }) {
  const { save, today, p, crystals, celebrating } = useGame();
  const w = WORLDS[save.profile.theme];
  const panel = w.panel;
  const xp = p.c.xp;
  const L = levelOf(xp);
  const r = effRank(save, xp);
  const next = RANKS[RANK_INDEX(r.id) + 1];
  const done = save.days[today]?.q.length ?? 0;
  const title = equipped(save, 'title');
  const sk = streak(save, today);
  const song = currentSong(save);
  const steps = song ? save.rep[song.id]?.st?.length ?? 0 : 0;
  const hasBg = panel.status !== 'planned_missing' && !!panel.file;
  const boxBottom = (1 - panel.groundY) * 100 - ((CANVAS.height - CANVAS.groundY) / CANVAS.height) * AVATAR_BOX_H * 100;

  // Toucher le personnage : accord synthétisé + retour visuel.
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [chord, setChord] = useState<{ name: string; n: number } | null>(null);
  const chordIdx = useRef(0);
  const stopT = useRef<number | undefined>(undefined);
  const play = () => {
    if (!save.profile.avatarConfirmed) return;
    const i = chordIdx.current++;
    if (save.profile.sfx) strum(i);
    setChord({ name: CHORDS[i % CHORDS.length].name, n: i });
    setPlaying(true);
    window.clearTimeout(stopT.current);
    stopT.current = window.setTimeout(() => setPlaying(false), 900);
  };
  const avatarState = playing ? (playReady(save.profile.avatar) ? 'strum' : 'celebrate') : celebrating ? 'celebrate' : 'idle';

  const [tipN, setTipN] = useState(0);
  useEffect(() => { const t = window.setInterval(() => setTipN((n) => n + 1), 12_000); return () => window.clearInterval(t); }, []);
  const tip = tipOfDay(today, tipN);
  const live = (() => { const x = peekSession(); return x && x.date === today && !x.finished ? x : null; })();
  const pracToday = practiceSeconds(save, today);
  const rankLabel = r.id === 'N' ? 'S+' : r.id;

  const side = (label: string, icon: keyof typeof Icon, onClick: () => void, badge?: number, testId?: string) => {
    const I = Icon[icon];
    return (
      <button type="button" className="hud-btn" onClick={onClick} data-testid={testId}>
        <span className="hud-ico"><I size={24} />{badge ? <b className="hud-badge">{badge}</b> : null}</span>
        <span className="hud-lab">{label}</span>
      </button>
    );
  };

  return (
    <section className={`home world-${w.id}`} aria-label="Accueil">
      <div className={`home-scene ${hasBg ? 'has-bg' : 'no-bg'}`} data-testid="hub-stage" data-panel-status={panel.status} data-ground={panel.groundY}>
        {/* URL en style inline (résolue depuis la page) : une variable CSS consommée dans la feuille serait résolue depuis /assets/ */}
        <div className="scene-bg" aria-hidden="true" style={{ backgroundImage: `url(${hasBg ? panel.file : w.provisional})` }} />
        <AmbienceCanvas kind={w.ambience} />

        <div className="hud hud-top">
          <button type="button" className="hud-round" onClick={openSettings} aria-label="Réglages" title="Réglages" data-testid="open-settings"><Icon.gear /></button>
          <span className="spacer" />
          <span className="hud-chip" title="Cristaux"><Icon.gem /> <b>{fmt(crystals)}</b></span>
          <span className={`hud-chip ${sk > 0 ? 'hot' : ''}`} title="Jours consécutifs avec au moins 5 quêtes sur 7"><Icon.flame /> <b>{sk}</b></span>
        </div>

        <nav className="hud hud-left" aria-label="Menu">
          {side('Thèmes', 'sparkle', openThemes)}
          {side('Journal', 'trophy', () => go('journal'))}
          {side('Grimoire', 'book', () => go('grimoire'))}
        </nav>
        <nav className="hud hud-right" aria-label="Menu">
          {side('Quêtes', 'scroll', () => go('quetes'), QUESTS.length - done > 0 ? QUESTS.length - done : undefined, 'hud-quetes')}
          {side('Donjons', 'gate', () => go('donjons'))}
          {side('Morceaux', 'note', () => go('repertoire'))}
        </nav>

        <button type="button" className={`hub-hero ${playing ? 'playing' : ''}`} style={{ height: `${AVATAR_BOX_H * 100}%`, bottom: `${boxBottom}%` }}
          onClick={play} data-testid="hero-play" aria-label="Touche ton personnage pour qu’il joue un accord" title="Touche-moi pour jouer un accord ♪">
          {save.profile.avatarConfirmed
            ? <Avatar avatar={save.profile.avatar} guitar={equipped(save, 'guitar')} state={avatarState} />
            : <AvatarPending />}
          {chord && playing && (
            <span className="strum-fx" key={chord.n} aria-hidden="true">
              <b className="chord-name">{chord.name}</b>
              {!reduced && ['♪', '♫', '♩'].map((n, k) => <i key={k} className={`note n${k}`}>{n}</i>)}
            </span>
          )}
        </button>
        <span className="sr-only" aria-live="polite">{chord && playing ? `Accord ${chord.name}` : ''}</span>
      </div>

      <div className="home-board">
        <button type="button" className={`ticker ${reduced ? 'static' : ''}`} onClick={() => setTipN((n) => n + 1)} title="Conseil suivant" data-testid="tip-band" aria-label={`Conseil : ${tip[1]}`}>
          <span className="ticker-tag">Conseil</span>
          <span className="ticker-track" aria-hidden="true"><span className="ticker-text" key={tipN}>{tip[1]}<i>✦</i>{tip[0]}<i>✦</i>{tip[1]}<i>✦</i></span></span>
        </button>
        <div className="board-inner">
          <div className="board-profile">
            <div className={`rank-gem small rank-${r.id}`} title={`Rang ${rankLabel} — ${r.name}`}><span>{rankLabel}</span></div>
            <div className="board-id">
              <div className="board-name-row">
                <span className="board-lv">Niv. <b data-testid="level">{L}</b></span>
                <h1 className="board-name">{save.profile.name}</h1>
              </div>
              <div className="board-title">{title ? ITEM[title]?.name : r.title}</div>
              <div className="board-xp" role="progressbar" aria-label="XP du niveau" aria-valuemin={0} aria-valuemax={xpFor(L + 1) - xpFor(L)} aria-valuenow={xp - xpFor(L)}>
                <i style={{ width: `${Math.min(100, ((xp - xpFor(L)) / (xpFor(L + 1) - xpFor(L))) * 100)}%` }} />
                <span className="mono">{fmt(xp - xpFor(L))} / {fmt(xpFor(L + 1) - xpFor(L))}</span>
              </div>
            </div>
            <button type="button" className="board-edit" onClick={() => go('heros')}>Profil <Icon.chevron size={14} /></button>
          </div>

          <button type="button" className="go-btn" data-testid={live ? 'hub-resume' : 'hub-train'} onClick={() => go('entrainement')}>
            <span className="go-ico"><Icon.play size={26} /></span>
            <span className="go-text">
              <b>{live ? `Reprendre ma séance · bloc ${live.idx + 1} / ${blocksOf(live).length}` : 'S’entraîner'}</b>
              <small>{live ? 'Ta séance t’attend' : pracToday > 0 ? `Déjà ${fmtMinutes(pracToday * 1000)} aujourd’hui · session guidée` : 'Session guidée · métronome · exercices'}</small>
            </span>
          </button>

          <div className="board-rows">
            <button type="button" className="board-row" onClick={() => go('quetes')}>
              <Icon.scroll size={20} /><span><b>Quêtes du jour</b><small>5 sur 7 gardent la série</small></span><b className="mono">{done} / {QUESTS.length}</b>
            </button>
            <button type="button" className="board-row" onClick={() => go('repertoire')}>
              <Icon.note size={20} /><span><b>{song ? song.t : 'Choisir un morceau'}</b><small>{song ? (steps < PLAN.length ? `Étape ${steps + 1} / ${PLAN.length} : ${PLAN[steps]}` : 'Plan terminé : joue-le en entier') : '193 morceaux classés par niveau'}</small></span><Icon.chevron size={16} />
            </button>
            <button type="button" className="board-row" onClick={() => go('donjons')}>
              <Icon.gate size={20} /><span><b>Objectifs du rang {rankLabel}</b><small>{r.name}{next ? ` · rang ${next.id === 'N' ? 'S+' : next.id} au niveau ${next.lv}` : ''}</small></span><Icon.chevron size={16} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
