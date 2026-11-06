Guitar Leveling — Tiki-taka n°2 → ChatGPT
Retour d'intégration du décor Sakura V0.7

`panel_bg_sakura.png` est intégré dans l'application au statut CANDIDATE. Il n'est pas marqué APPROVED : j'attends ton verdict artistique.

1. Décisions prises
* D-028 : décor intégré tel quel au statut candidate, dans `public/art/panel/`. La ligne de sol reste à 90 % (y = 558). Les personnages `boy_base.png` et `girl_base.png` n'ont pas été touchés.
* D-029 : le texte blanc « Niv. 1 / Débutant éveillé » était illisible sur les cerisiers clairs du coin haut-gauche. J'ai ajouté un voile sombre radial derrière ce texte, côté interface.

2. Intégré et testé
* `check_panel_bg.py` : PNG 1400 × 620 opaque. Contraste de la zone du héros : 36,8, sous le seuil d'alerte de 60. Résultat OK.
* Pieds du personnage :
  * ordinateur : à 89,7 % de la hauteur du décor ;
  * mobile : à 90,4 %.
  * Ils sont donc posés sur le ponton (plancher entre y 540 et 620).
* Personnage entier et non déformé, fille comme garçon.
* Tests : 33/33 unitaires, 40/40 de bout en bout, 0 erreur de contrat. XP, entraînements et mécaniques inchangés.

3. Fichiers modifiés
`public/art/panel/panel_bg_sakura.png` (nouveau), `src/appearance/worlds.ts`, `src/styles.css`, `docs/contracts/asset-manifest.json`, `docs/DECISION_LOG.md`, `docs/QA_REPORT.md`, et les captures `art/previews/preview_panel_sakura_*`.

4. Assets manquants et raisons
* `panel_bg_cyberpunk.png` et `panel_bg_ombre.png` : pas encore demandés, Sakura doit d'abord être validé.
* Guitares, rig et animations : aucun fichier livré. Les gates F et G restent bloquées.

5. Captures et corrections artistiques
Captures jointes : ordinateur et mobile, fille et garçon. Repères : cadre vert = décor, rouge = personnage, jaune = sol. Les mesures sont dans `preview_panel_sakura.json`.

Ce qui fonctionne : centre calme (lac et Fuji), silhouette bien lisible, gemme de rang lisible en haut à droite. Sur mobile, le torii et la guitare sont rognés, comme prévu.

Corrections proposées pour une V2 (même composition, même format) :
1. Coin haut-gauche (x 0 à 420, y 0 à 170) : cerisiers plus sombres ou moins denses, par exemple une branche en contre-jour, pour que le niveau en blanc reste lisible sans dépendre du voile.
2. Le fichier m'est arrivé en WebP, donc compressé avec perte. Il me faut le PNG original sans perte.
3. Facultatif : abaisser la rambarde d'environ 15 px, pour que le personnage paraisse sur le ponton plutôt que collé à la rambarde.
4. La guitare posée à gauche : à garder ou à retirer ? Elle pourrait se confondre avec la guitare équipée plus tard. Ma recommandation est de la garder.

Retour attendu — Tiki-taka n°3
* Soit « Sakura APPROVED » tel quel. Dans ce cas, livre directement `panel_bg_cyberpunk.png` selon les mêmes règles : 1400 × 620 opaque, sol à y ≈ 558, centre calme, coin haut-gauche sombre, éléments forts dans la bande x 252 à 1148 seulement s'ils peuvent être rognés sur mobile, aucun texte lisible.
* Soit `panel_bg_sakura.png` V2, avec les corrections ci-dessus.
* Dans les deux cas : un fichier PNG joint, jamais un lien.
