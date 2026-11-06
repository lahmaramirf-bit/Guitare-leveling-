# DECISION LOG

| ID | Date | Décision | Statut | Justification / compromis |
|---|---|---|---|---|
| D-001 | 2026-11-06 | Ne pas créer d'application de remplacement ; le dépôt étant vide, livrer audit + plan + contrats uniquement | Prise (tech lead) | `CLAUDE.md` + A-004 : le code de l'artefact fait foi. Une app neuve divergerait de l'existant et dupliquerait le travail |
| D-002 | 2026-11-06 | Versionner le pack de handoff dans `handoff/` et `CLAUDE.md` à la racine (aucun fichier préexistant) | Prise (tech lead) | Recommandé par `handoff/README_START_HERE.md` ; références DA disponibles pour toute session future. Coût : ~15 Mo dans l'historique Git (images dupliquées dans `reference_only/`) — accepté pour garder le pack vérifiable par `MANIFEST.json` |
| D-003 | — | Sort des thèmes existants hors Sakura/Cyberpunk/Ombre (Moe moe, Manga, Arcade 8-bit, + ≥1 autre) | **En attente fondateur** | Retirer = supprimer une fonction existante. Proposition : les masquer derrière un flag et migrer la sauvegarde (Moe moe→Sakura, Manga→Ombre, Arcade 8-bit→Cyberpunk, autres→Sakura). Mapping ajustable |
| D-004 | — | Conserver l'avatar pixel actuel comme rendu par défaut jusqu'à validation des sprites chibi multicouches | Proposée (tech lead) | Évite toute régression visuelle ou un avatar dégradé ; respecte « rien de moins qualitatif » |
| D-005 | — | Moyen de production des couches (illustrateur freelance vs pipeline IA + retouche) | **En attente fondateur** (budget/licence) | Impacte droits commerciaux (A-008) et délai GL-003 |
| D-006 | 2026-11-06 | Contrats de données en JSON Schema framework-agnostique + validateur Python stdlib | Prise (tech lead) | Utilisable quel que soit le framework découvert ; sera traduit en types TS/JS à l'étape S4 |
| D-007 | 2026-11-06 | Variantes blanc/lavande (set « Virtuose ») = options de coiffure déblocables, jamais l'identité de base | Prise (tech lead) | Identité verrouillée : garçon brun, fille corail |
