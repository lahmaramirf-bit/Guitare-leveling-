# 04 — Équipement guitare et customisation visible

## Définition de « équipé »
Dans la boutique v0.2, le choix de l'objet est sauvegardé. **Équipé visuellement** signifie : l'objet est réellement dessiné sur le héros aux bonnes proportions, dans la bonne couche, avec sa sangle/prise en main, y compris pendant une animation. Une ligne de texte ou une icône d'inventaire ne suffit pas.

## Guitares visées (assets à produire)
- `guitar_study.png` : acoustique bois clair (commun)
- `guitar_red_electric.png` : électrique rouge/blanc (rare)
- `guitar_amethyst.png` : violette avec motifs dorés (épique)
- `guitar_crystal.png` : cristalline bleu lumineux (légendaire)

**IMPORTANT** : ces quatre fichiers ne sont PAS dans ce kit. Les noms sont un contrat de production, pas une preuve d'asset.

## Ancrages et calques
- Toutes les pièces sur canevas commun 1024×1280, alpha transparent, même projection, même personnage de référence.
- Ne pas figer un angle de 30° si la prise de main ne suit pas. L'inclinaison doit être déterminée par la **pose définitive guitare** pour garçon/fille ; ancrage dans la source du rig plutôt que positioning à l'œil dans l'interface.
- Points à documenter : `shoulder_strap`, `left_hand_neck`, `right_hand_strum`, `body_center`, `guitar_neck_angle`.
- Ordre autour du corps : `guitar_strap_back`, `body_and_clothes`, `guitar_body_front`, `left_hand_over_neck`, `right_hand_over_strings`. Variations pour poses latérales.
- Une version miniature icône pour la boutique peut être distincte des couches de jeu.

## Vêtements
Ne **pas** simplement générer une veste sur une photo et la superposer ensuite : la moitié de la manche ou l'épaule se recollera au mauvais endroit. La source multicouche doit être redessinée avec la même anatomie et la même pose. Garder la silhouette d'académie musicale, variantes scène/urbain/virtuose sans rendre le personnage soldat ou guerrier.

## Recette
Tester garçon/fille × 4 guitares × au moins les états idle et pose guitare ; inspecter mains/cordes/sangle/profil de l'instrument à taille mobile, et les 3 fonds clairs/foncés. Ne déduire aucune réussite du seul fait que l'inventaire indique "équipé".
