Bonjour ! Tu es directeur artistique de Guitar Leveling. **À lancer seulement après la livraison des calques du garçon (prompt précédent).** Il me faut la première guitare **portée par le héros**, découpée pour se superposer sur lui.

## Pièces jointes
- `boy_base.png`, `girl_base.png` : masters (et les calques du garçon si tu les as déjà produits).
- `master-characters-APPROVED.png` : la guitare acoustique « Commun » de la section « Guitares (skins) » est la référence.

## Guitare : `guitar_study` (acoustique bois clair, commune)
Pour le **garçon** puis la **fille**, des PNG **1024 × 1280, fond transparent, même canevas que le master** (pieds en x=512, y=1170) :
| Fichier | Contenu |
|---|---|
| `boy_guitar_study_strap_back.png` | partie de la sangle qui passe derrière le dos |
| `boy_guitar_study_body_front.png` | la guitare devant le corps, en bandoulière, tenue en position de jeu |
| `boy_hand_L_on_neck.png` | main gauche posée sur le manche (par-dessus la guitare) |
| `boy_hand_R_on_strings.png` | main droite sur les cordes (par-dessus la guitare) |
(idem `girl_…`)

Plus un fichier `guitar_study_anchors.json` avec, pour chaque personnage, en pixels sur le canevas :
`shoulder_strap`, `left_hand_neck`, `right_hand_strum`, `body_center`, et `guitar_neck_angle` (en degrés).

Et une icône de boutique séparée : `icon_guitar_study.png`, 256 × 256, transparente.

## Règles
- La guitare doit être **tenue de façon crédible** : sangle sur l'épaule, main gauche sur le manche, main droite au niveau de la rosace.
- Même style, même lumière et même échelle que les masters.
- Ne modifie pas le personnage lui-même : seuls la guitare, la sangle et les mains changent.

## Livraison
Commence par le **garçon**. Vérifie qu'en superposant master + calques guitare + mains, tout est aligné sans décalage ni double main.
