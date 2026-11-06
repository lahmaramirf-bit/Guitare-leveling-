import { useEffect, useState } from 'react';
import { useGame } from './ui/store';
import { Crystal, fmt } from './ui/bits';
import { Quests } from './screens/Quests';
import { Hub } from './screens/Hub';
import { Avatar } from './avatar/Avatar';
import { Hero } from './screens/Hero';
import { Dungeons } from './screens/Dungeons';
import { Repertoire } from './screens/Repertoire';
import { Training } from './screens/Training';
import { Journal } from './screens/Journal';
import { Grimoire } from './screens/Grimoire';
import { THEMES, themeConceptImage } from './appearance/themes';
import * as A from './game/actions';
import { effRank, levelOf, stars, xpFor } from './game/engine';
import { QUESTS, RANKS, RANK_INDEX } from './content';
import type { AvatarId } from './game/model';

export type Screen = 'hub' | 'quetes' | 'heros' | 'donjons' | 'repertoire' | 'entrainement' | 'journal' | 'grimoire';

const NAV: { id: Screen; label: string; short: string; icon: string }[] = [
  { id: 'hub', label: 'Accueil', short: 'Accueil', icon: '⌂' },
  { id: 'quetes', label: 'Quêtes', short: 'Quêtes', icon: '📜' },
  { id: 'heros', label: 'Héros', short: 'Héros', icon: '✧' },
  { id: 'donjons', label: 'Donjons', short: 'Donjons', icon: '⛩' },
  { id: 'repertoire', label: 'Répertoire', short: 'Morceaux', icon: '♫' },
  { id: 'entrainement', label: 'Entraînement', short: 'Exos', icon: '🎸' },
  { id: 'journal', label: 'Journal', short: 'Journal', icon: '📘' },
  { id: 'grimoire', label: 'Grimoire', short: 'Grimoire', icon: '📖' },
];

