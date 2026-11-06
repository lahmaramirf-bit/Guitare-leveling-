import { useEffect, useState } from 'react';
import { useGame } from './ui/store';
import { Crystal, fmt } from './ui/bits';
import { Home } from './screens/Home';
import { Quests } from './screens/Quests';
import { Training } from './screens/Training';
import { Repertoire } from './screens/Repertoire';
import { Hero } from './screens/Hero';
import { Journal } from './screens/Journal';
import { Grimoire } from './screens/Grimoire';
import { THEMES, themeConceptImage } from './appearance/themes';
import { setAvatar, setName, setTheme } from './game/state';
import { activeMainQuest, dailyKey, dailyQuests, isDone } from './game/quests';
import { levelFromXp } from './game/levels';

export type Screen = 'home' | 'quests' | 'training' | 'repertoire' | 'hero' | 'journal' | 'grimoire';

const NAV: { id: Screen; label: string; short: string; icon: string }[] = [
  { id: 'home', label: 'Accueil', short: 'Accueil', icon: '⌂' },
  { id: 'quests', label: 'Quêtes', short: 'Quêtes', icon: '📜' },
  { id: 'training', label: 'Entraînement', short: 'Séance', icon: '🎸' },
  { id: 'repertoire', label: 'Répertoire', short: 'Morceaux', icon: '♫' },
  { id: 'hero', label: 'Héros', short: 'Héros', icon: '✧' },
  { id: 'journal', label: 'Journal', short: 'Journal', icon: '📘' },
  { id: 'grimoire', label: 'Grimoire', short: 'Grimoire', icon: '📖' },
];

function screenFromHash(): Screen {
  const h = window.location.hash.replace(/^#\/?/, '') as Screen;
  return NAV.some((n) => n.id === h) ? h : 'home';
}

export function App() {
  const { state, today, update, toasts, saveOk } = useGame();
  const [screen, setScreen] = useState<Screen>(screenFromHash);
  const [themeOpen, setThemeOpen] = useState(false);
  const [songId, setSongId] = useState<string | null>(null);

  useEffect(() => {
    const on = () => setScreen(screenFromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const go = (s: Screen) => {
    window.location.hash = '/' + s;
    setScreen(s);
    window.scrollTo({ top: 0 });
  };

  const claimable =
    dailyQuests(today).filter((q) => isDone(q.progress(state, today)) && !state.claimedDaily.includes(dailyKey(today, q.id))).length +
    (() => { const m = activeMainQuest(state); return m && isDone(m.progress(state, today)) ? 1 : 0; })();
  const main = activeMainQuest(state);

  return (
    <div className="app">
      <header className="top">
        <button className="logo" onClick={() => go('home')} aria-label="Accueil Guitar Leveling">
          <span className="logo-note">♫</span> Guitar <em>Leveling</em>
        </button>
        <div className="top-right">
          <span className="chip" title="Cristaux"><Crystal /> {fmt(state.crystals)}</span>
          <span className="chip" title="Niveau">Niv. {levelFromXp(state.xp)}</span>
          <button className="btn btn-outline" onClick={() => setThemeOpen(true)}>✺ Thèmes</button>
        </div>
      </header>

      {main && screen === 'home' && (
        <div className="quest-banner" role="note"><span className="bang">!</span><span>Quête : <b>{main.title}</b>. {main.id === 'm_restart' ? 'Refuser n’est pas une option.' : main.description}</span></div>
      )}
      {!saveOk && <div className="quest-banner warn" role="alert">Sauvegarde indisponible dans ce navigateur (navigation privée ?). Exporte ta progression depuis l’écran Héros.</div>}

      <nav className="nav" aria-label="Navigation principale">
        {NAV.map((n) => (
          <button key={n.id} className={`nav-btn ${screen === n.id ? 'sel' : ''}`} aria-current={screen === n.id ? 'page' : undefined} onClick={() => go(n.id)}>
            <span className="nav-ico" aria-hidden="true">{n.icon}</span>
            <span className="nav-label">{n.label}</span>
            <span className="nav-short" aria-hidden="true">{n.short}</span>
            {n.id === 'quests' && claimable > 0 && <span className="badge">{claimable}</span>}
          </button>
        ))}
      </nav>

      <main className="main">
        {screen === 'home' && <Home go={go} />}
        {screen === 'quests' && <Quests />}
        {screen === 'training' && <Training key={songId ?? 'free'} songId={songId} clearSong={() => setSongId(null)} />}
        {screen === 'repertoire' && <Repertoire practice={(id) => { setSongId(id); go('training'); }} />}
        {screen === 'hero' && <Hero />}
        {screen === 'journal' && <Journal />}
        {screen === 'grimoire' && <Grimoire />}
      </main>

      <footer className="foot muted small">Guitar Leveling · v0.1 · Illustrations : concepts de référence, sprites en production.</footer>

      {themeOpen && (
        <div className="modal-back" onClick={() => setThemeOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Choisir un thème" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head"><h2>Choisis ton univers</h2><button className="btn btn-ghost" onClick={() => setThemeOpen(false)} aria-label="Fermer">✕</button></div>
            <div className="theme-grid">
              {THEMES.map((t) => (
                <button key={t.id} className={`theme-card ${state.appearance.themeId === t.id ? 'sel' : ''}`} aria-pressed={state.appearance.themeId === t.id}
                  onClick={() => { update((s) => setTheme(s, t.id)); }}>
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

      {!state.onboarded && <Onboarding />}

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={`toast toast-${t.tone}`}>{t.text}</div>)}
      </div>
    </div>
  );
}

function Onboarding() {
  const { state, update } = useGame();
  const [name, setNameInput] = useState('');
  const [avatar, setAv] = useState(state.appearance.avatarId);
  return (
    <div className="modal-back">
      <form className="modal onboarding" role="dialog" aria-modal="true" aria-label="Créer ton héros"
        onSubmit={(e) => { e.preventDefault(); update((s) => ({ ...setName(setAvatar(s, avatar), name || 'Héros'), onboarded: true })); }}>
        <h2>Bienvenue à l’Académie</h2>
        <p>Choisis ton héros. Chaque minute de guitare réellement jouée le fera progresser.</p>
        <div role="radiogroup" aria-label="Avatar" className="avatar-pick big">
          {(['boy', 'girl'] as const).map((a) => (
            <button type="button" key={a} role="radio" aria-checked={avatar === a} className={`avatar-opt ${avatar === a ? 'sel' : ''}`} onClick={() => setAv(a)}>
              <img src={`./concept/${a}-portrait.png`} alt={a === 'boy' ? 'Garçon brun' : 'Fille aux cheveux corail'} />
              <span>{a === 'boy' ? 'Le Guitariste' : 'La Guitariste'}</span>
            </button>
          ))}
        </div>
        <label>Ton nom de héros<input autoFocus maxLength={24} value={name} onChange={(e) => setNameInput(e.target.value)} placeholder="Héros" /></label>
        <button className="btn btn-primary btn-big" type="submit">Commencer l’aventure ♪</button>
        <p className="muted small">Ta progression est enregistrée dans ce navigateur.</p>
      </form>
    </div>
  );
}
