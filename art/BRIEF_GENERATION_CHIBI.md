# Produire les chibis de la planche de DA avec un générateur d'images

Claude Code ne dessine pas de personnages. Ce brief sert à les faire produire par un générateur d'images
(ChatGPT, Midjourney, Leonardo, Ideogram, Figma AI…), puis Claude les contrôle et les intègre.

## Règles valables pour tout
- **Références à joindre à chaque génération** : `handoff_art/brief-2026-11-15/planche_DA_pack_assets_heros.png`,
  `public/characters/boy_base.png` (Rémi) et `public/characters/girl_base.png` (Mélodie).
- **Format** : PNG, fond **transparent**, **1024 × 1280**, personnage entier **centré**, pieds sur la ligne **y = 1170**,
  même taille que le master (tête ≈ 330 px de large). Un gabarit est dans `art/chatgpt/v0.8.1-perso-guitare/pieces-jointes/gabarit_*_guitare_1024x1280.png`.
- **Un seul personnage par image**, aucun texte, aucun décor, aucune ombre au sol, aucun cadre.
- Nom de fichier exact (voir listes). Envoyer les fichiers dans `art/incoming/` ou en zip à Claude.
- Un générateur ne produit **pas de calques** : on demande des **images complètes**. Les « options » (coiffures, tenues)
  sont donc des rendus complets du personnage, pas des pièces détachables. C'est suffisant pour 2–3 options par élément.

## Lot 1 — poses (le plus utile, commencer par là)
Pour `boy` puis `girl`, 7 images :
| Fichier | Contenu |
|---|---|
| `boy_idle.png` | debout, détendu, tenue de base (= master, pose légèrement différente) |
| `boy_guitar_hold.png` | guitare acoustique **tenue en position de jeu**, main gauche sur le manche, main droite sur les cordes |
| `boy_guitar_strum_01.png` … `_04.png` | boucle de grattage en 4 images : main droite haute, milieu descendant, basse, milieu remontant ; tout le reste identique |
| `boy_success.png` | poing levé, grand sourire (case « Succès » de la planche) |
Même liste pour `girl_*`.

## Lot 2 — personnalisation (2–3 options par élément, rendus complets)
| Fichier | Contenu |
|---|---|
| `boy_hair_blue.png`, `boy_hair_white.png` | tenue de base, coiffure bleu nuit / blanche (planche « Coiffures ») |
| `boy_top_purple.png`, `boy_top_red.png` | coiffure de base, veste violette / rouge (planche « Hauts ») |
| `boy_shoes_red.png`, `boy_shoes_purple.png` | baskets rouges / violettes |
| `boy_acc_headphones.png`, `boy_acc_goggles.png`, `boy_acc_beanie.png` | casque doré / lunettes d'aviateur / bonnet |
Même liste pour `girl_*` (coiffures : bleu nuit, blanche ; les yeux changent avec la coiffure si besoin).
Chaque image : la pose **idle**, strictement identique au master à part l'élément changé.

## Lot 3 — icônes d'objets (boutique)
Fond transparent, **512 × 512**, un objet centré : 4 guitares (`icon_guitar_acoustic.png`, `_red.png`, `_amethyst.png`, `_crystal.png`),
accessoires, hauts, chaussures de la planche. Noms : `icon_<type>_<variante>.png`.

## Prompt à coller (adapter boy/girl et la pose)
> Personnage chibi 2D, style jeu mobile « anime cartoon » façon Postknight : proportions 2,4 têtes, grosse tête, grands yeux,
> contours sombres épais, aplats de couleur avec ombrage simple en deux tons, aucun dégradé réaliste.
> Reproduire EXACTEMENT le personnage de l'image de référence jointe (même visage, mêmes cheveux bruns ébouriffés avec le casque
> audio autour du cou, même veste crème et bordeaux, même pantalon bleu nuit, mêmes baskets), vu de face, corps entier, pieds visibles.
> Pose : [tient une guitare acoustique en position de jeu, main gauche sur le manche, main droite au-dessus des cordes, sangle sur l'épaule].
> Fond entièrement transparent, aucun décor, aucun texte, aucune ombre au sol. Image verticale 1024 × 1280, personnage centré,
> occupant environ 85 % de la hauteur.

Pour Mélodie : « jeune fille, cheveux corail en queue de cheval haute avec ruban et barrette clé de sol, veste crème, jupe plissée
bleu nuit, chaussettes hautes, baskets ».

## Ce que Claude vérifie à la réception
Taille 1024 × 1280, transparence réelle, pieds à y ≈ 1170 (recalage automatique possible de ± 60 px), fidélité au master
(comparaison visage et palette), scintillement entre images d'une boucle. Ce qui échoue est renvoyé avec la raison précise.

## Conversations conseillées (un chantier par conversation)
1. **Art chibi** : produire et faire valider les lots 1 → 3 (ce brief).
2. **Décors** : Cyberpunk et Ombre au format Sakura (1400 × 620, sol à 90 %, voir `scripts/check_panel_bg.py`).
3. **Interface** : passer tous les écrans au style de l'accueil (quêtes en superposition, donjons, répertoire, profil).
4. **Progression** : échelle F → SSS sur 200 niveaux (décision D-042), quêtes quotidiennes / hebdo / mensuelles, clés de portail.
5. **Pratique** : lancer un exercice ou un morceau avec minuteur et métronome, journal de pratique.
Phrase de départ pour chaque conversation : « Lis CLAUDE.md et docs/DECISION_LOG.md, puis travaille uniquement sur le chantier <n°> ».
