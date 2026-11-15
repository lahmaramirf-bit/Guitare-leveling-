/**
 * Questionnaire de niveau au premier lancement (brief 2026-11-15).
 * 3 questions → rang de départ (E, D, C ou B) et durée de séance conseillée.
 * Le placement fixe `meta.peak` : les quêtes, le portail et le donjon s'adaptent tout de suite,
 * l'XP reste à zéro (le moteur n'est pas modifié) et la progression se gagne en jouant.
 */
import type { RankId } from '../content';

export interface PlacementQ { id: 'exp' | 'chords' | 'read'; q: string; a: { label: string; pts: number }[] }
export const PLACEMENT: PlacementQ[] = [
  { id: 'exp', q: 'Depuis combien de temps joues-tu de la guitare ?', a: [
    { label: 'Je débute, ou presque', pts: 0 }, { label: 'Quelques mois', pts: 1 }, { label: '1 à 3 ans', pts: 2 }, { label: 'Plus de 3 ans', pts: 3 }] },
  { id: 'chords', q: 'Les accords Mim, Lam, Do, Sol, Ré…', a: [
    { label: 'Je ne les connais pas', pts: 0 }, { label: 'Je les connais, les changements sont lents', pts: 1 }, { label: 'Je les enchaîne proprement', pts: 2 }, { label: 'Barré complet sans grésiller', pts: 3 }] },
  { id: 'read', q: 'Lire une partition ou une tablature ?', a: [
    { label: 'Jamais fait', pts: 0 }, { label: 'Tablatures seulement', pts: 1 }, { label: 'Partition lente en 1re position', pts: 2 }, { label: 'Partition courante, positions hautes', pts: 3 }] },
];

export interface Placement { rank: RankId; minutes: 15 | 30 | 45; label: string }
/** Somme 0–9 → rang de départ. Volontairement prudent : mieux vaut monter vite que stagner trop haut. */
export function placement(points: number[]): Placement {
  const s = points.reduce((a, b) => a + b, 0);
  if (s <= 2) return { rank: 'E', minutes: 15, label: 'Le Réveil : on repart des bases, à ton rythme.' };
  if (s <= 5) return { rank: 'D', minutes: 30, label: 'Les Six Cordes : accords, arpèges et lecture.' };
  if (s <= 7) return { rank: 'C', minutes: 30, label: 'Le Donjon des Positions : on quitte la 1re position.' };
  return { rank: 'B', minutes: 45, label: 'La Porte du Barré : vraies pièces de répertoire.' };
}
