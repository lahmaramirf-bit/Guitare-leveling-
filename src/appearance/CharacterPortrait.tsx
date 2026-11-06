import type { AvatarId } from '../game/model';

/**
 * Portrait du héros. Tant qu'aucun sprite multicouche n'est livré
 * (docs/contracts/asset-manifest.json → productionStatus "missing"),
 * on affiche un recadrage de la planche approuvée, étiqueté CONCEPT.
 * L'équipement n'est PAS dessiné sur ce portrait.
 */
export function CharacterPortrait({ avatarId, size = 'md' }: { avatarId: AvatarId; size?: 'sm' | 'md' | 'lg' }) {
  const alt = avatarId === 'boy' ? 'Le héros : garçon brun, musicien de l’Académie' : 'L’héroïne : fille aux cheveux corail, musicienne de l’Académie';
  return (
    <figure className={`portrait portrait-${size}`}>
      <img src={`./concept/${avatarId}-portrait.png`} alt={alt} draggable={false} />
      <span className="concept-badge" title="Illustration de référence : le sprite personnalisable est en production">Concept</span>
    </figure>
  );
}
