import { useEffect, useState } from 'react';
import { useGame } from './ui/store';
import { Crystal, fmt } from './ui/bits';
import { Icon, type IconName } from './ui/icons';
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
import { PLACEMENT, placement } from './game/placement';

export type Screen = 'hub' | 'quetes' | 'heros' | 'donjons' | 'repertoire' | 'entrainement' | 'journal' | 'grimoire';

/** Barre principale (5 entrées, comme une barre d'onglets de jeu mobile) ; donjons, journal et grimoire sont sur l'accueil. */
const NAV: { id: Screen; label: string; short: string; icon: IconName }[] = [
  { id: 'hub', label: 'Accueil', short: 'Accueil', icon: 'sparkle' },
  { id: 'quetes', label: 'Quêtes', short: 'Quêtes', icon: 'scroll' },
  { id: 'entrainement', label: 'Entraînement', short: 'Entraîner', icon: 'guitar' },
  { id: 'repertoire', label: 'Répertoire', short: 'Morceaux', icon: 'note' },
  { id: 'heros', label: 'Profil', short: 'Profil', icon: 'trophy' },
];
const SCREENS: Screen[] = ['hub', 'quetes', 'heros', 'donjons', 'repertoire', 'entrainement', 'journal', 'grimoire'];

function screenFromHash(): Screen {
  const h = window.location.hash.replace(/^#\/?/, '') as Screen;
  return SCREENS.includes(h) ? h : 'hub';
}

export function App() {
  const { save, today, p, crystals, act, toasts, saveOk } = useGame();
  const [screen, setScreen] = useState<Screen>(screenFromHash);
  const [themeOpen, setThemeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const on = () => setScreen(screenFromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  useEffect(() => {
    if (!themeOpen && !settingsOpen) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { setThemeOpen(false); setSettingsOpen(false); } };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [themeOpen, settingsOpen]);

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
    <div className={`app ${screen === 'hub' ? 'on-home' : ''}`}>
      {screen !== 'hub' && <header className="top">
        <button className="logo" onClick={() => go('hub')} aria-label="Accueil Guitar Leveling"><span className="logo-note">♫</span> Guitar <em>Leveling</em></button>
        <div className="top-right">
          <span className="chip" title="Cristaux"><Crystal /> {fmt(crystals)}</span>
          <span className="chip" title="Niveau et rang">Niv. {L} · {r.id === 'N' ? 'S+' : r.id}</span>
          <button className="btn btn-outline" onClick={() => setThemeOpen(true)}>✺ Thèmes</button>
          <button className="btn btn-outline icon" onClick={() => setSettingsOpen(true)} aria-label="Réglages" title="Réglages" data-testid="open-settings">⚙</button>
        </div>
      </header>}

      {screen !== 'hub' && <div className="quest-banner" role="note"><span className="bang">!</span><span>{sysline}</span></div>}
      {!saveOk && <div className="quest-banner warn" role="alert">Sauvegarde indisponible dans ce navigateur (navigation privée ?). Exporte ta progression depuis Héros › Sauvegarde.</div>}

      <nav className="nav" aria-label="Navigation principale">
        {NAV.map((n) => (
          <button key={n.id} className={`nav-btn ${screen === n.id ? 'sel' : ''}`} aria-current={screen === n.id ? 'page' : undefined} onClick={() => go(n.id)}>
            <span className="nav-ico" aria-hidden="true">{(() => { const I = Icon[n.icon]; return <I size={22} />; })()}</span>
            <span className="nav-label">{n.label}</span>
            <span className="nav-short" aria-hidden="true">{n.short}</span>
            {n.id === 'quetes' && done < QUESTS.length && <span className="badge">{QUESTS.length - done}</span>}
          </button>
        ))}
      </nav>

      <main className="main">
        {screen === 'hub' && <Hub go={go} openSettings={() => setSettingsOpen(true)} openThemes={() => setThemeOpen(true)} />}
        {screen === 'quetes' && <Quests goHero={() => go('heros')} />}
        {screen === 'heros' && <Hero />}
        {screen === 'donjons' && <Dungeons />}
        {screen === 'repertoire' && <Repertoire />}
        {screen === 'entrainement' && <Training />}
        {screen === 'journal' && <Journal />}
        {screen === 'grimoire' && <Grimoire />}
      </main>

      {screen !== 'hub' && <footer className="foot muted small">Guitar Leveling · v0.8 · Personnages : masters validés (statiques). Décors finaux et animations en production.</footer>}

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

      {settingsOpen && <Settings close={() => setSettingsOpen(false)} openThemes={() => { setSettingsOpen(false); setThemeOpen(true); }} />}

      {(!save.profile.onboarded || A.needsAvatarChoice(save)) && <Onboarding />}

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={`toast toast-${t.tone}`}>{t.text}</div>)}
      </div>
    </div>
  );
}

