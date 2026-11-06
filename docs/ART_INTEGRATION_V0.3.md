# Intégration art v0.3 — avatars, hub, univers, slots d'animation et d'équipement

Source : `handoff_art/` (kit « DA & Animation v0.3 », ChatGPT DA). Manifeste du kit : `handoff_art/manifest/asset_status.json`. Miroir côté app : `src/avatar/manifest.ts`, `src/appearance/worlds.ts`, `docs/contracts/asset-manifest.json`.

## Ce qui est intégré
| Élément | Fichier | Statut |
|---|---|---|
| Garçon (master statique) | `public/characters/boy_base.png` (+ `_512` réduit) | ready_static, SHA-256 identique au kit |
| Fille (master statique) | `public/characters/girl_base.png` (+ `_512` réduit) | ready_static, SHA-256 identique au kit |
| Portrait compact | dérivé du master par cadrage CSS (`AvatarPortrait`) | — |
| Anciens recadrages de planche | supprimés (`public/concept/*-portrait.png`, `CharacterPortrait.tsx`) | — |

## Choix du personnage (doc 05)
- `profile.avatarConfirmed` : choix unique ; `confirmAvatar` refuse un second choix ; plus aucun sélecteur dans les écrans courants.
- Comptes v0.2 sans ce champ : la fenêtre de choix s'ouvre une fois (sans champ nom), XP/nom/thème/quêtes conservés.
- Avant le choix : silhouette neutre (`AvatarPending`), jamais un avatar par défaut.
- Formulation : « choix d'apparence, il ne dit rien de toi ».
- Pas de compte serveur dans l'app : la « sauvegarde du compte » est le stockage local + export/import. À revoir si un backend arrive.

## Hub (doc 03)
`src/screens/Hub.tsx`, écran par défaut. Couches : décor → éclairage du thème → ambiance (canvas) → sol → personnage (ancré pieds sur le sol, 64 % de la scène) → état (nom, titre, niveau, rang, XP), cristaux, série → actions (Commencer l'entraînement, Quêtes du jour) → 6 entrées (Quêtes, Entraînement, Donjons, Répertoire, Boutique, Journal).

## Univers
| Thème | Décor | Éclairage | Ambiance | Sol | Matières des panneaux |
|---|---|---|---|---|---|
| Sakura | **provisoire** : vignette de la planche approuvée, floutée, étiquetée | lumière dorée de fin de journée | pétales lents | plancher bois clair | papier washi, cadre bois + filet doré |
| Cyberpunk | **provisoire** (idem) | halos magenta / cyan, nuit | pluie fine | sol mouillé, reflets néon | verre sombre, coins coupés, liseré cyan, scanlines |
| Ombre | **provisoire** (idem) | faisceaux violets, brume | particules montantes + brume | pierre sombre, halo de scène | pierre/velours, double filet or ancien, rubans bordeaux |

Emplacements prêts pour les fichiers finaux : `bg_<thème>_desktop.png` (1920×1080), `bg_<thème>_mobile.png` (1080×1920), `fg_<thème>.png`. Passer `background.status` à `approved` dans `src/appearance/worlds.ts` suffit pour les afficher (balise `<picture>` desktop/mobile).

## Animation (doc 02)
`resolveAnimation(state)` : `idle | greet | celebrate | strum | walk`.
- Tous les états sont `planned_missing` → `blocked_by_missing_art`.
- **Placeholder d'animation** (pas un rig) : translation de 3 px du PNG entier en idle, petit saut de 4 px en célébration après un gain d'XP. Désactivé avec `prefers-reduced-motion`.
- strum, walk, greet : image fixe tant que le rig n'existe pas.
- Aucun découpage automatique du PNG, aucune partie redessinée.

## Équipement (doc 04)
- Ordre des calques : `guitar_strap_back, guitar_back, body, guitar_body_front, left_hand_over_neck, right_hand_over_strings` (canevas 1024×1280, sol (512, 1170)).
- Ancrages attendus de la source du rig : `shoulder_strap, left_hand_neck, right_hand_strum, body_center, guitar_neck_angle` (`ANCHOR_VALUES`, vides).
- `GUITARS` : `guitar_study`, `guitar_red_electric`, `guitar_amethyst`, `guitar_crystal` → `planned_missing`. Un objet équipé n'ajoute un calque que si son statut est `approved` (`renderLayers`). L'écran Héros affiche « sera visible quand son illustration sera livrée ».

## Pour activer un asset livré
1. Déposer le PNG dans `art/incoming/`, je le contrôle (taille, alpha, coins, sol, fidélité).
2. Copier dans `public/…`, renseigner le chemin et passer le statut à `approved` dans `src/avatar/manifest.ts` / `src/appearance/worlds.ts` et `docs/contracts/asset-manifest.json`.
3. `npm test` + `npm run e2e` + captures.
