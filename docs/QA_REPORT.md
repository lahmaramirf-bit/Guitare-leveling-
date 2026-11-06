# QA REPORT — v0.1 (2026-11-06)

## Commandes exécutées

| Commande | Résultat |
|---|---|
| `python3 handoff/scripts/check_package.py` | 24/24 fichiers du handoff intègres — **PASS** |
| `python3 scripts/validate_contracts.py` | 0 erreur (et le cas corrompu de test est bien rejeté) — **PASS** |
| `npm run typecheck` (`tsc`, mode strict) | 0 erreur — **PASS** |
| `npm test` (Vitest) | 3 fichiers, **23/23 tests** — **PASS** |
| `npm run build` | `dist/` : JS 271 kB (85 kB gzip), CSS 20 kB — **PASS** |
| `npm audit --omit=dev` | 0 vulnérabilité |
| `npm run build && npm run e2e` (Chromium réel, `vite preview`) | **20/20 vérifications** — **PASS** |

### Couverture des tests unitaires (`src/game/*.test.ts`)
Courbe XP (150 XP au niveau 1 ; rang D = 20 400 XP au niveau 17), titres, XP de séance et plafond, série de jours, quêtes quotidiennes déterministes et non réclamables deux fois, quête principale, coffre du jour (1×/jour, 20–50), invocation (débit, inventaire, doublons → éclats), somme des taux = 100 %, distribution mesurée sur 100 000 tirages (écart < 0,6 pt), garantie légendaire, équipement interdit si non possédé, déblocage par progrès (5 séances → casque, rang D → guitare de cristal), changement d'avatar, répertoire, sauvegarde aller-retour, sauvegarde corrompue conservée en copie, réparation champ par champ, export/import JSON.

### Parcours E2E (`e2e/smoke.mjs`)
Onboarding → coffre → séance chronométrée avec métronome → bilan (30 min « propre » = 360 XP vérifiés dans la sauvegarde) → réclamation de quête → invocation → ajout au répertoire → rechargement (persistance) → 3 thèmes appliqués → grimoire → journal → mobile 390 px sur 3 écrans (aucun débordement horizontal, barre de navigation fixée en bas) → **aucune erreur JS/console**.

## Captures (`docs/qa/`)
Desktop 1280 px : `05-theme-sakura-desktop.png`, `05-theme-cyberpunk-desktop.png`, `05-theme-ombre-desktop.png`, `04-heros.png`, `03-quetes.png`. Mobile 390 px : `06-mobile-accueil.png`, `06-mobile-entrainement.png`.
Défauts trouvés sur capture puis corrigés : chevauchement portrait/niveau en mobile, libellés de la barre mobile qui se touchaient, espace parasite dans le bandeau de quête, recadrage concept qui montrait un bout de l'autre personnage.

## Non testé / limites connues
| Élément | Statut |
|---|---|
| Son du métronome | Planification Web Audio exécutée sans erreur et temps animés à l'écran ; **pas vérifié à l'oreille** ni mesuré en précision |
| Reconnaissance des notes jouées | **N'existe pas** (validation déclarative assumée, affichée au joueur) |
| Safari / iOS, Firefox, Android réels | Non testés (Chromium uniquement, émulation mobile) |
| Lecteur d'écran | Rôles/labels ARIA posés, pas d'audit avec un vrai lecteur |
| Sprites multicouches / tenues visibles | **Bloqué** : aucun asset de production (manifeste tout `missing`) |
| Déploiement public | Non fait |
