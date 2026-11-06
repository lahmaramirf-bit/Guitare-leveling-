import { useState } from 'react';
import { useGame } from '../ui/store';
import { Bar, Crystal, Panel, Shard, fmt } from '../ui/bits';
import { CharacterPortrait } from '../appearance/CharacterPortrait';
import { levelProgress, rankForLevel, nextRank, titleForLevel, xpToReachLevel } from '../game/levels';
import { bestStreak, currentStreak, minutesOn, totalMinutes } from '../game/sessions';
import { openChest } from '../game/state';
import { mulberry32, randomSeed } from '../game/rng';
import { activeMainQuest, dailyKey, dailyQuests, isDone } from '../game/quests';
import { themeConceptImage } from '../appearance/themes';
import type { Screen } from '../App';

export function Home({ go }: { go: (s: Screen) => void }) {
  const { state, today, update, toast } = useGame();
  const [showStats, setShowStats] = useState(false);
  const lp = levelProgress(state.xp);
  const rank = rankForLevel(lp.level);
  const nr = nextRank(lp.level);
  const streak = currentStreak(state, today);
  const chestAvailable = state.chestLastDay !== today;
  const main = activeMainQuest(state);
  const daily = dailyQuests(today);

  const onChest = () => {
    const r = openChest(state, today, mulberry32(randomSeed()));
    if (r.reward > 0) {
      update(() => r.state);
      toast(`Coffre du jour : +${r.reward} cristaux`, 'gold');
    }
  };

  return (
    <div className="stack">
      <Panel className="hero-card">
        <div className="hero-scene" style={{ backgroundImage: `url(${themeConceptImage(state.appearance.themeId)})` }}>
          <div className="hero-level">
            <span className="lv-label">Niv.</span> <span className="lv-num">{lp.level}</span>
            <div className="lv-title">{titleForLevel(lp.level)}</div>
          </div>
          <CharacterPortrait avatarId={state.appearance.avatarId} size="lg" />
          <div className={`rank-gem rank-${rank.rank}`} title={`Rang ${rank.rank} — ${rank.label}`}><span>{rank.rank}</span></div>
        </div>
        <div className="hero-body">
          <div className="hero-name-row">
            <h1 className="hero-name">{state.profile.name}</h1>
            <span className="tag">{rank.label}</span>
            <span className="spacer" />
            <span className={`streak ${streak > 0 ? 'on' : ''}`} title="Jours consécutifs avec au moins une séance">🔥 {streak} jour{streak > 1 ? 's' : ''}</span>
            <button className="btn btn-gold" onClick={() => go('hero')}>Personnaliser</button>
          </div>
          <Bar label="XP du niveau" value={lp.current} max={lp.needed} />
          {nr && <Bar label={`Vers le rang ${nr.rank} · niveau ${nr.minLevel}`} value={state.xp} max={xpToReachLevel(nr.minLevel)} />}
          <div className="hero-foot">
            <div className="chip"><Crystal /> <b>{fmt(state.crystals)}</b> cristaux</div>
            <div className="chip"><Shard /> <b>{fmt(state.shards)}</b> éclats</div>
            <span className="spacer" />
            <button className="btn btn-chest" disabled={!chestAvailable} onClick={onChest}>
              {chestAvailable ? '🎁 Coffre du jour' : 'Coffre ouvert — reviens demain'}
            </button>
          </div>
          <button className="link-btn" aria-expanded={showStats} onClick={() => setShowStats((v) => !v)}>Statistiques {showStats ? '▾' : '▸'}</button>
          {showStats && (
            <dl className="stats">
              <div><dt>Séances</dt><dd>{state.sessions.length}</dd></div>
              <div><dt>Temps total</dt><dd>{Math.floor(totalMinutes(state) / 60)} h {totalMinutes(state) % 60} min</dd></div>
              <div><dt>Aujourd’hui</dt><dd>{minutesOn(state, today)} min</dd></div>
              <div><dt>Meilleure série</dt><dd>{bestStreak(state)} j</dd></div>
              <div><dt>XP total</dt><dd>{fmt(state.xp)}</dd></div>
              <div><dt>Morceaux maîtrisés</dt><dd>{state.songs.filter((s) => s.status === 'maitrise').length}</dd></div>
            </dl>
          )}
        </div>
      </Panel>

      <div className="grid-2">
        <Panel title="Quête principale">
          {main ? (
            <div className="quest-mini">
              <h3>{main.title}</h3>
              <p>{main.description}</p>
              <Bar label="Progression" value={Math.min(main.progress(state, today).current, main.progress(state, today).target)} max={main.progress(state, today).target} />
              <button className="btn" onClick={() => go('quests')}>{isDone(main.progress(state, today)) ? 'Réclamer la récompense' : 'Voir les quêtes'}</button>
            </div>
          ) : <p>Toutes les quêtes principales sont accomplies. Bravo !</p>}
        </Panel>
        <Panel title="Aujourd’hui">
          <ul className="daily-mini">
            {daily.map((q) => {
              const p = q.progress(state, today);
              const claimed = state.claimedDaily.includes(dailyKey(today, q.id));
              return (
                <li key={q.id} className={claimed ? 'claimed' : isDone(p) ? 'done' : ''}>
                  <span>{claimed ? '✓' : isDone(p) ? '★' : '○'} {q.title}</span>
                  <span className="mono">{Math.min(p.current, p.target)}/{p.target}</span>
                </li>
              );
            })}
          </ul>
          <button className="btn btn-primary btn-wide" onClick={() => go('training')}>Commencer une séance ♪</button>
        </Panel>
      </div>
    </div>
  );
}
