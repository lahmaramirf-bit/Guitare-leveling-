import { useState } from 'react';
import { useGame } from '../ui/store';
import { CheckItem, Panel } from '../ui/bits';
import { QUESTS, TCAT, XP, PORTAL_XP, LB_XP } from '../content';
import { effRank } from '../game/engine';
import { lbToday, penalty, questDescs, tipOfDay, todayPortal, totalQuestMinutes, weeklyChallenges } from '../game/daily';
import * as A from '../game/actions';
import { HeroCard } from './HeroCard';

export function Quests({ goHero }: { goHero: () => void }) {
  const { save, today, p, act } = useGame();
  const [tipOff, setTipOff] = useState(0);
  const r = effRank(save, p.c.xp);
  const d = save.days[today] ?? { q: [] };
  const desc = questDescs(save, r, today);
  const pen = penalty(save, today);
  const [cat, tip] = tipOfDay(today, tipOff);
  const portal = todayPortal(save, r, today);
  const week = weeklyChallenges(today);
  const wd = save.weeks[week.wk] ?? [];
  const N = QUESTS.length;

  return (
    <div className="stack">
      <HeroCard onCustomize={goHero} />

      <Panel className="tip" title="Conseil du Système" aside={<button className="link-btn" onClick={() => setTipOff((x) => x + 1)}>Autre conseil</button>}>
        <p><span className="tag">{TCAT[cat]?.[0] ?? cat}</span> {tip}</p>
      </Panel>

      <Panel title="Quête quotidienne" aside={<span className="muted small">Objectif : <b data-testid="qcount">{d.q.length} / {N}</b> · ≈ {totalQuestMinutes} min · rang {r.id}</span>}>
        {pen.show && (
          <div className="penalty" role="alert">
            <span>{pen.reset ? '[ Zone de pénalité ] Quête d’hier non accomplie, série remise à zéro. Le Système attend ta reprise.' : '[ Série ] La journée d’hier n’a pas été validée.'}</span>
            {pen.canSave && <button className="btn btn-gold" onClick={() => act((s) => A.useScroll(s, today), 'Série sauvée.')}>Sauver la série · parchemin ×{save.shop.inv.c_scroll}</button>}
          </div>
        )}
        <div className="list">
          {QUESTS.map((q) => (
            <CheckItem key={q.id} testId={`q-${q.id}`} on={d.q.includes(q.id)} title={`${q.name} · ${q.min} min`} desc={desc[q.id]} xp={q.xp}
              meta={<span className="chip small">{q.stat}</span>}
              onToggle={() => act((s) => A.toggleQuest(s, q.id, today), d.q.includes(q.id) ? undefined : `${q.name} validée.`)} />
          ))}
        </div>
        <p className="muted small">Tout fait : +{XP.bonus} XP bonus · 5 quêtes sur 7 suffisent pour garder la série.</p>
      </Panel>

      <LimitBreak />

      <Panel title="Portail du jour" className={d.urg ? 'portal closed' : 'portal'}>
        <div className="portal-row">
          <div className={`rank-gem small rank-${portal.r}`}><span>{portal.r}</span></div>
          <div>
            <span className="sys-tag">{d.urg ? 'Portail fermé' : `Un portail de rang ${portal.r} est apparu`}</span>
            <h3>{portal.t}</h3>
            <p>{portal.d}</p>
          </div>
        </div>
        <div className="row">
          <span className="xp">+{PORTAL_XP[portal.r]} XP · +10 cristaux</span>
          <span className="spacer" />
          {!d.urg && save.shop.inv.c_key > 0 && <button className="btn" onClick={() => act((s) => A.useKey(s, today))}>Autre portail · clé ×{save.shop.inv.c_key}</button>}
          <button className={`btn ${d.urg ? '' : 'btn-primary'}`} aria-pressed={!!d.urg} onClick={() => act((s) => A.togglePortal(s, portal.r, today), d.urg ? undefined : `Portail de rang ${portal.r} fermé.`)}>{d.urg ? 'Rouvrir' : 'Portail fermé'}</button>
        </div>
      </Panel>

      <Panel title="Défis de la semaine" aside={<span className="muted small">Semaine du {new Date(week.wk + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} · réinitialisation le lundi</span>}>
        <div className="list">
          {week.list.map((w) => (
            <CheckItem key={w.id} on={wd.includes(w.id)} title={w.t} desc={w.d} xp={XP.week}
              onToggle={() => act((s) => A.toggleWeekly(s, w.id, today), wd.includes(w.id) ? undefined : 'Défi hebdo relevé.')} />
          ))}
        </div>
        <p className="muted small">Les consignes s’adaptent à ton rang. Le morceau du jour alterne avec la révision d’un morceau déjà appris, et le portail change chaque jour.</p>
      </Panel>
    </div>
  );
}

function LimitBreak() {
  const { save, today, p, act } = useGame();
  const d = save.days[today] ?? { q: [] };
  const N = QUESTS.length;
  const q = d.q.length;
  const r = effRank(save, p.c.xp);
  const gauge = (
    <div className={`lb-gauge ${q >= N ? 'full' : ''}`} role="progressbar" aria-label="Jauge de Limit Break" aria-valuemin={0} aria-valuemax={N} aria-valuenow={Math.min(q, N)}>
      {Array.from({ length: N }, (_, i) => <i key={i} className={i < q ? 'on' : ''} />)}
    </div>
  );
  let body;
  if (d.lb) {
    body = <div className="lb-done"><b>Limite brisée aujourd’hui</b> — {d.lbt ?? 'Défi relevé'} · +{LB_XP[d.lb]} XP<p className="muted small">{p.c.lbN} Limit Break au total. Reviens demain : le Système montera encore la barre.</p></div>;
  } else if (q < N) {
    body = <>{gauge}<p className="small">Termine les {N} quêtes du jour pour briser tes limites : un défi plus dur que ton rang, <b>+{LB_XP[r.id === 'N' ? 'S' : r.id]} XP</b> ou plus et 20 cristaux.</p></>;
  } else if (!d.lbo) {
    body = <>{gauge}<button className="btn btn-primary btn-big" onClick={() => act((s) => A.lbOpen(s, today))}>Briser la limite</button></>;
  } else {
    const [ch, rk] = lbToday(save, r, today);
    body = (
      <div className="lb-ch">
        <div className="row"><span className="chip small">{ch[2]}</span><span className="chip small">Défi de rang {rk}</span></div>
        <h3>{ch[0]}</h3>
        <p>{ch[1]}</p>
        <div className="row">
          <button className="btn btn-gold btn-big" onClick={() => act((s) => A.lbDone(s, today, rk, ch[0]), `Limit Break : ${ch[0]}.`)}>Défi relevé !</button>
          {!d.lbr && <button className="btn" onClick={() => act((s) => A.lbReroll(s, today))}>Autre défi</button>}
          <span className="xp">+{LB_XP[rk]} XP · 20 cristaux</span>
        </div>
      </div>
    );
  }
  return <Panel title="Limit Break" className={`lb ${q >= N && !d.lb ? 'ready' : ''}`}>{body}</Panel>;
}
