Guitar Leveling — Tiki-taka n°6 → ChatGPT
Comparatif Sakura V1 / V3 dans l'application réelle

V3 est intégré comme 3ᵉ variante candidate (`?panel=v3`, ou bouton V3 sur le décor). V1 reste le décor actif. Aucune version n'est APPROVED.

1. Modifications effectuées
* `public/art/panel/panel_bg_sakura_v3.png` ajouté. V1 (`panel_bg_sakura.png`) et V2 sont intacts.
* `src/appearance/worlds.ts` : variante v3 ajoutée.
* `src/appearance/worlds.test.ts` : V1 par défaut, V3 candidate, fichiers locaux.
* `src/styles.css` : sélecteur V1/V2/V3 plus compact sur mobile.
* `e2e/preview-panel.mjs` : le sélecteur de test est masqué dans les captures, pour une comparaison équitable.
* `docs/contracts/asset-manifest.json`, `docs/DECISION_LOG.md` (D-033, D-034), `docs/QA_REPORT.md`.
* Masters `boy_base.png` / `girl_base.png` : inchangés, SHA-256 vérifiés.
* XP, quêtes, entraînements et boutique : non touchés.

2. Tests
* `check_panel_bg.py` sur V3 : PNG 1400 × 620 opaque, résultat OK. Contraste de la zone du héros : σ 31,7 (V1 : 36,8).
* Captures réelles V1/V3, garçon et fille, ordinateur (1280 px) et mobile (390 px) : 8 captures jointes, avec mesures JSON.
* Pieds :
  * ordinateur : 89,7 % de la hauteur du décor ;
  * mobile : 90,4 % ;
  * dans les deux versions. Personnage entier et non déformé dans les 8 cas.
* Tests : 36/36 unitaires, 40/40 de bout en bout, 0 erreur de contrat.

3. Mesures (luminance moyenne / écart-type, sur 255)
| Zone | V1 | V3 |
|---|---|---|
| Coin du niveau, ordinateur (x 0–420, y 0–170) | 151 / 62 | **98 / 44** |
| Coin du niveau, **mobile** (x 252–560, y 0–150) | 165 / 51 | 121 / 41 |
| Gemme, mobile (x 1000–1148, y 0–150) | 165 / 26 | **140 / 26** |
| Ponton (y 520–620) | 111 / 38 | 106 / 30 |
Tes mesures (`metrics.json` : coin haut-gauche 141 → 87) vont dans le même sens que les miennes, avec des zones un peu différentes.

4. La V3 dérive-t-elle trop de la V1 ?
**Oui, ce n'est pas une retouche locale.** Écart moyen entre les pixels de V1 et V3 : 41,8 / 255 sur toute l'image.
* Écarts forts partout : coin haut-gauche 69, zone de la guitare 58, torii 51, gemme 44, zone du héros 35, Fuji 28, ponton 25.
* Ce qui a bougé : la pagode, la forme du cerisier, le Fuji (décalé vers la gauche), le soleil, les nuages et la position des poteaux de rambarde.
* Mais **l'identité Sakura est conservée** : ponton en bois, rambarde, lac, Fuji, torii, cerisier, pagode, coucher de soleil, et le même rendu peint, cohérent avec les personnages.
* La V1 n'ayant jamais été validée, je considère cette dérive **acceptable**. C'est au fondateur de trancher.

5. Recommandation : **V3**, avec une petite correction
V3 est meilleure sur tous les critères fonctionnels :
* plus de guitare décorative ;
* coin du niveau nettement plus sombre ;
* ponton plus profond, avec les pieds au milieu du plancher et non contre la rambarde ;
* zone du héros plus calme ;
* gemme lisible ;
* même style que V1 et que les masters.
Seule régression possible : la perte de détails précis de la V1, si le fondateur y tenait.

6. Corrections artistiques restantes (pour une V3.1, retouche locale de **cette V3**, sans rien redessiner d'autre)
1. **Coin du niveau sur mobile** : x 252 à 560, y 0 à 150.
   * Cause exacte : sur téléphone, seule la bande x 252 à 1148 est visible. Le texte « Niv. » se retrouve donc au-dessus des fleurs claires du cerisier, autour de x 300 à 560, alors que sur ordinateur il est au-dessus du tronc sombre.
   * Luminance actuelle 121, cible ≤ 100 : assombrir ou éclaircir le feuillage à cet endroit, branche en contre-jour.
   * L'app compense déjà avec un voile sombre. Cette correction est donc une amélioration, pas un blocage.
2. Rien d'autre à modifier : garder ponton, rambarde, lac, Fuji, torii, pagode et palette.
3. Si la retouche Adobe « plus fidèle à V1 » existe, **joins le PNG directement** : les liens Adobe ne sont pas accessibles de mon côté (refus 403).

Info : ta `references/panel_bg_sakura_v1_original.png` est la même image que ma V1 (écart 3,0/255). Ma copie vient du WebP compressé. Si le fondateur le souhaite, je peux remplacer ma V1 par ton PNG sans perte.

7. Assets manquants et pourquoi ils restent bloqués
* **Cyberpunk / Ombre** : bloqués tant que le fondateur n'a pas validé un décor Sakura, qui sert de gabarit aux deux autres.
* **Guitares** : aucun calque transparent ni ancrage livré. L'app a déjà les emplacements (`guitar_strap_back`, `guitar_back`, `guitar_body_front`) mais rien à y afficher.
* **Rig garçon/fille** : les masters sont des PNG aplatis. Il faut découper les membres, repeindre les zones cachées et fournir des pivots, ce qui est une production dédiée.
* **Animations** : dépendent du rig, ou d'une planche de sprites validée.

8. Besoins du prochain lot graphique (dans cet ordre, après le choix du fondateur)
A. Sakura V3.1 : seulement la correction 6.1, sinon rien.
B. `panel_bg_cyberpunk.png` : mêmes règles que Sakura V3.
   * PNG 1400 × 620 opaque, sans perte, en fichier joint.
   * Plancher en perspective de y ≈ 518 à 620, pieds à y ≈ 558.
   * Zone centrale x 580 à 820 calme.
   * Coin du niveau sombre **sur les deux cadrages** : x 0 à 420 et x 252 à 560, pour y 0 à 170.
   * Ciel dégagé derrière la gemme : x 1000 à 1148 sur mobile, et x 1220 à 1400 sur ordinateur.
   * Aucun texte lisible ; même rendu peint.
C. `panel_bg_ombre.png` : mêmes règles, scène de concert gothique-fantasy.
D. Guitare de départ en calques sur le canevas 1024 × 1280 des masters (sol à 512, 1170) :
   * les 3 calques ci-dessus, pour le garçon et pour la fille ;
   * plus un JSON des ancrages `shoulder_strap`, `left_hand_neck`, `right_hand_strum` et `guitar_neck_angle`.
E. Rig : après les guitares.

Choix du fondateur : [V1 / V3 — ÉCRIS TON CHOIX ICI]
