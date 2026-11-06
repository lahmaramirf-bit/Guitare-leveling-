Bonjour ! Retour de Claude Code sur le panneau personnage compact de Guitar Leveling. Le panneau est implémenté et mesuré ; les captures jointes utilisent encore un **décor provisoire flou** (le PNG Sakura n'est pas encore intégré). Voici comment ton décor `panel_bg_*.png` sera affiché, pour que Sakura (et plus tard Cyberpunk / Ombre) fonctionne du premier coup.

## Pièces jointes
- `gabarit_panel_1400x620.png` : zones à respecter (ne pas dessiner les cadres).
- `preview_panel_sakura_desktop_PROVISOIRE.png` / `_mobile_PROVISOIRE.png` : le panneau réel avec les rectangles mesurés.
- `preview_panel_sakura_PROVISOIRE.json` : les mesures exactes.
- `girl_base.png`, `boy_base.png` : masters (inchangés).
- `current-home-guitar-leveling.png` : la capture d'origine dont s'inspire le panneau.

## Mesures réelles dans l'app
| | Ordinateur (≥ 761 px) | Mobile (≤ 760 px, testé à 390 × 844) |
|---|---|---|
| Panneau décor affiché | 1056 × 468 px (ratio 1400:620 exact) | 334 × 230 px (hauteur fixe) |
| Cadrage du décor | image entière | **seulement les 64 % centraux en largeur** (≈ x 252 → 1148 sur l'image), côtés rognés |
| Personnage visible | ≈ 176 × 363 px (fille), 77 % de la hauteur du décor | ≈ 87 × 179 px, 78 % |
| Pieds / sol | y = 90 % de la hauteur (y = 558 px sur l'image 1400 × 620) | idem |
| Incrustations | « Niv. 1 + titre » en haut à gauche (~0–310 × 0–130 px sur l'image), losange de rang en haut à droite (~1290–1400 × 0–110) | idem, titre masqué |

## Ce que je te demande pour `panel_bg_sakura.png` (et les suivants)
1. **Sol plat et horizontal à y ≈ 558 px** (90 %) au centre : les pieds du héros s'y posent.
2. **Zone du héros** (x ≈ 560 → 840, y ≈ 70 → 558) calme et peu contrastée : pas de tronc, de poteau de torii ni de lanterne derrière lui.
3. **Éléments identitaires** (torii, cerisiers, montagne, touche musicale) entre x ≈ 252 et 560, et entre 840 et 1148 : ils restent visibles sur mobile. Les bords (0–252 et 1148–1400) sont rognés sur téléphone : n'y place rien d'essentiel.
4. Coins haut-gauche et haut-droite assez simples pour du texte blanc et le losange de rang.
5. PNG opaque, 1400 × 620, sans personnage, texte ni interface.

## Ta réponse attendue
- Ton évaluation du Sakura actuel au regard de ces 5 points (conforme / à corriger, et quoi).
- Si correction nécessaire : la version corrigée `panel_bg_sakura.png`, **en fichier téléchargeable dans la conversation** (pas de lien Adobe).
- Ne lance pas Cyberpunk ni Ombre avant que le fondateur ait validé Sakura dans l'app.
