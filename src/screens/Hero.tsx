import { useRef, useState } from 'react';
import { useGame, kv } from '../ui/store';
import { Bar, Crystal, Panel, RarityTag, Tabs, fmt } from '../ui/bits';
import { CharacterPortrait } from '../appearance/CharacterPortrait';
import { CATALOG, CONSUMABLES, ITEM, MASTERY, REQ_LABEL, SHOP, SLOT_LABELS, fitsAvatar, type CatalogItem } from '../game/catalog';
import * as A from '../game/actions';
import { crystalParts } from '../game/progress';
import { masteryState } from '../game/engine';
import { COLLS, GENRES } from '../content';
import { exportJson, importJson } from '../game/storage';
import { emptySave, type Slot } from '../game/model';

const SLOTS: Slot[] = ['title', 'guitar', 'top', 'bottom', 'hair', 'accessory', 'aura', 'decor'];
type Sub = 'shop' | 'wardrobe' | 'mastery' | 'save';

export function Hero() {
  const [sub, setSub] = useState<Sub>('shop');
  return (
    <div className="stack">
      <Profile />
      <Tabs label="Héros" value={sub} onChange={setSub} items={[['shop', 'Boutique'], ['wardrobe', 'Garde-robe'], ['mastery', 'Maîtrise'], ['save', 'Sauvegarde']]} />
      {sub === 'shop' && <Shop />}
      {sub === 'wardrobe' && <Wardrobe />}
      {sub === 'mastery' && <MasteryItems />}
      {sub === 'save' && <SaveTools />}
    </div>
  );
}

function Profile() {
  const { save, act, toast } = useGame();
  const [name, setName] = useState(save.profile.name);
  const avatar = save.profile.avatar;
  return (
    <Panel title="Héros">
      <div className="hero-edit">
        <CharacterPortrait avatarId={avatar} size="md" />
        <div className="stack-sm">
          <form className="row" onSubmit={(e) => { e.preventDefault(); act((s) => A.setName(s, name)); toast('Nom enregistré', 'ok'); }}>
            <label className="grow">Nom<input maxLength={24} value={name} onChange={(e) => setName(e.target.value)} /></label>
            <button className="btn" type="submit">OK</button>
          </form>
          <div role="radiogroup" aria-label="Avatar" className="avatar-pick">
            {(['boy', 'girl'] as const).map((a) => (
              <button key={a} role="radio" aria-checked={avatar === a} className={`avatar-opt ${avatar === a ? 'sel' : ''}`} onClick={() => act((s) => A.setAvatar(s, a))}>
                <img src={`./concept/${a}-portrait.png`} alt="" />
                <span>{a === 'boy' ? 'Le Guitariste' : 'La Guitariste'}</span>
              </button>
            ))}
          </div>
          <p className="notice small">Portraits = <b>illustrations concept</b>. Les titres s’affichent déjà ; les tenues et guitares seront visibles sur le personnage quand les sprites en calques seront livrés. Ton équipement est enregistré dès maintenant.</p>
        </div>
      </div>
    </Panel>
  );
}

function ItemCard({ it, children, locked }: { it: CatalogItem; children?: React.ReactNode; locked?: boolean }) {
  return (
    <li className={`item ${locked ? 'locked' : 'owned'} rarity-edge-${it.rarity}`}>
      <span className="item-slot">{SLOT_LABELS[it.slot]}{it.visual !== 'approved' && <span title="Visuel en production"> · visuel à venir</span>}</span>
      <b>{it.name}</b>
      <RarityTag rarity={it.rarity} />
      <span className="small muted">{it.desc}</span>
      {children}
    </li>
  );
}

