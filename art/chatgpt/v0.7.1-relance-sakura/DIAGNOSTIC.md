# Diagnostic Claude Code du 2026-11-06, lot v0.7

## Ce qui marche (testé)
- Panneau personnage compact intégré à l'accueil. Le personnage est entier, pieds sur la ligne de sol à 90 % :
  - ordinateur : décor 1056×468 px, personnage 363 px de haut ;
  - mobile 390 px : décor 334×230 px, personnage 179 px de haut.
- Tests : 33/33 unitaires, 40/40 bout en bout. Aucune erreur console.
- Le décor sera chargé dès réception : contrôle automatique (`check_panel_bg.py`), puis installation au statut « candidat ».

## Ce qui ne va pas
| # | Problème | Gravité | Cause | Ce qu'il faut |
|---|---|---|---|---|
| 1 | **`panel_bg_sakura.png` jamais reçu** | Bloquant | Absent du zip v0.7. Le lien Adobe (photoshop-api.adobe.io) est refusé depuis mon environnement (403) et expire. | Le PNG en **fichier joint** |
| 2 | Décor actuel = vignette floue de la planche | Moyenne | Remplaçant provisoire, étiqueté « Décor provisoire » | Résolu par le n°1 |
| 3 | Risque sur mobile : seuls les **64 % centraux** du décor sont visibles (x 252 à 1148 sur 1400) | À anticiper | Hauteur fixe de 230 px pour garder le personnage lisible | Rien d'important hors de cette bande |
| 4 | Risque de contraste : le personnage est posé au centre (x ≈ 580 à 820, y ≈ 90 à 558) | À anticiper | Un décor chargé au centre noie la silhouette | Zone centrale calme, moins détaillée et moins saturée |

## Contraintes non négociables
- PNG **1400×620**, opaque, nom exact `panel_bg_sakura.png`.
- Aucun personnage, texte, logo, cadre ou élément d'interface.
- Ligne de sol à **y ≈ 558 px** (90 %), à peu près horizontale au centre.
- Coins haut-gauche et haut-droite assez sombres ou unis : le niveau et la gemme de rang s'y affichent.
- Aucun lien externe : seulement le fichier.

## Gates
A, B, C, D, H et I en PASS. E en attente (décors). F (guitares) et G (animations) bloqués faute d'art.
