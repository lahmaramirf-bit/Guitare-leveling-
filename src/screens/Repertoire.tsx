import { useMemo, useState } from 'react';
import { useGame, uid } from '../ui/store';
import { CheckItem, Panel, Tabs, fmt } from '../ui/bits';
import { COLLS, DIFF, GENRES, GORDER, LB_SONG, LB_SONG_XP, PLAN, REP_XP, STEP_XP, type Song } from '../content';
import { allSongs, effRank, isMastered, masteryState, songById } from '../game/engine';
import * as A from '../game/actions';
import type { Save, SongState } from '../game/model';
import { ITEM } from '../game/catalog';

const ST_LAB: Record<string, string> = { m: 'Maîtrisé', c: 'En cours', w: 'À apprendre', '': '' };
const MAX_DIFF: Record<string, number> = { E: 2, D: 2, C: 3, B: 4, A: 4, S: 5, N: 5 };
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function songStatus(s: Save, song: Song): SongState {
  if (isMastered(s, song)) return 'm';
  return s.rep[song.id]?.s ?? '';
}

export function Repertoire() {
  const { save } = useGame();
  const [tab, setTab] = useState<'list' | 'coll'>('list');
  const [open, setOpen] = useState<string | null>(null);
  const [col, setCol] = useState<string | null>(null);
  return (
    <div className="stack">
      <Tabs label="Répertoire" value={tab} onChange={setTab} items={[['list', 'Morceaux'], ['coll', 'Collections']]} />
      {tab === 'list' ? <SongList onOpen={setOpen} col={col} clearCol={() => setCol(null)} /> : <Collections onPick={(c) => { setCol(c); setTab('list'); }} />}
      {open && songById(save, open) && <SongSheet id={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function SongList({ onOpen, col, clearCol }: { onOpen: (id: string) => void; col: string | null; clearCol: () => void }) {
  const { save, p, act } = useGame();
  const [g, setG] = useState('all');
  const [d, setD] = useState(0);
  const [st, setSt] = useState('all');
  const [q, setQ] = useState('');
  const [mine, setMine] = useState(false);
  const [sort, setSort] = useState('diff');
  const [form, setForm] = useState(false);
  const mx = mine ? MAX_DIFF[effRank(save, p.c.xp).id] : 9;
  const list = useMemo(() => {
    const nq = norm(q);
    const arr = allSongs(save).filter((s) => (g === 'all' || s.g === g) && (!d || s.d === d) && (!col || s.col === col) && s.d <= mx
      && (st === 'all' || songStatus(save, s) === st) && (!nq || norm(`${s.t} ${s.src} ${s.by}`).includes(nq)));
    const so: Record<string, (a: Song, b: Song) => number> = {
      diff: (a, b) => a.d - b.d || a.t.localeCompare(b.t), hard: (a, b) => b.d - a.d || a.t.localeCompare(b.t),
      genre: (a, b) => GORDER.indexOf(a.g) - GORDER.indexOf(b.g) || a.d - b.d, az: (a, b) => a.t.localeCompare(b.t),
      status: (a, b) => 'cwm'.indexOf(songStatus(save, a) || 'z') - 'cwm'.indexOf(songStatus(save, b) || 'z'),
    };
    return arr.sort(so[sort]);
  }, [save, g, d, st, q, mx, sort, col]);

  return (
    <>
      <Panel title="Répertoire" aside={<span className="muted small">{list.length} morceaux · {masteryState(save).total} maîtrisés</span>}>
        <div className="filters">
          <input type="search" placeholder="Rechercher un titre, une œuvre, un compositeur…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Rechercher" />
          <select value={g} onChange={(e) => setG(e.target.value)} aria-label="Genre"><option value="all">Tous les genres</option>{GORDER.map((k) => <option key={k} value={k}>{GENRES[k].n}</option>)}</select>
          <select value={d} onChange={(e) => setD(Number(e.target.value))} aria-label="Niveau"><option value={0}>Tous niveaux</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} · {DIFF[n]?.[0]}</option>)}</select>
          <select value={st} onChange={(e) => setSt(e.target.value)} aria-label="Statut"><option value="all">Tous statuts</option><option value="c">En cours</option><option value="w">À apprendre</option><option value="m">Maîtrisés</option></select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Trier"><option value="diff">Du plus facile au plus dur</option><option value="hard">Du plus dur au plus facile</option><option value="genre">Par genre</option><option value="status">Par statut</option><option value="az">De A à Z</option></select>
          <label className="inline"><input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} /> Adapté à mon rang</label>
        </div>
        {col && <p className="notice">Collection : <b>{COLLS[col].n}</b> <button className="link-btn" onClick={clearCol}>✕ retirer le filtre</button></p>}
        <ul className="song-list">
          {list.slice(0, 120).map((s) => {
            const status = songStatus(save, s);
            const steps = save.rep[s.id]?.st?.length ?? 0;
            return (
              <li key={s.id}>
                <button className={`song-row status-${status || 'none'}`} onClick={() => onOpen(s.id)}>
                  <span className="pips" title={`Niveau ${s.d} · ${DIFF[s.d]?.[0]}`}>{'●'.repeat(s.d)}{'○'.repeat(5 - s.d)}</span>
                  <span className="song-main"><b>{s.t}</b><span className="small muted">{s.src}{s.by ? ` · ${s.by}` : ''}</span></span>
                  <span className="chip small">{GENRES[s.g]?.n ?? s.g}</span>
                  {status && <span className={`chip small st-${status}`}>{ST_LAB[status]}{status === 'c' && steps ? ` · ${steps}/${PLAN.length}` : ''}</span>}
                </button>
              </li>
            );
          })}
        </ul>
        {list.length > 120 && <p className="muted small">Affine la recherche pour voir les {list.length - 120} autres.</p>}
        <button className="btn" onClick={() => setForm((v) => !v)}>+ Ajouter un morceau perso</button>
        {form && <CustomSongForm onDone={(id) => { setForm(false); if (id) onOpen(id); }} act={act} />}
      </Panel>
      <p className="muted small">Pour les œuvres protégées (animés, pop, films), la partition n’est pas recopiée ici : chaque fiche donne des conseils de lecture et de jeu, un plan d’apprentissage et des liens pour trouver un arrangement à ton niveau.</p>
    </>
  );
}

