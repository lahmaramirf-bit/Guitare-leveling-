import { useState } from 'react';
import { useGame, uid } from '../ui/store';
import { Panel } from '../ui/bits';
import { addSong, removeSong, setSongStatus } from '../game/state';
import type { SongStatus } from '../game/types';

const STATUS: Record<SongStatus, string> = { a_apprendre: 'À apprendre', en_cours: 'En cours', maitrise: 'Maîtrisé' };

export function Repertoire({ practice }: { practice: (songId: string) => void }) {
  const { state, update, toast } = useGame();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [bpm, setBpm] = useState('');

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    update((s) => addSong(s, { title, artist, targetBpm: bpm ? Number(bpm) : null }, uid()));
    toast(`« ${title.trim()} » ajouté au répertoire`, 'ok');
    setTitle(''); setArtist(''); setBpm('');
  };

  return (
    <div className="stack">
      <Panel title="Ajouter un morceau">
        <form className="form" onSubmit={add}>
          <label>Titre<input required maxLength={80} value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label>Artiste<input maxLength={80} value={artist} onChange={(e) => setArtist(e.target.value)} /></label>
          <label>Tempo cible (BPM)<input type="number" min={20} max={300} value={bpm} onChange={(e) => setBpm(e.target.value)} /></label>
          <button className="btn btn-gold" type="submit">Ajouter</button>
        </form>
      </Panel>
      <Panel title="Mon répertoire">
        {state.songs.length === 0 ? <p className="muted">Aucun morceau pour l’instant. Ajoute celui qui te donne envie de jouer.</p> : (
          <ul className="song-list">
            {state.songs.map((s) => {
              const minutes = state.sessions.filter((x) => x.songId === s.id).reduce((a, x) => a + x.minutes, 0);
              return (
                <li key={s.id} className={`song status-${s.status}`}>
                  <div>
                    <h3>{s.title}</h3>
                    <p className="muted small">{s.artist || 'Artiste inconnu'}{s.targetBpm ? ` · objectif ${s.targetBpm} BPM` : ''} · {minutes} min travaillées</p>
                  </div>
                  <select aria-label={`Statut de ${s.title}`} value={s.status} onChange={(e) => update((st) => setSongStatus(st, s.id, e.target.value as SongStatus))}>
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <button className="btn btn-primary" onClick={() => practice(s.id)}>Travailler</button>
                  <button className="btn btn-ghost" aria-label={`Retirer ${s.title}`} onClick={() => { if (confirm(`Retirer « ${s.title} » ?`)) update((st) => removeSong(st, s.id)); }}>✕</button>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}
