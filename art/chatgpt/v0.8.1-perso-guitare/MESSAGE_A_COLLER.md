Guitar Leveling — Tiki-taka n°10 → ChatGPT
Nouveau besoin du fondateur : le personnage TIENT sa guitare et en JOUE quand on le touche

Côté app, c'est déjà fait et testé (v0.8). Quand on touche le personnage sur l'accueil, l'app joue un vrai accord de guitare synthétisé (G, puis Em, C, D), affiche le nom de l'accord et fait s'envoler des notes (capture jointe). Il ne manque que les **images** du personnage guitare en main. Dès qu'elles arrivent, l'app les enchaîne automatiquement (12 images/s), sans autre développement.

On choisit des **images clés** plutôt qu'un rig : c'est plus simple à produire pour toi, et je peux les intégrer directement.

## À livrer (commencer par UN personnage, puis l'autre)
Pour `girl` (puis `boy`), 7 PNG **transparents**, **1024 × 1280**, même cadrage que les masters joints :
1. `girl_guitar_hold.png` : le personnage au repos, **guitare acoustique tenue en position de jeu**. Main gauche sur le manche, main droite au-dessus des cordes, sangle à l'épaule.
2. `girl_guitar_strum_01.png` à `girl_guitar_strum_06.png` : un aller-retour de grattage, en boucle.
   * 01 : main droite haute (comme `hold`) ;
   * 02 et 03 : la main descend à travers les cordes ;
   * 04 : main basse ;
   * 05 et 06 : la main remonte.
   * Seuls la main droite, l'avant-bras droit et, légèrement, la tête et les cheveux bougent (petit mouvement de rythme). Tout le reste est **identique pixel pour pixel d'une image à l'autre**, sinon l'animation scintille.

## Règles strictes (sinon je ne peux pas intégrer)
* **Même personnage que les masters** : visage, coiffure, couleurs, tenue, proportions chibi, style de trait. Les masters `boy_base.png` / `girl_base.png` ne doivent pas être modifiés ; ces images sont de **nouveaux** fichiers.
* **Même cadrage exact** : canevas 1024 × 1280, pieds sur la ligne y = 1170, personnage centré sur x = 512, même taille que le master. Les gabarits joints montrent le master en transparence, la ligne de sol et la zone de la guitare.
* Fond **transparent** (PNG RGBA), aucun décor, ombre ou texte.
* Guitare acoustique simple, en bois naturel (guitare de départ), entièrement visible, aucune partie hors du canevas.
* Livrer en **fichiers PNG joints** (ou un ZIP), jamais un lien.

## Ce que je vérifie à la réception
* Taille, transparence, pieds à y = 1170 et centrage, sur les 7 images.
* Scintillement : différence entre images consécutives hors de la zone du bras droit.
* Fidélité au master : visage et tenue comparés.
* Puis je t'envoie la capture et une courte vidéo de l'animation dans l'app.

## Si la cohérence parfaite entre images est impossible pour toi
Dis-le franchement et livre au minimum **3 images** : `hold`, `strum_02` (main au milieu) et `strum_04` (main basse). J'en ferai une animation plus simple. Ou bien livre seulement `hold`, et je l'afficherai fixe, avec les notes et le son à chaque toucher.

## Rappel du reste
* Sakura : V1 active, V3 candidate. Le fondateur doit encore choisir. Pas de nouvelle variante demandée.
* Cyberpunk et Ombre : après le choix de Sakura.
* Icône de l'app : toujours utile (PNG 1024 × 1024, sans texte), pas urgent.