function CustomSongForm({ onDone, act }: { onDone: (id: string | null) => void; act: ReturnType<typeof useGame>['act'] }) {
  const [t, setT] = useState(''); const [by, setBy] = useState(''); const [g, setG] = useState('chanson'); const [d, setD] = useState(2);
  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); const id = 'c' + uid(); if (act((s) => A.addCustomSong(s, { t, by, g, d }, id))) onDone(id); }}>
      <label>Titre<input required maxLength={80} value={t} onChange={(e) => setT(e.target.value)} /></label>
      <label>Artiste / compositeur<input maxLength={80} value={by} onChange={(e) => setBy(e.target.value)} /></label>
      <label>Genre<select value={g} onChange={(e) => setG(e.target.value)}>{GORDER.map((k) => <option key={k} value={k}>{GENRES[k].n}</option>)}</select></label>
      <label>Niveau<select value={d} onChange={(e) => setD(Number(e.target.value))}>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} · {DIFF[n]?.[0]}</option>)}</select></label>
      <button className="btn btn-gold" type="submit">Ajouter</button>
    </form>
  );
}

function SongSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const { save, today, act } = useGame();
  const s = songById(save, id)!;
  const e = save.rep[id] ?? {};
  const status = songStatus(save, s);
  const G = GENRES[s.g];
  const [bpm, setBpm] = useState(e.bpm ? String(e.bpm) : '');
  const q = encodeURIComponent(`${s.t} ${s.by ?? ''} guitare classique`);
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal sheet" role="dialog" aria-modal="true" aria-label={s.t} onClick={(ev) => ev.stopPropagation()}>
        <div className="modal-head"><div><span className="eyebrow">{G?.n} · niveau {s.d} · {DIFF[s.d]?.[0]}</span><h2>{s.t}</h2><p className="muted small">{s.src}{s.by ? ` · ${s.by}` : ''}</p></div><button className="btn btn-ghost" onClick={onClose} aria-label="Fermer">✕</button></div>
        <div className="row">
          {(['w', 'c', 'm'] as SongState[]).map((v) => (
            <button key={v} className={`btn ${status === v ? 'btn-primary' : ''}`} aria-pressed={status === v}
              onClick={() => act((x) => A.setSongStatus(x, id, v, today), v === 'm' && status !== 'm' ? `Morceau maîtrisé : ${s.t}.` : undefined)}>{ST_LAB[v]}</button>
          ))}
          <span className="xp">Maîtrisé : +{REP_XP[s.d]} XP</span>
        </div>
        {s.tech.length > 0 && <p>{s.tech.map((t) => <span key={t} className="chip small">{t}</span>)}</p>}
        {s.tips.length > 0 && <ul className="tips">{s.tips.map((t, i) => <li key={i}><b>{t.k === 'L' ? 'Lire' : 'Jouer'} :</b> {t.t}</li>)}</ul>}
        {G && <ul className="tips muted small"><li><b>Lire ({G.n}) :</b> {G.L}</li><li><b>Jouer :</b> {G.J}</li></ul>}
        <h3 className="sub">Plan d’apprentissage <span>+{STEP_XP} XP par étape</span></h3>
        <div className="list">
          {PLAN.map((step, i) => <CheckItem key={i} on={(e.st ?? []).includes(i)} title={`${i + 1}. ${step}`} onToggle={() => act((x) => A.toggleStep(x, id, i), (e.st ?? []).includes(i) ? undefined : 'Étape validée.')} />)}
        </div>
        <form className="row" onSubmit={(ev) => { ev.preventDefault(); act((x) => A.setSongBpm(x, id, bpm ? Number(bpm) : null)); }}>
          <label className="inline">Mon tempo propre ♩ = <input type="number" min={20} max={300} value={bpm} onChange={(ev) => setBpm(ev.target.value)} style={{ width: 90 }} /></label>
          <button className="btn" type="submit">Noter</button>
        </form>
        {status === 'm' && (
          <>
            <h3 className="sub">Limit Break du morceau <span>+{LB_SONG_XP} XP chacun</span></h3>
            <div className="list">{LB_SONG.map(([t, f], i) => <CheckItem key={i} on={(e.lb ?? []).includes(i)} title={t} desc={f(e.bpm)} xp={LB_SONG_XP} onToggle={() => act((x) => A.toggleSongLB(x, id, i), (e.lb ?? []).includes(i) ? undefined : `Limit Break : ${t}.`)} />)}</div>
          </>
        )}
        <div className="links">
          <a href={`https://www.youtube.com/results?search_query=${q}`} target="_blank" rel="noopener noreferrer">Versions guitare sur YouTube ↗</a>
          <a href={`https://musescore.com/sheetmusic?text=${encodeURIComponent(s.t + ' guitar')}`} target="_blank" rel="noopener noreferrer">Partitions sur MuseScore ↗</a>
          {s.imslp && <a href={`https://imslp.org/index.php?search=${encodeURIComponent(`${s.t} ${s.by ?? ''}`)}`} target="_blank" rel="noopener noreferrer">Partition libre sur IMSLP ↗</a>}
          {s.g === 'classique' && <a href={`https://www.thisisclassicalguitar.com/?s=${encodeURIComponent(s.t)}`} target="_blank" rel="noopener noreferrer">This is Classical Guitar ↗</a>}
        </div>
        {s.custom && <button className="btn btn-ghost danger" onClick={() => { if (confirm(`Supprimer « ${s.t} » ?`)) { act((x) => A.deleteCustomSong(x, id)); onClose(); } }}>Supprimer ce morceau perso</button>}
      </div>
    </div>
  );
}

