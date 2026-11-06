# Diagnostic Claude Code du 2026-11-06, lot v0.7.2 (Sakura candidat)

## Décisions
- D-028 : `panel_bg_sakura.png` intégré au statut **candidate** (pas `approved` sans validation du fondateur). Ligne de sol à 90 % conservée.
- D-029 : voile sombre derrière « Niv. / titre » en haut à gauche (correction côté interface).

## Intégré et testé
- Contrôle du fichier : PNG 1400×620 opaque. Contraste de la zone du personnage : 36,8, sous le seuil d'alerte de 60. **OK**.
- Pieds du personnage :
  - ordinateur : 89,7 % de la hauteur du décor ;
  - mobile : 90,4 %.
  - Ils tombent sur le ponton en bois (sol du décor entre y 540 et 620, pieds à y ≈ 558). Personnage entier, non déformé, fille et garçon.
- Tests : 33/33 unitaires, 40/40 bout en bout, contrats sans erreur.

## Ce qui va bien
- Le centre (lac et Fuji) est calme : la silhouette ressort bien, fille comme garçon.
- La gemme de rang en haut à droite reste lisible sur le ciel.
- Sur mobile, le personnage, le lac et le Fuji restent visibles ; le torii et la guitare du décor sont rognés, comme prévu.

## Ce qui ne va pas (ou à surveiller)
| # | Constat | Gravité | Traitement |
|---|---|---|---|
| 1 | Texte blanc « Niv. 1 / Débutant éveillé » illisible sur les cerisiers clairs du coin haut-gauche | Moyenne | **Corrigé côté app** (voile sombre). Pour une prochaine version, une branche un peu plus sombre ou moins dense dans ce coin aiderait. |
| 2 | Fichier reçu en **WebP** (compression avec perte), converti en PNG | Faible | Si possible, envoyer le **PNG original sans perte**. Le rendu actuel reste acceptable. |
| 3 | **Guitare acoustique posée dans le décor** (à gauche) | À arbitrer | Risque de confusion avec la guitare équipée du personnage quand les guitares arriveront. Proposition : la garder (ambiance musicale), puisqu'elle est rognée sur mobile. Décision du fondateur. |
| 4 | Les pieds sont posés près du bord arrière du ponton, juste devant la rambarde | Faible | Acceptable. Si on veut le personnage plus « dans » la scène, abaisser la rambarde d'environ 15 px ou élargir la zone de plancher. |
| 5 | Décor très saturé (rose et violet) par rapport à l'interface beige | Faible | Cohérent avec Sakura. Juge sur les captures. |

## Art manquant
- `panel_bg_cyberpunk.png` et `panel_bg_ombre.png` : volontairement non demandés avant validation de Sakura.
- Guitares, rig et animations : non livrés, gates F et G bloquées.

## Gates
A, B, C, D, H et I en PASS. **E en attente de ta validation de Sakura.** F et G bloquées.