function Shop() {
  const { save, today, p, crystals, act } = useGame();
  const [slot, setSlot] = useState<Slot | 'all'>('all');
  const parts = crystalParts(p);
  const items = SHOP.filter((i) => (slot === 'all' || i.slot === slot) && fitsAvatar(i, save.profile.avatar));
  const sorted = [...items].sort((a, b) => {
    const ra = p.values[a.req![0]] >= a.req![1], rb = p.values[b.req![0]] >= b.req![1];
    return Number(save.shop.owned.includes(a.id)) - Number(save.shop.owned.includes(b.id)) || Number(rb) - Number(ra) || a.price! - b.price!;
  });
  return (
    <>
      <Panel title="Boutique" aside={<span className="chip"><Crystal /> <b data-testid="shop-crystals">{fmt(crystals)}</b> cristaux</span>}>
        <p>Pas de hasard : chaque objet se <b>débloque par ta progression musicale</b> (niveau, rang, série, quêtes, boss, morceaux maîtrisés…), puis s’achète avec les cristaux gagnés en jouant. Aucun achat réel.</p>
        <div className="filters">
          <select value={slot} onChange={(e) => setSlot(e.target.value as Slot | 'all')} aria-label="Type d’objet">
            <option value="all">Tous les objets</option>
            {SLOTS.filter((s) => SHOP.some((i) => i.slot === s)).map((s) => <option key={s} value={s}>{SLOT_LABELS[s]}</option>)}
          </select>
        </div>
        <ul className="collection">
          {sorted.map((it) => {
            const [k, n] = it.req!;
            const have = p.values[k];
            const ok = have >= n;
            const owned = save.shop.owned.includes(it.id);
            return (
              <ItemCard key={it.id} it={it} locked={!ok && !owned}>
                {owned ? <span className="tag">Possédé</span> : (
                  <>
                    <Bar label={REQ_LABEL[k](n)} value={Math.min(have, n)} max={n} right={k === 'rank' ? (ok ? '✓' : '🔒') : `${fmt(Math.min(have, n))} / ${fmt(n)}`} />
                    <button className="btn btn-gold" disabled={!ok || crystals < it.price!} data-testid={`buy-${it.id}`}
                      onClick={() => act((s) => A.buy(s, it.id, today), undefined) && undefined}>
                      {ok ? `Acheter · ${fmt(it.price!)}` : `🔒 ${fmt(it.price!)}`} <Crystal />
                    </button>
                  </>
                )}
              </ItemCard>
            );
          })}
        </ul>
      </Panel>
      <div className="grid-2">
        <Panel title="Objets utiles">
          <ul className="list-plain">
            {CONSUMABLES.map((c) => (
              <li key={c.id} className="row">
                <div className="grow"><b>{c.name}</b> <span className="small muted">×{save.shop.inv[c.id]}</span><br /><span className="small muted">{c.desc}</span></div>
                <button className="btn" disabled={crystals < c.price} onClick={() => act((s) => A.buyConsumable(s, c.id, today))}>{c.price} <Crystal /></button>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="D’où viennent tes cristaux">
          {Object.entries(parts).map(([k, v]) => <div key={k} className="src-row"><span>{k}</span><b className="mono">{fmt(v)}</b></div>)}
          <div className="src-row"><span>Dépensés en boutique</span><b className="mono">−{fmt(save.shop.spent)}</b></div>
        </Panel>
      </div>
    </>
  );
}

function Wardrobe() {
  const { save, act } = useGame();
  return (
    <Panel title="Garde-robe">
      <div className="loadout">
        {SLOTS.map((slot) => {
          const owned = CATALOG.filter((i) => i.slot === slot && A.isOwned(save, i.id) && fitsAvatar(i, save.profile.avatar));
          const cur = A.equipped(save, slot);
          const optional = ['accessory', 'aura', 'decor', 'title'].includes(slot);
          return (
            <label key={slot}>{SLOT_LABELS[slot]}
              <select value={cur ?? ''} onChange={(e) => act((s) => A.equip(s, slot, e.target.value || null))} disabled={!owned.length && !optional}>
                {optional && <option value="">— Aucun —</option>}
                {owned.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          );
        })}
      </div>
      <p className="muted small">Les objets « ★ Maîtrise » se débloquent en maîtrisant des morceaux du Répertoire. Les autres s’achètent en Boutique une fois la condition remplie.</p>
    </Panel>
  );
}

function MasteryItems() {
  const { save } = useGame();
  const ms = masteryState(save);
  return (
    <Panel title="Récompenses de maîtrise" aside={<span className="muted small">{MASTERY.filter((m) => ms.un.has(m.id)).length} / {MASTERY.length}</span>}>
      <ul className="collection">
        {MASTERY.map((it) => {
          const src = ms.src[it.id];
          const why = src ? (src.kind === 'c' ? `${src.need} morceaux de « ${COLLS[src.key].n} »` : `${src.need} morceaux du genre ${GENRES[src.key].n}`) : '';
          return (
            <ItemCard key={it.id} it={it} locked={!ms.un.has(it.id)}>
              {ms.un.has(it.id) ? <span className="tag">Débloqué</span> : src && <Bar label={why} value={Math.min(src.have, src.need)} max={src.need} />}
            </ItemCard>
          );
        })}
      </ul>
    </Panel>
  );
}

function SaveTools() {
  const { save, act, toast, migrated } = useGame();
  const file = useRef<HTMLInputElement>(null);
  const doExport = () => {
    const blob = new Blob([exportJson(save)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `guitar-leveling-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const doImport = async (f: File) => {
    const txt = await f.text();
    act((s) => { try { return importJson(kv, txt, s); } catch (e) { throw new A.ActionError((e as Error).message || 'Import impossible'); } });
    toast('Sauvegarde importée (l’ancienne est conservée en secours).', 'ok');
  };
  return (
    <Panel title="Sauvegarde">
      {migrated && <p className="notice">Ta progression du projet de base a été reprise automatiquement depuis ce navigateur.</p>}
      <p className="small muted">La progression est enregistrée automatiquement dans ce navigateur. Exporte-la pour la garder en sécurité ou la transférer. L’import accepte aussi l’état du projet de base (format <code>{'{days, items, weeks, …}'}</code>).</p>
      <div className="row">
        <button className="btn" onClick={doExport}>Exporter (.json)</button>
        <button className="btn" onClick={() => file.current?.click()}>Importer…</button>
        <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void doImport(f); e.target.value = ''; }} />
        <span className="spacer" />
        <button className="btn btn-ghost danger" onClick={() => {
          if (confirm('Effacer toute la progression ? Pense à exporter avant.') && confirm('Vraiment ? Cette action est définitive.')) act(() => ({ ...emptySave(), profile: { ...emptySave().profile, onboarded: true } }));
        }}>Recommencer à zéro</button>
      </div>
      <p className="muted small">Objets connus : {Object.keys(ITEM).length}.</p>
    </Panel>
  );
}
