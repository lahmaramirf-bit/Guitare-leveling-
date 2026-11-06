# Contrat technique d'assets 2D (production)

**Ce fichier définit une cible à produire, pas ce qui existe aujourd'hui.**

## Cible par pose / avatar

- Format source éditable : PSD multicouche, Krita KRA, ou un format équivalent conservant les calques et groupes (avec export reproductible). Ne pas créer de PSD aplati rebaptisé en PSD « multicouche ».
- Cible export : `1024 × 1280`, PNG RGBA transparent avec proportions cohérentes entre les avatars, pas un upscale d'un petit crop.
- Repère commun : origine (0,0) en haut-gauche, point personnage (512,1170) dans le canevas cible — ajustable pendant le premier rig **une seule fois**, puis figé.
- Ordre indicatif (à vérifier sur le master) : `accessory_back`, `guitar_back`, `hair_back`, `body`, `bottom`, `shoes`, `top`, `face`, `hair_front`, `accessory_front`, `guitar_front`. Les calques d'instrument peuvent être déplacés selon pose.
- Chaque couche exportée a **les mêmes dimensions de canevas**, pas une boîte serrée au hasard.
- Métadonnées versionnées : avatar, hair, top, bottom, accessory, guitar, theme, coordonnées des ancrages, sprites/URLs, compatibilités et provenance/licence.

## Mini-pack MVP visé

Pour **chaque** personnage : un base, deux coiffures, deux hauts, un bas, un accessoire, deux guitares ; trois thèmes globaux. Poses ultérieures idle, guitare, célébration. Tout combinatoire du mini-pack testé, et pas uniquement une capture statique.

## Règles de qualité

Aucun bout de fond inclus dans alpha, aucune double face/chevelure, aucun décalage à l'échange, pas de contour coupé, pas de variation des proportions, tests sur fond sombre/clair et à taille mobile. La modélisation doit rester techniquement séparée de l'XP, du gacha et des exercices.

Voir `templates/asset-manifest.example.json` : il décrit le futur format mais déclare expressément les sprites indisponibles aujourd'hui.
