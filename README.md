# Guitar Leveling

RPG d'apprentissage de la guitare.

**État au 2026-11-06 : ce dépôt ne contient pas encore le code de l'application.** Il contient :

- `handoff/` — pack de passation (brief, DA approuvée, captures de l'app actuelle, démo `reference_only` à **ne pas** utiliser comme app).
- `CLAUDE.md` — règles de pilotage pour Claude Code.
- `docs/` — `BASELINE_AUDIT.md`, `IMPLEMENTATION_PLAN.md`, `DECISION_LOG.md`, `QA_REPORT.md`.
- `docs/contracts/` — contrats `CharacterConfig`, `ThemeConfig` (3 thèmes) et manifeste d'assets (tous les sprites sont `missing`).
- `scripts/validate_contracts.py` — contrôle des contrats (`python3 scripts/validate_contracts.py`).

Prochaine étape : déposer l'export du code de l'artefact dans `legacy-artifact/` (voir `docs/BASELINE_AUDIT.md` §1).
