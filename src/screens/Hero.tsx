import { useRef, useState } from 'react';
import { useGame, kv } from '../ui/store';
import { Crystal, Panel, RarityTag, Shard, fmt } from '../ui/bits';
import { CharacterPortrait } from '../appearance/CharacterPortrait';
import { COSMETICS, SLOT_LABELS, fitsAvatar, unlockLabel, type Cosmetic, type Slot } from '../game/cosmetics';
import { equip, invoke, setAvatar, setName } from '../game/state';
import { PITY_LIMIT, PULL_COST, RATES } from '../game/gacha';
import { RARITY_LABELS } from '../game/cosmetics';
import { mulberry32, randomSeed } from '../game/rng';
import { exportJson, importJson } from '../game/storage';
import { newGame } from '../game/state';

const SLOTS: Slot[] = ['hair', 'top', 'bottom', 'accessory', 'guitar'];

export function Hero() {
  const { state, update, toast } = useGame();
  const [name, setNameInput] = useState(state.profile.name);
  const [last, setLast] = useState<{ item: Cosmetic; duplicate: boolean; shards: number } | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const avatar = state.appearance.avatarId;

  const doInvoke = () => {
    const r = invoke(state, mulberry32(randomSeed()));
    if (!r.result) return;
    update(() => r.state);
    setLast(r.result);
  };

  const doExport = () => {
    const blob = new Blob([exportJson(state)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `guitar-leveling-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const doImport = async (f: File) => {
    try {
      const s = importJson(kv, await f.text(), state);
      update(() => s);
      toast('Sauvegarde importée (l’ancienne est conservée en secours).', 'ok');
    } catch (e) {
      toast((e as Error).message || 'Import impossible', 'info');
    }
  };

  return (
    <div className="stack">
      <div className="grid-hero">
        <Panel title="Héros">
          <div className="hero-edit">
            <CharacterPortrait avatarId={avatar} size="md" />
            <div className="stack-sm">
              <form className="row" onSubmit={(e) => { e.preventDefault(); update((s) => setName(s, name)); toast('Nom enregistré', 'ok'); }}>
                <label className="grow">Nom<input maxLength={24} value={name} onChange={(e) => setNameInput(e.target.value)} /></label>
                <button className="btn" type="submit">OK</button>
              </form>
              <div role="radiogroup" aria-label="Avatar" className="avatar-pick">
                {(['boy', 'girl'] as const).map((a) => (
                  <button key={a} role="radio" aria-checked={avatar === a} className={`avatar-opt ${avatar === a ? 'sel' : ''}`} onClick={() => update((s) => setAvatar(s, a))}>
                    <img src={`./concept/${a}-portrait.png`} alt="" />
                    <span>{a === 'boy' ? 'Le Guitariste' : 'La Guitariste'}</span>
                  </button>
                ))}
              </div>
              <p className="notice small">Portraits = <b>illustrations concept</b>. Les tenues équipées seront visibles sur le personnage quand les sprites en calques seront livrés ; ton équipement est déjà enregistré.</p>
            </div>
          </div>
        </Panel>
        <Panel title="Équipement">
          <div className="loadout">
            {SLOTS.map((slot) => {
              const owned = COSMETICS.filter((c) => c.slot === slot && state.inventory.includes(c.id) && fitsAvatar(c, avatar));
              const cur = state.appearance.loadout[slot];
              return (
                <label key={slot}>{SLOT_LABELS[slot]}
                  <select value={cur ?? ''} onChange={(e) => update((s) => equip(s, slot, e.target.value || null))}>
                    {slot === 'accessory' && <option value="">— Aucun —</option>}
                    {owned.map((c) => <option key={c.id} value={c.id}>{c.name} ({RARITY_LABELS[c.rarity]})</option>)}
                  </select>
                </label>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel title="Invocation cosmétique" aside={<span className="chip"><Crystal /> <b>{fmt(state.crystals)}</b></span>}>
        <div className="gacha">
          <div>
            <p>Les cristaux se gagnent <b>uniquement en t’entraînant</b> (séances, quêtes, coffre). Aucun achat réel. Les objets sont purement cosmétiques.</p>
            <ul className="rates">{RATES.map((r) => <li key={r.rarity}><RarityTag rarity={r.rarity} /> {r.pct} %</li>)}</ul>
            <p className="muted small">Légendaire garanti au plus tard au {PITY_LIMIT}ᵉ tirage (compteur : {state.pity}/{PITY_LIMIT}). Doublon → éclats <Shard /> ({fmt(state.shards)}).</p>
          </div>
          <div className="gacha-action">
            <button className="btn btn-primary btn-big" disabled={state.crystals < PULL_COST} onClick={doInvoke}>Invoquer · {PULL_COST} <Crystal /></button>
            {state.crystals < PULL_COST && <p className="muted small">Encore {PULL_COST - state.crystals} cristaux : une séance de 30 min en rapporte 6, plus les quêtes.</p>}
            {last && (
              <div className={`pull-result rarity-bg-${last.item.rarity}`} role="status">
                <RarityTag rarity={last.item.rarity} />
                <b>{last.item.name}</b>
                <span className="small">{SLOT_LABELS[last.item.slot]}{last.duplicate ? ` · doublon → +${last.shards} éclats` : ' · nouveau !'}</span>
              </div>
            )}
          </div>
        </div>
      </Panel>

      <Panel title="Collection">
        <ul className="collection">
          {COSMETICS.map((c) => {
            const owned = state.inventory.includes(c.id);
            return (
              <li key={c.id} className={`item ${owned ? 'owned' : 'locked'} rarity-edge-${c.rarity}`}>
                <span className="item-slot">{SLOT_LABELS[c.slot]}</span>
                <b>{owned ? c.name : '???'}</b>
                <RarityTag rarity={c.rarity} />
                <span className="small muted">{owned ? (c.avatars.length === 1 ? (c.avatars[0] === 'boy' ? 'Guitariste' : 'Guitariste (F)') : 'Les deux') : unlockLabel(c.unlock)}</span>
              </li>
            );
          })}
        </ul>
        <p className="muted small">Visuels des objets : en production (aucun sprite définitif n’est encore livré).</p>
      </Panel>

      <Panel title="Sauvegarde">
        <p className="muted small">La progression est enregistrée automatiquement dans ce navigateur. Exporte-la pour la garder en sécurité ou la transférer.</p>
        <div className="row">
          <button className="btn" onClick={doExport}>Exporter (.json)</button>
          <button className="btn" onClick={() => file.current?.click()}>Importer…</button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void doImport(f); e.target.value = ''; }} />
          <span className="spacer" />
          <button className="btn btn-ghost danger" onClick={() => {
            if (confirm('Effacer toute la progression ? Pense à exporter avant.') && confirm('Vraiment ? Cette action est définitive.')) update(() => ({ ...newGame(), onboarded: true }));
          }}>Recommencer à zéro</button>
        </div>
      </Panel>
    </div>
  );
}