function Collections({ onPick }: { onPick: (c: string) => void }) {
  const { save } = useGame();
  const ms = masteryState(save);
  return (
    <Panel title="Collections" aside={<span className="muted small">Maîtrise des morceaux pour débloquer des personnalisations pour ton héros.</span>}>
      <h3 className="sub">Genres</h3>
      <ul className="coll-grid">
        {GORDER.map((g) => (
          <li key={g} className="coll">
            <b>{GENRES[g].n}</b><span className="small muted">{GENRES[g].d}</span>
            <span className="small">{ms.byG[g] ?? 0} maîtrisé{(ms.byG[g] ?? 0) > 1 ? 's' : ''}</span>
            <ul className="tiers">{GENRES[g].tiers.map(([n, id]) => <li key={id} className={(ms.byG[g] ?? 0) >= n ? 'on' : ''}>{n} → {ITEM[id]?.name ?? id}</li>)}</ul>
          </li>
        ))}
      </ul>
      <h3 className="sub">Œuvres</h3>
      <ul className="coll-grid">
        {Object.entries(COLLS).map(([k, c]) => {
          const have = ms.byC[k] ?? 0;
          return (
            <li key={k} className={`coll ${have >= c.need ? 'done' : ''}`}>
              <button className="link-btn" onClick={() => onPick(k)}><b>{c.n}</b></button>
              <span className="small">{fmt(Math.min(have, c.need))} / {c.need} · {GENRES[c.g]?.n}</span>
              <span className="small">Récompense : {ITEM[c.rw]?.name ?? c.rw}</span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
