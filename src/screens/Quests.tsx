import { useGame } from '../ui/store';
import { Bar, Crystal, Panel } from '../ui/bits';
import { MAIN_QUESTS, dailyKey, dailyQuests, isDone, type Quest } from '../game/quests';
import { claimDaily, claimMain } from '../game/state';

function QuestCard({ q, claimed, onClaim, progress }: { q: Quest; claimed: boolean; onClaim: () => void; progress: { current: number; target: number } }) {
  const done = isDone(progress);
  return (
    <li className={`quest ${claimed ? 'claimed' : done ? 'done' : ''}`}>
      <div className="quest-text">
        <h3>{q.title}</h3>
        <p>{q.description}</p>
        <Bar label="Progression" value={Math.min(progress.current, progress.target)} max={progress.target} />
      </div>
      <div className="quest-reward">
        {q.rewardXp > 0 && <span>+{q.rewardXp} XP</span>}
        <span><Crystal /> {q.rewardCrystals}</span>
        <button className="btn btn-gold" disabled={!done || claimed} onClick={onClaim}>{claimed ? 'Réclamée' : done ? 'Réclamer' : 'En cours'}</button>
      </div>
    </li>
  );
}

export function Quests() {
  const { state, today, update, toast } = useGame();
  const daily = dailyQuests(today);
  return (
    <div className="stack">
      <Panel title="Quêtes du jour" aside={<span className="muted small">Renouvelées chaque jour · progression calculée sur tes séances</span>}>
        <ul className="quest-list">
          {daily.map((q) => (
            <QuestCard key={q.id} q={q} progress={q.progress(state, today)} claimed={state.claimedDaily.includes(dailyKey(today, q.id))}
              onClaim={() => { update((s) => claimDaily(s, q.id, today)); toast(`Quête « ${q.title} » accomplie !`, 'gold'); }} />
          ))}
        </ul>
      </Panel>
      <Panel title="Fil principal">
        <ul className="quest-list">
          {MAIN_QUESTS.map((q) => (
            <QuestCard key={q.id} q={q} progress={q.progress(state, today)} claimed={state.claimedMain.includes(q.id)}
              onClaim={() => { update((s) => claimMain(s, q.id, today)); toast(`Quête « ${q.title} » accomplie !`, 'gold'); }} />
          ))}
        </ul>
      </Panel>
    </div>
  );
}
