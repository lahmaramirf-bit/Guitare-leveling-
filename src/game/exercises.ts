export type ExerciseCategory = 'accords' | 'changements' | 'rythme' | 'gammes' | 'technique' | 'morceau';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  description: string;
  howTo: string[];
  suggestedBpm: number | null;
  suggestedMinutes: number;
}

export const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  accords: 'Accords',
  changements: "Changements d'accords",
  rythme: 'Rythme',
  gammes: 'Gammes',
  technique: 'Technique',
  morceau: 'Morceau',
};

export const EXERCISES: Exercise[] = [
  {
    id: 'open_chords',
    name: 'Accords ouverts',
    category: 'accords',
    description: 'Do, Ré, Mi mineur, Sol, La mineur : chaque corde doit sonner nette.',
    howTo: [
      'Place l’accord, gratte corde par corde : aucune ne doit frisotter.',
      'Relâche, secoue la main, replace. Recommence 10 fois par accord.',
      'Garde le pouce derrière le manche, poignet détendu.',
    ],
    suggestedBpm: null,
    suggestedMinutes: 10,
  },
  {
    id: 'one_minute_changes',
    name: 'Changements en une minute',
    category: 'changements',
    description: 'Compte combien de changements propres tu fais en 60 s entre deux accords.',
    howTo: [
      'Choisis une paire (ex. Do ↔ Sol).',
      'Lance 60 s : change d’accord le plus de fois possible, en restant propre.',
      'Note ton score dans les notes de séance pour suivre ta progression.',
    ],
    suggestedBpm: 60,
    suggestedMinutes: 8,
  },
  {
    id: 'strumming_basic',
    name: 'Rythmique Bas-Bas-Haut-Haut-Bas-Haut',
    category: 'rythme',
    description: 'Le motif de grattage universel, au métronome.',
    howTo: [
      'Main droite en mouvement continu, même quand tu ne touches pas les cordes.',
      'Commence à 60 BPM, monte de 4 BPM seulement quand c’est régulier.',
    ],
    suggestedBpm: 70,
    suggestedMinutes: 10,
  },
  {
    id: 'pentatonic_minor',
    name: 'Pentatonique mineure (position 1)',
    category: 'gammes',
    description: 'La gamme reine du rock et du blues, en La.',
    howTo: [
      'Monte et descends la gamme, un doigt par case.',
      'Aller-retour de médiator strict (bas-haut).',
      'Une note par clic au départ, puis deux.',
    ],
    suggestedBpm: 60,
    suggestedMinutes: 10,
  },
  {
    id: 'spider_walk',
    name: 'Araignée chromatique 1-2-3-4',
    category: 'technique',
    description: 'Indépendance et précision des doigts de la main gauche.',
    howTo: [
      'Cases 1-2-3-4 sur chaque corde, un doigt par case.',
      'Garde les doigts proches des cordes, pas de crispation.',
    ],
    suggestedBpm: 60,
    suggestedMinutes: 8,
  },
  {
    id: 'song_practice',
    name: 'Travail d’un morceau',
    category: 'morceau',
    description: 'Applique la méthode du Grimoire sur un morceau de ton répertoire.',
    howTo: [
      'Commence par les passages difficiles, en boucle et lentement.',
      'Enchaîne ensuite les sections, puis le morceau complet.',
    ],
    suggestedBpm: null,
    suggestedMinutes: 15,
  },
];

export function exerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}
