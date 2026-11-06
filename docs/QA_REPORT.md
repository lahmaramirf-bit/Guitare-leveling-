# QA REPORT — 2026-11-06

> Portée : **handoff + documentation + contrats**. Aucune application n'existe dans le dépôt ; **aucun test fonctionnel, build, lancement ou vérification desktop/mobile de l'app n'a été possible.**

## Commandes exécutées et résultats

| # | Commande | Résultat | Statut |
|---|---|---|---|
| 1 | `git status` / `git log` / `ls -la` (dépôt local) | « No commits yet », seul `.git` présent | VÉRIFIÉ — dépôt vide |
| 2 | `git ls-remote origin` | aucune ref | VÉRIFIÉ — distant vide |
| 3 | GitHub `list_branches lahmaramirf-bit/Guitare-leveling-` | `[]` | VÉRIFIÉ |
| 4 | `list_repos` (dépôts accessibles) | Guitare-leveling-, TTMC (×2), Fil-rouge- — aucun ne correspond à l'app | VÉRIFIÉ (par nom) |
| 5 | `unzip` du kit dans un dossier isolé puis copie dans `handoff/` | 24 fichiers | OK |
| 6 | `python3 -I handoff/scripts/check_package.py` | `24 contrôlés; 0 erreur(s)` (SHA-256, tailles, en-têtes PNG) | **PASS** |
| 7 | Lecture des dimensions PNG (en-têtes IHDR) | références 1536×1024 ; master personnages RGBA, planche thèmes RGB sans alpha | VÉRIFIÉ |
| 8 | `python3 -I scripts/validate_contracts.py` | `0 erreur(s)` | **PASS** |
| 9 | Test négatif : copie corrompue (4ᵉ thème `moe_moe`, avatar `approved` sans image) | `4 erreur(s)`, exit 1 | **PASS** (le garde-fou détecte bien) |
| 10 | Inspection visuelle des 3 captures `existing-app` et des 2 planches | cf. `BASELINE_AUDIT.md` §2–3 | Constat sur image uniquement |

## Non testé (et pourquoi)

| Élément | Raison |
|---|---|
| Lancement / build / lint / tests de l'app | Pas de code source |
| Quêtes, XP/rangs, gacha, coffre, objectifs, exercices, sauvegarde | Pas de code source ; seulement des captures statiques |
| Rendu desktop / mobile, navigation clavier | Pas d'app à rendre. Les captures `handoff/reference_only/previews/` concernent la démo, **pas** l'app — non utilisées comme preuve |
| Audio / micro | Inconnu ; aucune affirmation |
| Rendu d'avatar multicouche | Aucun asset de production (tout `missing`) |
| Conformité des schémas JSON via un validateur JSON Schema complet | Pas de dépendance installée ; le script stdlib vérifie les règles métier équivalentes. À doubler par `ajv` lors de l'étape S4 |

## Régressions
Aucune possible : aucun fichier préexistant (le dépôt était vide). Rien n'a été supprimé.

## Gates
- G0 : **partiel** (bloqué sur le code) — détail dans `BASELINE_AUDIT.md` §5.
- G1/G2/G3 : **non démarrés** (dépendent de GL-001 et GL-003).
