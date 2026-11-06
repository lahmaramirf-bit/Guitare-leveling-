/** Quêtes du jour, portail, défis hebdo, Limit Break — logique du projet de base. */
import { DAILY, LB_POOL, PLAN, PORTALS, QUESTS, RANKS, RANK_INDEX, WEEKLY, TIPS, type Rank, type RankId, type StatId, type Portal, type QuestId } from '../content';
import type { Save } from './model';
import { hashStr } from './rng';
import { mondayOf, dayStart } from './dates';
import { shadows, songById, isMastered, qualifies } from './engine';
import { addDays } from './dates';

export function nextItem(s: Save, r: Rank, kind: 'theo' | 'etude' | 'morceau') {
  const arr = r[kind] as unknown[];
  for (let i = 0; i < arr.length; i++) if (!s.items[`${r.id}-${kind}-${i}`]) return arr[i] as string[];
  return null;
}

export function currentSong(s: Save) {
  let best = null, bt = -1;
  for (const id in s.rep) {
    const e = s.rep[id];
    if (e?.s === 'c') { const song = songById(s, id); if (song && !isMastered(s, song) && (e.t ?? 0) > bt) { best = song; bt = e.t ?? 0; } }
  }
  return best;
}

/** Consignes adaptées au rang, au morceau en cours et aux révisions. */
export function questDescs(s: Save, r: Rank, today: string): Record<QuestId, string> {
  const t = DAILY[r.id];
  const th = nextItem(s, r, 'theo'), et = nextItem(s, r, 'etude'), mo = nextItem(s, r, 'morceau');
  const learned = shadows(s, today).map((x) => x.n);
  const dayN = Math.floor(dayStart(today) / 86400000);
  const revision = learned.length && dayN % 3 === 0;
  let morceau = mo ? `${mo[0]}. Lent, mains séparées si besoin.` : s.items[`${r.id}-boss-0`] ? 'Rejoue tout ton répertoire du rang.' : `Prépare le boss : ${r.boss[0]}.`;
  if (revision) morceau = `Jour de révision : rejoue ${learned[dayN % learned.length]} du début à la fin, puis 5 min sur ton morceau en cours.`;
  const cur = currentSong(s);
  if (cur) {
    const e = s.rep[cur.id] ?? {};
    const nx = PLAN.findIndex((_, i) => !(e.st ?? []).includes(i));
    morceau = `Ton morceau en cours : ${cur.t}. ` + (nx >= 0 ? `Prochaine étape : ${PLAN[nx].charAt(0).toLowerCase() + PLAN[nx].slice(1)}.` : 'Toutes les étapes sont faites : joue-le en entier.') + (revision ? ` Puis révise ${learned[dayN % learned.length]}.` : '');
  }
  return {
    echauf: t.echauf, arp: t.arp, gamme: t.gamme, lect: t.lect,
    theo: th ? `Fiche du rang ${r.id} : ${th[0]}. ${th[1]}` : 'Relis une fiche du grimoire ou d’un rang précédent et applique-la sur le manche.',
    etude: et ? `${et[0]}. ${et[1]}` : 'Reprends ta plus belle étude du rang et vise un tempo plus rapide.',
    morceau,
  };
}

export const totalQuestMinutes = QUESTS.reduce((a, q) => a + q.min, 0);

/** Portail du jour : défi tiré parmi ceux de ton rang ou en dessous. */
export function todayPortal(s: Save, r: Rank, today: string): Portal {
  const cap = Math.min(RANK_INDEX(r.id), RANK_INDEX('S'));
  const pool = PORTALS.filter((p) => RANK_INDEX(p.r) <= cap);
  const pk = s.days[today]?.pk ?? 0;
  return pool[hashStr('portal' + today + (pk ? '#' + pk : '')) % pool.length];
}

/** Trois défis hebdomadaires, renouvelés chaque lundi. */
export function weeklyChallenges(today: string) {
  const wk = mondayOf(today);
  const wIdx = Math.floor(dayStart(wk) / 604800000);
  return { wk, list: [0, 1, 2].map((k) => { const i = (wIdx * 5 + k * 7) % WEEKLY.length; return { id: 'w' + i, t: WEEKLY[i][0], d: WEEKLY[i][1] }; }) };
}

/** Pénalité : quêtes d'hier non validées. */
export function penalty(s: Save, today: string) {
  const done = s.days[today]?.q.length ?? 0;
  const hasPast = Object.keys(s.days).some((k) => k < today && (s.days[k].q ?? []).length);
  const y = addDays(today, -1);
  const missed = hasPast && !qualifies(s, y);
  const canSave = missed && s.shop.inv.c_scroll > 0 && qualifies(s, addDays(today, -2));
  return { show: missed && (done < 5 || canSave), reset: done < 5, canSave, yesterday: y };
}

export const lbRk = (id: RankId): RankId => (id === 'N' ? 'S' : id);
export function lbPool(r: Rank): [[string, string, StatId], RankId][] {
  const i = RANK_INDEX(r.id);
  const out = (LB_POOL[lbRk(r.id)] ?? LB_POOL.S).map((x) => [x, lbRk(r.id)] as [[string, string, StatId], RankId]);
  const nx = RANKS[i + 1];
  if (nx && lbRk(nx.id) !== lbRk(r.id)) (LB_POOL[lbRk(nx.id)] ?? []).forEach((x) => out.push([x, lbRk(nx.id)]));
  return out;
}
/** Défi de Limit Break du jour (plus dur que ton rang). */
export function lbToday(s: Save, r: Rank, today: string) {
  const pool = lbPool(r);
  return pool[hashStr('lb' + today + '#' + (s.days[today]?.lbr ?? 0)) % pool.length];
}

export function tipOfDay(today: string, offset = 0) {
  return TIPS[(hashStr('tip' + today) + offset) % TIPS.length];
}
