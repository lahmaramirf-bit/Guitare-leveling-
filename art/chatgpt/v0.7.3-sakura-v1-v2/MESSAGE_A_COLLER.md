Guitar Leveling — Tiki-taka n°4 → ChatGPT
Comparatif Sakura V1 / V2 dans l'application réelle

Sakura V2 est intégré **à côté** de la V1, sans l'écraser. Les deux sont au statut CANDIDATE et aucune n'est marquée APPROVED. La V1 reste le décor affiché par défaut. La V2 n'apparaît qu'en mode test (`?panel=v2`).

1. Décisions prises
* D-030 : `panel_bg_sakura_v2.png` ajouté comme variante candidate, et V1 conservée comme version de référence et décor actif.
* D-031 (recommandation, décision finale au fondateur) : **garder V1 et produire une V3 qui retouche la V1**, plutôt qu'adopter V2. Arguments au point 5.
* Masters `boy_base.png` / `girl_base.png` : SHA-256 identiques à tes références `*_APPROVED.png`, aucune modification.

2. Intégré et testé
* Contrôle des deux PNG : 1400 × 620, opaques, résultat OK.
* Captures réelles V1 et V2 : garçon et fille, ordinateur (1280 px) et mobile (390 px).
* Pieds :
  * ordinateur : 89,7 % de la hauteur du décor ;
  * mobile : 90,4 % ;
  * soit y ≈ 556–560 sur 620 pour les deux versions.
* Personnage entier et non déformé dans les 8 cas.
* Tests :
  * 36/36 unitaires, dont 3 nouveaux : V1 par défaut, aucune version approuvée, fichiers locaux ;
  * 40/40 de bout en bout, 0 erreur de contrat ;
  * XP, quêtes, entraînements et boutique : inchangés.

3. Fichiers modifiés
`public/art/panel/panel_bg_sakura_v2.png` (nouveau), `src/appearance/worlds.ts` (variantes de décor), `src/appearance/worlds.test.ts` (nouveau), `src/screens/Hub.tsx`, `scripts/check_panel_bg.py` (accepte `_vN`), `e2e/preview-panel.mjs` (capture d'une variante), `docs/contracts/asset-manifest.json`, `docs/DECISION_LOG.md`, `docs/QA_REPORT.md`.

4. Assets manquants et raisons
* Cyberpunk et Ombre : en attente de la validation finale de Sakura (règle du projet).
* Guitares : aucun fichier en calques livré.
* Rig et animations : aucun calque découpé ni pivot livré. Le placeholder actuel (léger flottement du PNG entier) n'est pas un rig.
* Gates F (équipement) et G (animation) : BLOQUÉES.

5. Comparatif objectif V1 / V2 (captures `compare_sakura_v1_v2_*.png` jointes)
| Critère | V1 | V2 |
|---|---|---|
| Lisibilité du niveau (coin haut-gauche) | clair et chargé (luminance 151, σ 62) ; compensé par un voile sombre dans l'app | **excellent** : sombre et uni (74, σ 13) |
| Gemme de rang (coin haut-droit) | **bonne** : sur le ciel (109, σ 47) | moins bonne : sur des cerisiers clairs (147, σ 56) |
| Contact des pieds | **plancher en bois avec profondeur** : le personnage est *dans* la scène | arête d'un muret vu de face : pas de surface de sol, le personnage semble posé sur un rebord |
| Zone du personnage | **calme** (σ 36,8) | un peu plus chargée (σ 42,3). Le sommet du Fuji est pile derrière le buste et la tête, ce qui crée une tangente sur mobile |
| Cohérence de style avec les masters | **peint, cel-shading proche** des personnages | aplats, ciel en bandes horizontales, rendu proche du **pixel art**. Rupture avec les masters lissés : le personnage paraît collé |
| Guitare décorative | présente (rognée sur mobile) | **absente** |
| Qualité du fichier | WebP converti (avec perte) | **PNG natif** |

**Recommandation pour une app d'entraînement musical : V1**, retouchée en **V3**. V2 ne gagne que sur deux points, tous deux corrigeables sur V1. Elle perd sur l'essentiel : la cohérence de style avec les personnages, le sol, et la gemme.

Demande — Sakura V3 (retouche de la V1, ne pas redessiner) :
1. Partir de la V1 (capture `preview_panel_sakura_desktop.png` jointe, ou ton fichier source), en gardant style, palette, ponton, rambarde, lac, Fuji et torii.
2. Coin haut-gauche (x 0 à 420, y 0 à 170) : branches de cerisier plus sombres ou plus clairsemées, en contre-jour, pour viser une luminance moyenne ≤ 100.
3. Retirer la guitare posée à gauche, et la remplacer par la continuité de la rambarde et du ponton.
4. Garder le ciel derrière la gemme (coin haut-droit) dégagé.
5. Pas de bandes de couleur, pas de pixel art : même rendu peint que la V1.
6. PNG 1400 × 620 opaque, **sans perte**, nommé `panel_bg_sakura_v3.png`, en fichier joint et non en lien.

Prochaines demandes artistiques (à lancer après validation de Sakura par le fondateur, dans cet ordre)
A. **Cyberpunk** `panel_bg_cyberpunk.png` : même gabarit que Sakura. Toit-terrasse ou passerelle avec un vrai plancher en perspective à y ≈ 558, centre calme (ville floue au loin), coin haut-gauche sombre, coin haut-droit dégagé, aucun texte lisible sur les néons, même rendu peint.
B. **Ombre** `panel_bg_ombre.png` : mêmes règles. Scène de concert gothique-fantasy, plancher de scène en perspective.
C. **Guitares** (premier lot : 1 guitare de départ). Calques PNG transparents sur le canevas des masters, 1024 × 1280, sol à (512, 1170), alignés sur la pose de `boy_base` puis de `girl_base` :
   * `guitar_strap_back`, `guitar_back` (derrière le corps) ;
   * `guitar_body_front` (devant) ;
   * plus les ancrages `shoulder_strap`, `left_hand_neck`, `right_hand_strum` et `guitar_neck_angle` en coordonnées pixel (JSON).
D. **Rig** (après les guitares). Calques découpés de chaque master sur le même canevas : tête, buste, bras haut et bas, mains (`left_hand_over_neck`, `right_hand_over_strings`), jambes. Avec pour chacun un pivot (x, y) en JSON, et les zones masquées repeintes. Les deux PNG aplatis actuels ne suffisent pas : c'est une production dédiée.
