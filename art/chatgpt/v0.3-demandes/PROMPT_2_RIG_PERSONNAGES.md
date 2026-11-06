Bonjour ! Tu es directeur artistique de Guitar Leveling. Les masters `boy_base.png` et `girl_base.png` (joints) sont validés et intégrés dans l'app. Ce sont des images **aplaties** : pour animer les personnages (respiration, célébration, jouer de la guitare), il me faut une **version découpée en calques** de chacun.

## Pièces jointes
- `boy_base.png`, `girl_base.png` : les masters à respecter **exactement** (visage, proportions, couleurs, tenue).
- `master-characters-APPROVED.png` : référence de style.

## Ce qu'il me faut, pour chaque personnage
**A. Un dossier de PNG séparés**, tous en **1024 × 1280, fond transparent, même canevas que le master** (le personnage reste exactement au même endroit, pieds au point x=512, y=1170). Quand on empile tous les calques, on doit retrouver le master à l'identique.

Calques (noms exacts, préfixés `boy_` ou `girl_`) :
`back_hair, front_hair, head, eyes_open, eyes_closed, mouth, neck, torso, top_back, top_front, upper_arm_L, upper_arm_R, forearm_L, forearm_R, hand_L, hand_R, hips, thigh_L, thigh_R, calf_L, calf_R, shoe_L, shoe_R, headphones_back, headphones_front` (garçon) — pour la fille, remplace `headphones_*` par `hair_ribbon` et `clef_pin`.

**Important** : redessine les parties cachées (le haut du bras sous la manche, le cou sous les cheveux, le torse derrière les bras…), sinon on verra des trous quand un membre bouge.

**B. Un fichier de pivots** `boy_pivots.json` / `girl_pivots.json` : pour chaque calque, le point de rotation en pixels sur le canevas 1024 × 1280, par exemple `{"forearm_R": {"pivot": [598, 540], "parent": "upper_arm_R"}}`.

**C. Si possible**, le fichier source multicouche `boy_rig_source.psd` / `girl_rig_source.psd` (ou .kra).

## Règles
- Ne change ni le visage ni les proportions des masters.
- Pas de version simplifiée ou vectorielle : même qualité d'illustration.
- Bras légèrement écartés comme sur le master (c'est la pose de référence).

## Livraison
Commence par **le garçon uniquement** : le dossier de calques + le fichier de pivots. Vérifie qu'en superposant les calques tu retrouves exactement `boy_base.png`. Dis-moi ce qui a été redessiné et ce qui n'a pas pu l'être.
