import { useState } from 'react';
import { useGame } from '../ui/store';
import { CheckItem, Panel } from '../ui/bits';
import { PIECES, RANKS, RANK_INDEX, XPK, type RankId } from '../content';
import { effRank, levelOf } from '../game/engine';
import * as A from '../game/actions';

const CATLAB: Record<string, string> = { classique: 'Classique', anime: 'Anime', jeu: 'Jeu vidéo', trad: 'Trad', libre: 'Libre', japon: 'Japon', etude: 'Étude' };

export function Dungeons() {
  const { save, today, p, act } = useGame();
  const eff = effRank(save, p.c.xp);
  const [sel, setSel] = useState<RankId>(eff.id);
  const r = RANKS.find((x) => x.id === sel)!;
  const effI = RANK_INDEX(eff.id);
  const rankDone = (id: RankId) => !!save.items[`${id}-boss-0`];
  const lbOpen = rankDone(eff.id) && RANKS[effI + 1];
  const count = (k: 'obj' | 'theo' | 'etude' | 'morceau') => `${(r[k] as unknown[]).filter((_, i) => save.items[`${r.id}-${k}-${i}`]).length} / ${(r[k] as unknown[]).length}`;
  const item = (id: string, title: string, desc: string, xp: number, meta?: React.ReactNode, boss?: boolean) => (
    <CheckItem key={id} testId={id} on={!!save.items[id]} title={title} desc={desc} xp={xp} meta={meta} boss={boss}
      onToggle={() => act((s) => A.toggleItem(s, id, today), save.items[id] ? undefined : boss ? `Boss vaincu : ${title}.` : `${title} validé.`)} />
  );

  return (
    <div className="stack">
      <div className="rank-picker" role="tablist" aria-label="Rangs">
        {RANKS.map((x, i) => (
          <button key={x.id} role="tab" aria-selected={x.id === sel} className={`rank-pick ${x.id === sel ? 'sel' : ''} ${i > effI ? 'locked' : ''} ${rankDone(x.id) ? 'done' : ''} ${lbOpen && i === effI + 1 ? 'lbopen' : ''}`} onClick={() => setSel(x.id)}>
            <span className="L">{x.id === 'N' ? 'S+' : x.id}</span><span className="s">Niv. {x.lv}</span>
          </button>
        ))}
      </div>
      <Panel className="dungeon">
        <span className="eyebrow">Donjon de rang {r.id} · {r.period} · dès le niveau {r.lv}</span>
        <h2 className="dungeon-title">{r.name}</h2>
        <p>{r.intro}</p>
        {RANK_INDEX(r.id) === effI + 1 && rankDone(eff.id) && levelOf(p.c.xp) < r.lv && <p className="notice"><b>Limit Break</b> — tu as vaincu le boss du rang {eff.id} avant le niveau {r.lv}. Ce donjon s’ouvre en avance : chaque validation compte déjà.</p>}
        {RANK_INDEX(r.id) > effI && !(RANK_INDEX(r.id) === effI + 1 && rankDone(eff.id)) && <p className="notice">Rang conseillé non atteint. Tu peux quand même valider.</p>}

        <h3 className="sub">Objectifs du rang <span>{count('obj')}</span></h3>
        <div className="list">{r.obj.map((o, i) => item(`${r.id}-obj-${i}`, o[0], o[1], XPK.obj))}</div>
        <h3 className="sub">Théorie <span>{count('theo')}</span></h3>
        <div className="list">{r.theo.map((o, i) => item(`${r.id}-theo-${i}`, o[0], o[1], XPK.theo))}</div>
        <h3 className="sub">Études <span>{count('etude')}</span></h3>
        <div className="list">{r.etude.map((o, i) => item(`${r.id}-etude-${i}`, o[0], o[1], XPK.etude))}</div>
        <h3 className="sub">Morceaux <span>{count('morceau')}</span></h3>
        <div className="list">{r.morceau.map((o, i) => item(`${r.id}-morceau-${i}`, o[0], o[2], XPK.morceau, <span className="chip small">{CATLAB[o[1]] ?? o[1]}</span>))}</div>
        {PIECES.some((x) => x.r === r.id) && (
          <>
            <h3 className="sub">Partitions du rang <span>apprises = +{XPK.P} XP</span></h3>
            <div className="list">{PIECES.filter((x) => x.r === r.id).map((x) => item(`P-${x.id}`, x.t, `${x.by} · partition jouable : lecteur intégré prévu au lot 4.`, XPK.P))}</div>
          </>
        )}
        <div className="list boss-list">{item(`${r.id}-boss-0`, r.boss[0], r.boss[1], XPK.boss, undefined, true)}</div>
      </Panel>
      <p className="muted small">Les rangs suivent ton niveau : D au niveau 17, C au 32, B au 45, A au 64, S au 78 et le rang final au niveau 100. Les durées sont des repères pour 35 à 45 minutes par jour. Partitions classiques gratuites : thisisclassicalguitar.com et IMSLP.</p>
    </div>
  );
}
