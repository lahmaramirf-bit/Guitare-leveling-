# IMPLEMENTATION PLAN — Intégration progressive de la DA

> Statut : **plan prêt, exécution bloquée sur la réception du code** (cf. `docs/BASELINE_AUDIT.md` §1).
> Hypothèse de travail (à confirmer à l'audit) : l'artefact est un **composant React unique** (cas le plus fréquent des artefacts Claude) avec persistance via le stockage d'artefact. Si c'est du HTML/JS sans framework, la même architecture s'applique en modules ES — seuls les noms de fichiers changent. **Aucune migration de framework** (pas de Next/Flutter).

## 1. Principes

1. **Additif** : on ajoute des modules à côté de l'existant ; aucune logique XP/quêtes/gacha/exercices n'est réécrite.
2. **Découplage** : l'apparence (avatar, thème) ne lit que des **ids** ; la progression ne connaît que des **ids d'items débloqués**. Aucune dépendance de l'XP vers le rendu.
3. **Flags** : tout nouveau rendu est derrière un flag, défaut = comportement actuel.
4. **Données versionnées** : sauvegarde avec `schemaVersion`, migration idempotente, export JSON préalable.
5. **Honnêteté des assets** : un asset `missing`/`reference_only` n'est **jamais** rendu comme équipement ; le renderer chibi refuse de s'activer sans couches `approved`.

## 2. Architecture cible

```
src/
  appearance/
    characterConfig.ts   // types + valeurs par défaut + validation (pur, testable)
    themeConfig.ts       // 3 thèmes : tokens UI + décor (pur)
    assetManifest.ts     // charge/valide docs/contracts/asset-manifest.json
    storage.ts           // adaptateur : stockage artefact → localStorage → mémoire
    migrations.ts        // v0 (save existante) → v1 (ajoute appearance) ; legacy themes → 3 thèmes
    CharacterRenderer.tsx// choisit LegacyPixelAvatar (existant) ou LayeredChibiAvatar
    LayeredChibiAvatar.tsx // empile les couches PNG 1024×1280 selon layerOrder
    AppearancePreview.tsx  // aperçu, visible seulement si flag ?preview=appearance
  flags.ts
```

### Contrats (déjà rédigés, framework-agnostiques)
- `docs/contracts/character-config.schema.json` — `CharacterConfig` sauvegardé :
  `{ schemaVersion, avatarId: "boy"|"girl", hair, top, bottom, accessory, guitar, expression }` (tous des ids, `null` = défaut).
- `docs/contracts/theme-config.schema.json` — `ThemeConfig` : `{ id: "sakura"|"cyberpunk"|"ombre", label, tokens{…couleurs}, background{ status, image } }`.
- `docs/contracts/asset-manifest.json` — état réel des assets (tout `missing`/`reference_only` aujourd'hui) + `layerOrder` + canevas 1024×1280, ancre (512,1170).
- `scripts/validate_contracts.py` — vérifie la cohérence (ids uniques, 3 thèmes exactement, aucun `approved` sans fichier existant, ordre de calques complet).

### CharacterRenderer (règles)
- Entrée : `CharacterConfig` + manifeste. Sortie : pile de `<img>` absolus, même canevas, `z-index` = index dans `layerOrder`.
- Si une couche requise n'est pas `approved` → rendu **legacy** (avatar pixel actuel) + aucun message trompeur.
- Les items cosmétiques déblocables restent gérés par la logique existante (gacha/coffre) ; on ajoute seulement une table `itemId → layerId(s)`.

### ThemeConfig (règles)
- Le thème pose des variables CSS (`--gl-bg`, `--gl-ink`, `--gl-accent`, …) sur la racine ; il ne touche jamais l'échelle de l'avatar.
- Fond de scène : tant que `background.status !== "approved"`, conserver la scène existante du thème le plus proche (pas de crop de planche concept en fond définitif).

## 3. Étapes (courtes, chacune testable et réversible)

| # | Étape | Fichiers touchés | Test / critère | Rollback |
|---|---|---|---|---|
| S0 | Importer le code de l'artefact tel quel dans `legacy-artifact/`, commit « baseline » | nouveaux fichiers seulement | l'app se lance localement (Vite minimal si c'est un artefact React) | `git revert` |
| S1 | Baseline : captures desktop 1340px + mobile 390px de chaque onglet ; inventaire XP/rangs/gacha/stockage dans `BASELINE_AUDIT.md` | docs, `qa/baseline/*.png` | captures Playwright reproductibles | — |
| S2 | Tests de caractérisation de la logique pure existante (formules XP/niveau/rang, tirage gacha avec seed, coffre du jour, streak) | `tests/legacy/*.test.*` | tests verts sur le code **non modifié** | supprimer tests |
| S3 | `storage.ts` + export/import JSON de la sauvegarde, branché **sans changer les clés** existantes | `appearance/storage.ts`, 1 point d'appel | round-trip export→import identique ; ancienne save lisible | flag off |
| S4 | `characterConfig.ts`, `themeConfig.ts`, `migrations.ts` (purs) | nouveaux fichiers | unit tests : défauts, validation, migration idempotente, ids legacy de thème → 3 thèmes | supprimer modules |
| S5 | `AppearancePreview` derrière `?preview=appearance` : sélection avatar/thème, affiche les **références étiquetées « CONCEPT »** et l'état du manifeste | nouveau composant + 1 route/flag | invisible sans flag ; aucune régression des captures S1 | flag off |
| S6 | Thèmes : mapping des 3 thèmes sur les tokens existants ; **sort des autres thèmes = décision D-003** | `themeConfig.ts`, sélecteur | captures S1 inchangées pour Sakura ; save legacy migrée | flag `themes.v2` off |
| S7 | `LayeredChibiAvatar` — **uniquement après G1/G2** (assets multicouches validés) | nouveau composant | toutes combinaisons du mini-pack rendues sans décalage (test d'empilement + captures) | flag `avatar.chibi` off |
| S8 | Recette G3 : quêtes/XP/gacha/objectifs/exercices identiques, responsive, focus clavier | `docs/QA_REPORT.md` | tests S2 + captures avant/après | désactiver flags |

**Rollback global** : chaque étape = un commit atomique ; tout nouveau rendu est derrière un flag par défaut `off` ; la migration de sauvegarde écrit une copie `…_backup_v0` avant transformation et l'import JSON restaure l'état S3.

## 4. Dépendances externes au code

- **GL-003 (art)** : 2 masters plein pied 1024×1280 RGBA + source multicouche (PSD/KRA) fidèles à `master-characters-APPROVED.png`, puis mini-pack (2 coiffures, 2 hauts, 1 bas, 1 accessoire, 2 guitares par avatar) exportés **sur le même canevas** avec l'ordre de calques du manifeste. Livrable à un illustrateur ; pas produit par code.
- **Fonds de thème** : 3 décors finaux (Sakura, Cyberpunk, Ombre) au format paysage + crop mobile.

## 5. Décisions en attente du fondateur
Voir `docs/DECISION_LOG.md` : D-003 (sort des thèmes hors Sakura/Cyberpunk/Ombre), D-004 (avatar pixel conservé jusqu'à validation chibi), D-005 (prestataire art).
