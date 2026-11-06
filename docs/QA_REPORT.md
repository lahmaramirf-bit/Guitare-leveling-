# QA REPORT — v0.2 (2026-11-06)

## Commandes exécutées

| Commande | Résultat |
|---|---|
| `npm run typecheck` (`tsc`, strict) | 0 erreur — **PASS** |
| `npm test` (Vitest) | 2 fichiers, **25/25** — **PASS** |
| dont `src/game/parity.test.ts` | moteur d'XP d'origine exécuté en bac à sable vs le nôtre : **200 sauvegardes aléatoires identiques** (XP 29 866 → 50 014, minutes, niveau, rang) — **PASS** |
| `npm run build` | JS 451 kB (146 kB gzip), CSS 29 kB — **PASS** |
| `npm run e2e` (Chromium réel, `vite preview`) | **25/25 vérifications** — **PASS** |
| `python3 scripts/validate_contracts.py` | 0 erreur — **PASS** |
| `python3 handoff/scripts/check_package.py` | 24/24 fichiers intègres — **PASS** |

### Parcours E2E couvert
Création du héros → 7 quêtes → Limit Break → portail → défi hebdo → objectif + boss de donjon → fiche morceau (étape du plan + maîtrise) → session guidée 15 min complète → record + révision d'ombre → **achat en boutique d'un objet débloqué** (débit exact de 40 cristaux) + objet verrouillé non achetable → équipement d'un titre visible sur la fiche → rechargement (persistance) → 3 thèmes → grimoire → **reprise d'une sauvegarde du projet de base** (XP recalculée, niveau 2 attendu) → mobile 390 px sur 6 écrans sans débordement → **aucune erreur JS/console**.

### Tests unitaires (`src/game/game.test.ts`)
Quêtes (bonus 7/7, annulation, série 5/7, consignes du rang), portail, hebdo, Limit Break verrouillé avant 7/7, pénalité + parchemin, donjons/boss/ombres (décroissance à 60 j, révision), records, rang qui ne redescend pas, répertoire (plan, maîtrise, XP, morceau en cours dans la quête), déblocage par collection, morceaux perso, **boutique sans hasard** (prix + condition pour chaque objet, cristaux = progression, refus si condition non remplie, refus si cristaux insuffisants, débit, équipement), sauvegarde (aller-retour, reprise du format d'origine, export/import, corruption, nettoyage champ par champ).

## Captures (`docs/qa/`)
`01-quetes.png`, `02-donjons.png`, `03-fiche-morceau.png`, `04-journal.png`, `05-boutique.png`, `06-theme-ombre.png`, `07-mobile-quetes.png`, `07-mobile-repertoire.png`.

## Non testé / limites
| Élément | Statut |
|---|---|
| Salles audio (manche, oreille, rythme, gammes, accords, arpèges, jam), partitions jouables, lecture à vue, symboles | **Non portées** (lots 3–4), voir `docs/BASE_FEATURE_INVENTORY.md` |
| Son (métronome, signal de fin de bloc) | Planification exécutée sans erreur ; **pas vérifié à l'oreille** |
| Reprise de la progression stockée dans le cloud de l'artefact Claude | Impossible hors claude.ai ; seule la sauvegarde locale du navigateur ou un JSON exporté est reprise |
| Safari/iOS, Firefox, Android réels | Non testés (Chromium uniquement) |
| Tenues/guitares visibles sur le personnage | Bloqué : aucun sprite de production |
