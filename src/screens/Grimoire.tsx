import { useState } from 'react';
import { Panel } from '../ui/bits';

type Tab = 'bases' | 'lois' | 'methode';

const METHODE: [string, string][] = [
  ['Écoute', 'Écoute le morceau 3 fois en suivant la partition. Tu dois savoir comment il doit sonner avant de le jouer.'],
  ['Repère', 'Trouve la structure (sections A, B, reprises), la tonalité, la mesure et le tempo.'],
  ['Marque les pièges', 'Repère les 2 ou 3 passages les plus durs et marque-les au crayon.'],
  ['Doigtés', 'Décide les doigtés main gauche et main droite des passages difficiles, et note-les.'],
  ['Section par section', 'Travaille très lentement, une section à la fois, mains séparées si besoin.'],
  ['Les pièges d’abord', 'Mets les passages difficiles en boucle avec la règle des 3, avant le reste.'],
  ['Relie', 'Enchaîne les sections et travaille surtout les transitions.'],
  ['Tempo', 'Monte le tempo par paliers de 4 BPM, en restant propre.'],
  ['Musique', 'Une fois le morceau en place, travaille les nuances, le son et l’expression.'],
];

const LOIS: [string, string][] = [
  ['La régularité bat l’intensité', '15 minutes chaque jour valent mieux que 2 heures le dimanche.'],
  ['Lent et propre, puis rapide', 'La vitesse vient de la précision, jamais l’inverse.'],
  ['Le métronome ne ment pas', 'Si tu ne peux pas le jouer au clic, tu ne le maîtrises pas encore.'],
  ['La règle des 3', 'Un passage est acquis quand tu le réussis 3 fois de suite sans faute.'],
  ['Détends-toi', 'Une main crispée est une main lente. Respire, relâche les épaules.'],
  ['Travaille ce qui est dur', 'Rejouer ce que tu sais déjà fait plaisir, mais ne fait pas progresser.'],
  ['Écoute-toi', 'Enregistre-toi régulièrement : l’oreille repère ce que les doigts cachent.'],
  ['Une chose à la fois', 'Chaque séance a un objectif clair et mesurable.'],
  ['La douleur est un signal', 'Bout des doigts sensibles : normal. Douleur au poignet : arrête-toi.'],
  ['Joue de la musique', 'Les exercices servent les morceaux. Termine chaque séance par un plaisir.'],
];

const BASES: [string, string][] = [
  ['Posture', 'Dos droit, guitare stable sans la tenir avec la main gauche, pouce derrière le manche.'],
  ['Accordage', 'Mi La Ré Sol Si Mi, de la corde la plus grave à la plus aiguë. Accorde avant chaque séance.'],
  ['Lire une tablature', '6 lignes = 6 cordes (la ligne du bas est le Mi grave). Le chiffre indique la case.'],
  ['Main gauche', 'Appuie juste derrière la frette, du bout des doigts, avec le minimum de force.'],
  ['Main droite', 'Médiator tenu entre pouce et index, mouvement du poignet plutôt que du bras.'],
  ['Échauffement', 'Deux minutes d’exercice chromatique lent avant d’attaquer un morceau.'],
];

export function Grimoire() {
  const [tab, setTab] = useState<Tab>('methode');
  const tabs: [Tab, string][] = [['bases', 'Bases'], ['lois', 'Les 10 lois'], ['methode', 'Méthode']];
  const [title, list] = tab === 'methode' ? ['Apprendre un nouveau morceau', METHODE] : tab === 'lois' ? ['Les 10 lois du guitariste', LOIS] : ['Les bases', BASES];
  return (
    <div className="stack">
      <div className="subtabs" role="tablist">
        {tabs.map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} className={`subtab ${tab === id ? 'sel' : ''}`} onClick={() => setTab(id)}>{label}</button>)}
      </div>
      <Panel title={title}>
        <ol className="grimoire">
          {list.map(([h, p]) => <li key={h}><h3>{h}</h3><p>{p}</p></li>)}
        </ol>
      </Panel>
    </div>
  );
}