function screenFromHash(): Screen {
  const h = window.location.hash.replace(/^#\/?/, '') as Screen;
  return NAV.some((n) => n.id === h) ? h : 'hub';
}

export function App() {
  const { save, today, p, crystals, act, toasts, saveOk } = useGame();
  const [screen, setScreen] = useState<Screen>(screenFromHash);
  const [themeOpen, setThemeOpen] = useState(false);

  useEffect(() => {
    const on = () => setScreen(screenFromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  useEffect(() => {
    if (!themeOpen) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setThemeOpen(false); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [themeOpen]);

  const go = (s: Screen) => { window.location.hash = '/' + s; setScreen(s); window.scrollTo({ top: 0 }); };

  const xp = p.c.xp;
  const L = levelOf(xp);
  const r = effRank(save, xp);
  const next = RANKS[RANK_INDEX(r.id) + 1];
  const done = save.days[today]?.q.length ?? 0;
  const sysline = xp === 0
    ? <>Vous avez reçu une quête : <b>Reprendre la guitare.</b> Refuser n’est pas une option.</>
    : next ? <>Encore <b>{fmt(Math.max(0, xpFor(next.lv) - xp))} XP</b> avant la promotion au rang {next.id === 'N' ? 'final' : next.id}.</>
      : <>Rang final atteint. Prochaine étoile au <b>niveau {100 + (stars(L) + 1) * 10}</b>.</>;

  return (
    <div className="app">
      <header className="top">
        <button className="logo" onClick={() => go('hub')} aria-label="Accueil Guitar Leveling"><span className="logo-note">♫</span> Guitar <em>Leveling</em></button>
        <div className="top-right">
          <span className="chip" title="Cristaux"><Crystal /> {fmt(crystals)}</span>
          <span className="chip" title="Niveau et rang">Niv. {L} · {r.id === 'N' ? 'S+' : r.id}</span>
          <button className="btn btn-outline" onClick={() => setThemeOpen(true)}>✺ Thèmes</button>
        </div>
      </header>

      {screen !== 'hub' && <div className="quest-banner" role="note"><span className="bang">!</span><span>{sysline}</span></div>}
      {!saveOk && <div className="quest-banner warn" role="alert">Sauvegarde indisponible dans ce navigateur (navigation privée ?). Exporte ta progression depuis Héros › Sauvegarde.</div>}

      <nav className="nav" aria-label="Navigation principale">
        {NAV.map((n) => (
          <button key={n.id} className={`nav-btn ${screen === n.id ? 'sel' : ''}`} aria-current={screen === n.id ? 'page' : undefined} onClick={() => go(n.id)}>
            <span className="nav-ico" aria-hidden="true">{n.icon}</span>
            <span className="nav-label">{n.label}</span>
            <span className="nav-short" aria-hidden="true">{n.short}</span>
            {n.id === 'quetes' && done < QUESTS.length && <span className="badge">{QUESTS.length - done}</span>}
          </button>
        ))}
      </nav>

      <main className="main">
        {screen === 'hub' && <Hub go={go} />}
        {screen === 'quetes' && <Quests goHero={() => go('heros')} />}
        {screen === 'heros' && <Hero />}
        {screen === 'donjons' && <Dungeons />}
        {screen === 'repertoire' && <Repertoire />}
        {screen === 'entrainement' && <Training />}
        {screen === 'journal' && <Journal />}
        {screen === 'grimoire' && <Grimoire />}
      </main>

      <footer className="foot muted small">Guitar Leveling · v0.7 · Personnages : masters validés (statiques). Décors finaux et animations en production.</footer>

      {themeOpen && (
        <div className="modal-back" onClick={() => setThemeOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Choisir un thème" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head"><h2>Choisis ton univers</h2><button className="btn btn-ghost" onClick={() => setThemeOpen(false)} aria-label="Fermer">✕</button></div>
            <div className="theme-grid">
              {THEMES.map((t) => (
                <button key={t.id} className={`theme-card ${save.profile.theme === t.id ? 'sel' : ''}`} aria-pressed={save.profile.theme === t.id} onClick={() => act((s) => A.setTheme(s, t.id))}>
                  <img src={themeConceptImage(t.id)} alt="" />
                  <span className="theme-name">{t.label}</span>
                  <span className="theme-sub">{t.subtitle}</span>
                  <span className="swatches">{[t.tokens.accent, t.tokens.accent2, t.tokens.accent3].map((c) => <i key={c} style={{ background: c }} />)}</span>
                </button>
              ))}
            </div>
            <p className="muted small">Le thème change l’interface et l’ambiance, jamais ton personnage. Images : concepts de référence.</p>
          </div>
        </div>
      )}

      {(!save.profile.onboarded || A.needsAvatarChoice(save)) && <Onboarding />}

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={`toast toast-${t.tone}`}>{t.text}</div>)}
      </div>
    </div>
  );
}

function Onboarding() {
  const { save, act } = useGame();
  const returning = save.profile.onboarded;
  const [name, setName] = useState('');
  const [avatar, setAv] = useState<AvatarId | null>(null);
  return (
    <div className="modal-back">
      <form className="modal onboarding" role="dialog" aria-modal="true" aria-label="Choisis ton personnage"
        onSubmit={(e) => { e.preventDefault(); if (avatar) act((s) => A.finishOnboarding(s, name, avatar)); }}>
        <h2>{returning ? 'Choisis ton personnage' : 'Bienvenue à l’Académie'}</h2>
        <p>{returning
          ? 'Nouveauté : ton héros a désormais une vraie apparence. Choisis-la une fois ; ta progression est conservée.'
          : 'Choisis l’apparence de ton héros. Chaque quête de guitare réellement jouée le fera progresser, du rang E jusqu’au rang S.'}</p>
        <div role="radiogroup" aria-label="Apparence du personnage" className="avatar-pick big">
          {(['boy', 'girl'] as const).map((a) => (
            <button type="button" key={a} role="radio" aria-checked={avatar === a} className={`avatar-opt ${avatar === a ? 'sel' : ''}`} onClick={() => setAv(a)} data-testid={`pick-${a}`}>
              <Avatar avatar={a} state="idle" label={a === 'boy' ? 'Musicien aux cheveux bruns et au casque' : 'Musicienne aux cheveux corail et à la barrette clé de sol'} />
              <span>{a === 'boy' ? 'Le musicien' : 'La musicienne'}</span>
            </button>
          ))}
        </div>
        {!returning && <label>Ton nom de héros<input id="onb-name" maxLength={24} value={name} onChange={(e) => setName(e.target.value)} placeholder="Héros" /></label>}
        <button className="btn btn-primary btn-big" type="submit" disabled={!avatar}>{avatar ? 'Confirmer ce personnage ♪' : 'Choisis un personnage'}</button>
        <p className="muted small">Ce choix est définitif : ton personnage restera le même sur toutes les pages. C’est un choix d’apparence, il ne dit rien de toi.</p>
      </form>
    </div>
  );
}
