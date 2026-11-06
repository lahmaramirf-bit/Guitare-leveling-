# Briefs à coller dans ChatGPT (production des assets)

> Mode d'emploi : **un brief = une conversation ChatGPT** (ou un message), en joignant **toujours** `handoff/assets/reference/master-characters-APPROVED.png` comme référence. Récupère les PNG, renomme-les comme indiqué, dépose-les dans `art/incoming/`, puis dis-moi « assets déposés ». Je vérifie (dimensions, transparence, alignement) et j'intègre.
>
> Limite connue : un générateur d'images ne garantit **pas** un alignement au pixel entre deux images. Les pièces (coiffure, haut…) devront probablement être recalées ou détourées à la main (Krita/Photoshop, ou un illustrateur). Je te dirai précisément lesquelles après contrôle.

---

## Brief 1 — Master plein pied du garçon (P0)

```
Avec l'image jointe comme référence de style ABSOLUE, dessine uniquement le garçon brun (cheveux bruns ébouriffés, casque audio autour du cou, veste d'académie bleu nuit/crème/bordeaux à détails dorés).
Contraintes :
- Plein pied, vue de face, pose neutre debout, bras légèrement écartés du corps (pour pouvoir changer de haut ensuite), sans guitare ni étui ni sac.
- Style chibi anime identique à la référence : ~2,4 têtes de haut, contours nets, ombrage doux.
- Fond 100 % transparent (PNG), aucun décor, aucune ombre au sol.
- Format portrait 1024 × 1280 px. Personnage centré horizontalement, pieds posés à 110 px du bas, tête à environ 80 px du haut.
- Ne change NI le visage, NI la coiffure, NI les couleurs de la référence.
```
Fichier : `boy_base.png`

## Brief 2 — Master plein pied de la fille (P0)

```
Avec l'image jointe comme référence de style ABSOLUE, dessine uniquement la fille aux cheveux rose corail (queue de cheval haute, barrette en forme de clé de sol, petit chapeau/nœud noir et blanc, veste d'académie bleu nuit/crème à touches corail, jupe plissée bleu nuit).
Mêmes contraintes que pour le garçon : plein pied, face, pose neutre, bras légèrement écartés, sans guitare ni sac, chibi ~2,4 têtes, PNG transparent 1024 × 1280, centrée, pieds à 110 px du bas, même échelle que le garçon.
Ne change NI le visage, NI la coiffure, NI les couleurs de la référence.
```
Fichier : `girl_base.png`

> ⚠️ Valide ces deux masters (côte à côte avec la planche) **avant** de lancer les briefs suivants : toutes les pièces seront calées dessus.

## Brief 3 — Guitares (4 fichiers, plus simples à aligner)

```
D'après la référence jointe (section « Guitares (skins) »), dessine UNE guitare seule, sur fond transparent, format 1024 × 1280, inclinée à 30° comme si elle était tenue en bandoulière par un personnage chibi de face (manche vers le haut à droite), même style que la référence.
Guitare : [acoustique bois clair | électrique rouge et blanche | électrique violette à motifs dorés (épique) | électrique en cristal bleu lumineux (légendaire)].
```
Fichiers : `guitar_study.png`, `guitar_red_electric.png`, `guitar_amethyst.png`, `guitar_crystal.png`

## Brief 4 — Décors des 3 thèmes (sans personnage)

```
D'après la référence jointe (section « Environnements (3 thèmes principaux) »), dessine le décor [Sakura : torii rouge, mont Fuji, cerisiers, lanterne | Cyberpunk : ville néon de nuit, enseigne guitare, pluie | Ombre : scène de concert sombre, projecteurs violets, clé de sol lumineuse].
Style illustration anime chaleureuse identique à la référence. AUCUN personnage, aucun texte.
Format paysage 1920 × 1080, avec la zone centrale basse plus calme (un personnage y sera posé).
```
Fichiers : `bg_sakura.png`, `bg_cyberpunk.png`, `bg_ombre.png` (+ en option une version 1080 × 1920 pour mobile : `bg_<theme>_mobile.png`)

## Brief 5 — Pièces de tenue (après validation des masters)

```
Je joins le master [boy_base.png / girl_base.png]. Redessine EXACTEMENT le même personnage, même pose, même cadrage 1024 × 1280, même position, mais ne garde QUE [la coiffure « Mèches argentées » | le haut « Blouson Scène Urbaine » violet | …] : tout le reste (corps, visage, autres vêtements) doit être transparent.
```
Fichiers : `<avatar>_<slot>_<id>.png`, ex. `boy_hair_silver.png`, `girl_top_urban_purple.png` (ids : voir `src/game/catalog.ts`).

---

## Ce que je vérifie à chaque dépôt
- PNG avec canal alpha, 1024 × 1280 (personnages/pièces) ou 1920 × 1080 (décors).
- Fond réellement transparent (pas de damier « dessiné », pas de halo blanc).
- Fidélité visuelle avec la planche approuvée (validation finale : **toi**).
- Alignement des pièces sur le master (superposition automatique + capture).
