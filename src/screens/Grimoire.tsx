import { useState } from 'react';
import { Panel, Tabs } from '../ui/bits';
import { LAWS, METHOD, SESSION_PLAN, TCAT, TIPS } from '../content';

type Tab = 'bases' | 'lois' | 'codex' | 'methode';

/** Fiches « Bases » reprises du projet de base (texte uniquement). */
const BASES: [string, string[]][] = [
  ['Cordes à vide', ['① Mi aigu · ② Si · ③ Sol · ④ Ré · ⑤ La · ⑥ Mi grave.', 'De la plus grave à la plus aiguë : Mi La Ré Sol Si Mi.', 'La guitare sonne une octave plus bas que ce qui est écrit sur la portée.']],
  ['Le manche en 1re position', ['Notes naturelles des cases 0 à 4. Corde ① en haut, comme sur une tablature.', '① Mi Fa Sol · ② Si Do Ré · ③ Sol La · ④ Ré Mi Fa · ⑤ La Si Do · ⑥ Mi Fa Sol.']],
  ['Notation des doigts', ['p i m a : pouce, index, majeur, annulaire (main droite).', '1 2 3 4 : index à auriculaire (main gauche), 0 = corde à vide.', '① à ⑥ : numéro de corde. V, VII… : position ou case en chiffres romains. C V : barré en case 5 (½C = demi-barré).']],
  ['Valeurs rythmiques', ['Ronde 4 temps · Blanche 2 temps · Noire 1 temps (♩) · Croche ½ temps · Double ¼ de temps.', 'Le point ajoute la moitié de la valeur.']],
  ['Buté ou pincé', ['Buté (apoyando) : le doigt finit sa course sur la corde voisine. Son plein, pour les mélodies et les gammes.', 'Pincé (tirando) : le doigt passe au-dessus de la corde voisine. Pour les arpèges et les accords.', 'Alterne toujours i-m, ne joue jamais deux notes de suite avec le même doigt.']],
  ['Gamme de Do majeur, 1re position', ['Formule d’une gamme majeure : ton, ton, demi-ton, ton, ton, ton, demi-ton.', 'Sur la guitare, un demi-ton = une case.']],
  ['Accords de base', ['Mim 022000 · Lam x02210 · Do x32010 · Sol 320003 · Ré xx0232 · Mi 022100', 'Lecture de la corde ⑥ à ①. x = corde non jouée.']],
  ['Méthode métronome', ['Commence assez lent pour jouer sans aucune faute.', '3 fois propre d’affilée → +4 au tempo.', 'Une faute → reviens au tempo précédent.', 'Note ton record dans le Journal.']],
  ['Entretien de ta guitare classique', ['Cordes : nylon tension normale, à changer tous les 3 à 4 mois. Compte 2 à 3 jours de réaccordage le temps que le nylon se stabilise.', 'Ongles : courts à la main gauche. Main droite : ongles ou pulpe, choisis et reste cohérent.', 'Plus tard : vers le rang B, une guitare de meilleure qualité (table massive) fera une vraie différence de son.']],
];

export function Grimoire() {
  const [tab, setTab] = useState<Tab>('methode');
  return (
    <div className="stack">
      <Tabs label="Grimoire" value={tab} onChange={setTab} items={[['bases', 'Bases'], ['lois', 'Les 10 lois'], ['codex', 'Codex'], ['methode', 'Méthode']]} />
      {tab === 'bases' && (
        <div className="grid-2">
          {BASES.map(([t, lines]) => <Panel key={t} title={t}><ul className="list-plain">{lines.map((l) => <li key={l}>{l}</li>)}</ul></Panel>)}
        </div>
      )}
      {tab === 'lois' && (
        <Panel title="Les 10 lois du Système">
          <ol className="grimoire">{LAWS.map(([h, p]) => <li key={h}><h3>{h}</h3><p>{p}</p></li>)}</ol>
        </Panel>
      )}
      {tab === 'codex' && (
        <Panel title="Codex" aside={<span className="muted small">Les conseils du Système, classés par thème · {TIPS.length} conseils</span>}>
          {Object.entries(TCAT).map(([k, [label]]) => {
            const tips = TIPS.filter(([c]) => c === k);
            if (!tips.length) return null;
            return (
              <details key={k} className="codex">
                <summary><b>{label}</b> <span className="muted small">({tips.length})</span></summary>
                <ul className="list-plain">{tips.map(([, t]) => <li key={t}>{t}</li>)}</ul>
              </details>
            );
          })}
        </Panel>
      )}
      {tab === 'methode' && (
        <>
          <Panel title="Apprendre un nouveau morceau">
            <ol className="grimoire">{METHOD.map(([h, p]) => <li key={h}><h3>{h}</h3><p>{p}</p></li>)}</ol>
          </Panel>
          <Panel title="Une séance type de 45 minutes">
            <ul className="list-plain">{SESSION_PLAN.map(([n, m, d]) => <li key={n}><b>{n} · {m} min</b> — <span className="muted">{d}</span></li>)}</ul>
            <p className="muted small">La session guidée de l’Entraînement suit ce découpage avec un minuteur.</p>
          </Panel>
        </>
      )}
    </div>
  );
}
