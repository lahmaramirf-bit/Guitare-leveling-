# Prompts ChatGPT — chantier 1 (art chibi)

Joindre à CHAQUE message : `planche_DA_pack_assets_heros.png`, `boy_base.png`, `girl_base.png`.
Télécharger chaque image en PNG et la nommer exactement comme indiqué.

## PROMPT 0 — cadrage du style (à envoyer une fois, en premier)
Tu es l'illustrateur de Guitar Leveling, une application d'entraînement à la guitare. Les trois images jointes sont la direction artistique **verrouillée** : une planche de style et les deux personnages officiels, Rémi (garçon, cheveux bruns ébouriffés, casque audio autour du cou, veste crème et bordeaux, pantalon bleu nuit, baskets) et Mélodie (fille, cheveux corail en queue de cheval haute avec ruban et barrette clé de sol, veste crème, jupe plissée bleu nuit, chaussettes hautes, baskets).
Style : chibi 2D « anime cartoon » façon jeu mobile, proportions 2,4 têtes, grosse tête, grands yeux, contours sombres épais, aplats avec ombrage simple en deux tons, aucun dégradé réaliste, aucun rendu 3D.
Pour toutes les images que je vais te demander : reproduire EXACTEMENT ces personnages (visage, coiffure, tenue, couleurs), un seul personnage par image, vu de face, corps entier, pieds visibles, **fond entièrement transparent**, aucun décor, aucun texte, aucune ombre au sol. Image verticale 1024 × 1280, personnage centré, occupant environ 85 % de la hauteur, pieds posés vers le bas de l'image.
Pour commencer, génère Rémi debout, détendu, exactement comme la référence, pour vérifier que tu as bien le style. Nom du fichier : `boy_idle.png`.

## Lot 1 — poses (Rémi puis Mélodie)
Même consigne de style et de format qu'au PROMPT 0. Pose demandée : [POSE]. Nom du fichier : [NOM].

| [NOM] | [POSE] |
|---|---|
| `boy_guitar_hold.png` | tient une guitare acoustique en bois naturel en position de jeu : main gauche sur le manche, main droite au-dessus des cordes, sangle sur l'épaule, sourire léger |
| `boy_guitar_strum_01.png` | même image que `boy_guitar_hold.png`, main droite en haut des cordes, prête à gratter ; tout le reste strictement identique |
| `boy_guitar_strum_02.png` | identique, main droite au milieu des cordes en descendant |
| `boy_guitar_strum_03.png` | identique, main droite en bas des cordes |
| `boy_guitar_strum_04.png` | identique, main droite au milieu des cordes en remontant |
| `boy_success.png` | poing droit levé, grand sourire, yeux fermés de joie (case « Succès » de la planche) |
| `boy_levelup.png` | bras légèrement écartés, regard vers le haut, sourire, comme illuminé (case « Niveau + ») |

Mélodie : mêmes lignes avec `girl_` à la place de `boy_`, et « Mélodie » à la place de « Rémi ». Pour la boucle de grattage, précise à chaque fois : « garde la même image que `girl_guitar_hold.png`, seule la main droite bouge ».

Si ChatGPT change la tenue ou le visage : « Non : reprends exactement le visage, la coiffure et la tenue de l'image de référence jointe, ne change que la pose. »

## Lot 2 — personnalisation (rendus complets, pose debout)
Même consigne de style et de format. Rémi debout, pose identique à `boy_idle.png`, en changeant UNIQUEMENT [ÉLÉMENT]. Nom du fichier : [NOM].

| [NOM] | [ÉLÉMENT] |
|---|---|
| `boy_hair_blue.png` | la coiffure : cheveux bleu nuit ébouriffés (planche « Coiffures », 2ᵉ) |
| `boy_hair_white.png` | la coiffure : cheveux blancs ébouriffés (planche « Coiffures », 3ᵉ) |
| `boy_top_purple.png` | la veste : veste violette à capuche (planche « Hauts », 2ᵉ) |
| `boy_top_red.png` | la veste : veste rouge à capuche (planche « Hauts », 3ᵉ) |
| `boy_shoes_red.png` | les chaussures : baskets rouges |
| `boy_shoes_purple.png` | les chaussures : baskets violettes |
| `boy_acc_headphones.png` | ajoute un casque audio doré sur la tête |
| `boy_acc_goggles.png` | ajoute des lunettes d'aviateur relevées sur le front |
| `boy_acc_beanie.png` | ajoute un bonnet bleu nuit avec écusson doré |

Mélodie : mêmes lignes avec `girl_` ; pour les coiffures, garder la queue de cheval, le ruban et la barrette, changer seulement la couleur (bleu nuit, blanc).

## Lot 3 — icônes de boutique
Icône d'objet pour une boutique de jeu mobile, même style que la planche jointe (contour épais, aplats, petite étoile de brillance). Un seul objet, centré, **fond transparent**, image carrée 512 × 512, aucun texte. Objet : [OBJET]. Nom : [NOM].

| [NOM] | [OBJET] |
|---|---|
| `icon_guitar_acoustic.png` | guitare acoustique en bois naturel |
| `icon_guitar_red.png` | guitare électrique rouge à plaque blanche |
| `icon_guitar_amethyst.png` | guitare électrique violette à motifs dorés |
| `icon_guitar_crystal.png` | guitare électrique bleu cristal translucide |
| `icon_acc_headphones.png` | casque audio doré |
| `icon_acc_goggles.png` | lunettes d'aviateur dorées |
| `icon_acc_cap.png` | casquette bleu nuit à note dorée |
| `icon_acc_scarf.png` | écharpe violette |
| `icon_acc_clef.png` | pendentif clé de sol doré |
| `icon_acc_wings.png` | petites ailes blanches et dorées |