/** Réglages généraux : petite fenêtre par-dessus l'écran courant (brief : son, interface, langue). */
function Settings({ close, openThemes }: { close: () => void; openThemes: () => void }) {
  const { save, act } = useGame();
  const t = THEMES.find((x) => x.id === save.profile.theme);
  return (
    <div className="modal-back" onClick={close}>
      <div className="modal settings" role="dialog" aria-modal="true" aria-label="Réglages" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><h2>Réglages</h2><button className="btn btn-ghost" onClick={close} aria-label="Fermer">✕</button></div>
        <ul className="settings-list">
          <li><span>Sons (accords, signaux)</span>
            <button className={`switch ${save.profile.sfx ? 'on' : ''}`} role="switch" aria-checked={save.profile.sfx} data-testid="set-sfx" onClick={() => act((s) => A.setSfx(s, !s.profile.sfx))}><i /></button></li>
          <li><span>Univers</span><button className="btn" onClick={openThemes}>{t?.label ?? '—'} ›</button></li>
          <li><span>Animations</span><span className="muted small">Suit le réglage « réduire les animations » de ton appareil</span></li>
          <li><span>Langue</span><span className="muted small">Français (autres langues à venir)</span></li>
          <li><span>Sauvegarde</span><a className="btn" href="#/heros" onClick={close}>Exporter / importer ›</a></li>
        </ul>
        <p className="muted small">Guitar Leveling v0.8 · aucune donnée n’est envoyée : tout reste sur cet appareil.</p>
      </div>
    </div>
  );
}

function Onboarding() {
  const { save, act } = useGame();
  const returning = save.profile.onboarded;
  const [name, setName] = useState('');
  const [avatar, setAv] = useState<AvatarId | null>(null);
  // Un joueur qui a déjà un historique (sauvegarde du projet de base) n'est pas requestionné : son rang vient de sa progression.
  const hasHistory = Object.keys(save.days).length > 0;
  const [step, setStep] = useState<'quiz' | 'avatar'>(returning || hasHistory ? 'avatar' : 'quiz');
  const [pts, setPts] = useState<(number | null)[]>([null, null, null]);
  const done = pts.every((x) => x !== null);
  const place = done ? placement(pts as number[]) : null;

  if (step === 'quiz') {
    return (
      <div className="modal-back">
        <div className="modal onboarding" role="dialog" aria-modal="true" aria-label="Ton niveau">
          <h2>Bienvenue à l’Académie</h2>
          <p>Trois questions pour adapter tes quêtes à ce que tu sais déjà. Tu pourras monter plus haut en jouant.</p>
          {PLACEMENT.map((Q, qi) => (
            <fieldset className="quiz-q" key={Q.id}>
              <legend>{qi + 1}. {Q.q}</legend>
              <div className="quiz-a">
                {Q.a.map((a) => <button type="button" key={a.label} className={`btn ${pts[qi] === a.pts ? 'btn-gold' : ''}`} aria-pressed={pts[qi] === a.pts} data-testid={`quiz-${Q.id}-${a.pts}`} onClick={() => setPts((p) => p.map((v, i) => (i === qi ? a.pts : v)))}>{a.label}</button>)}
              </div>
            </fieldset>
          ))}
          {place && <p className="notice" data-testid="quiz-result"><b>Rang de départ {place.rank}</b> · {place.label} Séances conseillées : {place.minutes} min.</p>}
          <button className="btn btn-primary btn-big" type="button" disabled={!done} data-testid="quiz-next" onClick={() => setStep('avatar')}>{done ? 'Continuer ♪' : 'Réponds aux 3 questions'}</button>
        </div>
      </div>
    );
  }
  return (
    <div className="modal-back">
      <form className="modal onboarding" role="dialog" aria-modal="true" aria-label="Choisis ton personnage"
        onSubmit={(e) => { e.preventDefault(); if (avatar) act((s) => { const n = A.finishOnboarding(s, name, avatar); return done && !returning ? A.placeLevel(n, pts as number[]) : n; }); }}>
        <h2>{returning ? 'Choisis ton personnage' : 'Ton personnage'}</h2>
        <p>{returning
          ? 'Nouveauté : ton héros a désormais une vraie apparence. Choisis-la une fois ; ta progression est conservée.'
          : 'Chaque quête de guitare réellement jouée le fera progresser, du rang E jusqu’au rang S.'}</p>
        <div role="radiogroup" aria-label="Apparence du personnage" className="avatar-pick big">
          {(['boy', 'girl'] as const).map((a) => (
            <button type="button" key={a} role="radio" aria-checked={avatar === a} className={`avatar-opt ${avatar === a ? 'sel' : ''}`} onClick={() => { setAv(a); }} data-testid={`pick-${a}`}>
              <Avatar avatar={a} state="idle" label={a === 'boy' ? 'Musicien aux cheveux bruns et au casque' : 'Musicienne aux cheveux corail et à la barrette clé de sol'} />
              <span>{A.DEFAULT_NAMES[a]}</span>
            </button>
          ))}
        </div>
        {!returning && <label>Son nom<input id="onb-name" maxLength={24} value={name} onChange={(e) => setName(e.target.value)} placeholder={avatar ? A.DEFAULT_NAMES[avatar] : 'Rémi ou Mélodie'} /></label>}
        <button className="btn btn-primary btn-big" type="submit" disabled={!avatar}>{avatar ? 'Confirmer ce personnage ♪' : 'Choisis un personnage'}</button>
        <p className="muted small">Ce choix est définitif : ton personnage restera le même partout. C’est un choix d’apparence, il ne dit rien de toi.</p>
      </form>
    </div>
  );
}
