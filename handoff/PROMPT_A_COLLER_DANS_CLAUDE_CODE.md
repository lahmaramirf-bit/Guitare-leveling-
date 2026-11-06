# PROMPT DE DÉMARRAGE — À COLLER DANS CLAUDE CODE

Tu es le **lead technique et le responsable de l'intégration** de mon application **Guitar Leveling**, un RPG d'apprentissage de la guitare destiné à évoluer vers une application web puis mobile commercialisable. J'ai besoin d'une **exécution structurée sur mon vrai projet**, pas d'un nouveau prototype déconnecté.

Je t'ai fourni un dossier `handoff/` (ou des fichiers équivalents à la racine) avec : `CLAUDE.md`, docs, références artistiques approuvées, screenshots de l'interface existante, démo de référence explicitement non intégrée.

**TA PREMIÈRE ACTION :** lire `CLAUDE.md` et `handoff/README_START_HERE.md` puis inspecter tous les fichiers du projet actuellement ouverts dans Claude Code. Si les fichiers sont directement à la racine, adapte les chemins. Vérifie l'état Git et la façon de lancer l'app. Ne touche pas aux données et ne détruis rien.

**Objectif prioritaire :** conserver **intégralement** mon app actuelle (quêtes, entraînements, progression, XP/rangs, gacha cosmétique, récompenses, objectifs, sauvegarde) et préparer une intégration progressive de la DA validée. La DA est fixée par `handoff/assets/reference/master-characters-APPROVED.png` : garçon brun et fille corail, style chibi détaillé et chaleureux, tenues de musiciens fantasy-académie. **Rien de moins qualitatif n'est acceptable**. Trois thèmes uniquement : Sakura, Cyberpunk, Ombre. Garder la personnalisation réelle et les accessoires déblocables selon les progrès musicaux.

**Tu as l'autorité technique pour choisir la meilleure approche**, en minimisant coûts, couplage et risques. En revanche, pas de refonte complète, pas de personnages redessinés en SVG/CSS, pas d'assets factices présentés comme terminés, pas de suppression de fonctionnalités existantes, pas de promesse d'audio réellement validé sans test. L'illustration est une planche aplatie : tu dois explicitement distinguer les références visuelles des vrais sprites multicouches.

## Exécution attendue maintenant

1. **AUDIT / BASELINE (P0)** — Identifie le vrai code de l'application (pas la démo `reference_only`). Fais un inventaire des écrans, logiques XP/gacha/exercices, données, thèmes, assets, builds et tests. Lance l'app si possible ; réalise un état Git et une copie/branche de travail sûre. Rédige `docs/BASELINE_AUDIT.md` et les risques.
2. **PLAN TECHNIQUE (P0)** — Propose et documente une architecture de `CharacterRenderer` / `CharacterConfig` / `ThemeConfig` adaptée au framework existant, des contrats d'assets, une migration sans régression et le rollback. Rédige `docs/IMPLEMENTATION_PLAN.md` avec étapes courtes et tests.
3. **PREMIÈRE LIVRAISON SÛRE** — Si le code existe et que le périmètre est assez clair, implémente uniquement les fondations sans destruction : types/configuration de personnage, 3 thèmes, composant d'aperçu derrière une option de test, persistance compatible avec le stockage actuel. N'intègre que des fichiers de référence étiquetés "concept", jamais comme équipements interchangeables. Si les masters découpés manquent, prépare les interfaces/manifestes et **bloque honnêtement l'intégration visuelle finale** au lieu d'improviser des personnages moches.
4. **RECETTE** — Exécute les tests et build réellement disponibles, vérifie desktop/mobile et documente ce qui a passé/échoué/non testé dans `docs/QA_REPORT.md`. Préserve toutes les fonctions préexistantes.

**Livraison à la fin de ton exécution :** résumé concret de ce qui a été inspecté et modifié, liste des fichiers et commandes, captures de tests si possibles, blocages réels, statut précis et **prochaine tâche P0**. **N'affirme jamais que le jeu complet est déployé si ce n'est pas vrai.**

Si tu ne trouves aucun code source de l'artefact actuel dans le répertoire, ne démarre pas une app neuve : explique précisément quelle archive/export/dépôt me fournir et finalise quand même l'audit du handoff et la préparation documentaire disponible.
