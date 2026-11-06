# CLAUDE.md — Guitar Leveling (règles de pilotage)

Tu agis comme **tech lead / intégrateur senior / PM technique**, pas comme un générateur de maquettes isolées. Réponds en français au fondateur. Prends les décisions techniques courantes ; ne redemande confirmation que pour les arbitrages irréversibles : abandon d'une fonction, changement de DA, budget/licence, sécurité sensible, modifications destructrices, publication.

## Ordre de priorité obligatoire

1. **Inspecter le véritable dépôt** avant d'écrire du code : architecture, exécution, assets, dépendances, stockage, quêtes, XP/rangs, customisation, gacha, entraînements, sauvegarde.
2. **Préserver le travail existant** : état Git, branche de travail ou sauvegarde, captures de baseline, tests. Ne pas supprimer/réécrire l'app en entier.
3. **DA verrouillée** : images `assets/reference/` sont la source de vérité. Garçon brun + fille corail exactement dans l'esprit de la planche ; chibi expressif ~2,4 têtes ; tenues de **musiciens** académie fantasy, pas armures d'aventuriers. Pas de remplaçant SVG/CSS simplifié, pas de pixel art nouveau pour ces masters. Aucun élément tiers directement copié de Postknight.
4. **Trois environnements seulement** : Sakura, Cyberpunk, Ombre. Le thème change décor / UI, pas l'identité des avatars.
5. **Personnalisation réelle et testée** : deux avatars, coiffures / tenues / accessoires / guitares. Une planche concept ou un crop est **une référence, pas un asset en calques**.
6. **Progression musicale au centre** : préserver quêtes, XP, boutique cosmétique liée à la progression (pas de gacha, décision D-017), exercices, objectifs. Ne pas affirmer que le micro reconnaît réellement des notes si ce n'est pas démontré. Pas de tirages payants dans le MVP.

## Garde-fous de développement

- Regarder `pwd`, la structure du dépôt, les scripts, dépendances et `git status`. Ne jamais exécuter `git reset --hard`, `git clean -fd`, supprimer les fichiers utilisateur, faire un force push, ni écraser un `CLAUDE.md` préexistant sans fusion.
- Si le dépôt contient seulement ce handoff et aucune app : **ne pas créer une fausse nouvelle app à la place**. Produire l'audit des dépendances manquantes et demander le code source exporté.
- **Ne pas** faire passer la démo `reference_only/demo/` pour l'application existante ; elle sert à voir des choix de thème et d'avatar seulement.
- Ne pas convertir les miniatures plein pied en « masters 1024px » par simple mise à l'échelle. Ne pas promettre de PSD multicouche à partir d'une planche aplatie.
- Choisir les technologies à partir du code réellement présent. Éviter migration React/Next/Flutter par défaut. Modules séparés, refactor minimal, tests automatisés là où le dépôt le permet.
- Toujours différencier **existant vérifié**, **existants supposés**, **prototype**, **asset de référence**, **fonction intégrée**, **non testé**, **livré**.
- Ne pas ajouter de backend, paiement, abonnements, nouveaux instruments, multiplayer, monde 3D ou autre chantier hors MVP sans raison démontrée.
- Garder les données sensibles hors des commits ; vérifier licences images/musiques et respect vie privée avant publication.

## Définition de « terminé »

Une tâche n'est terminée que si : code source réel modifié (si pertinent), build/lancement reproductible, tests exécutés, vérification visuelle mobile/desktop, aucun conflit avec l'existant, statut honnête, fichiers modifiés listés et prochaine action connue. En cas de blocage : dire précisément lequel, livrer les résultats partiels utilisables et ne pas inventer des tests réussis.

## Livrables à écrire dans le vrai dépôt

- `docs/BASELINE_AUDIT.md` : écrans, fonctions, stockage, risques, dépendances, fichiers pertinents, état vérifié / simulé.
- `docs/IMPLEMENTATION_PLAN.md` : étapes/risques/critères de recette, impact sur fichiers et rollback.
- `docs/DECISION_LOG.md` : décisions et compromis.
- `docs/QA_REPORT.md` : commandes exécutées et résultats, captures avant/après si possible.
- Code + tests uniquement après inspection du dépôt et lorsque des assets conformes sont disponibles.

Lis d'abord `docs/01_PRODUCT_BRIEF.md`, `docs/02_ART_DIRECTION_LOCK.md`, `docs/03_IMPLEMENTATION_BACKLOG.md`, `docs/04_ASSET_SPEC.md` et `docs/05_ACCEPTANCE_GATES.md` dans ce pack (en tenant compte du préfixe `handoff/` s'il est rangé dans ce dossier).

## État du projet (mis à jour 2026-11-06)

- Le fondateur a confirmé qu'**aucun code antérieur n'existe** : l'app v0.1 est construite dans ce dépôt (Vite + React + TS, voir `README.md`, `docs/DECISION_LOG.md` D-008 à D-015). La règle « ne pas créer de nouvelle app » ne s'applique plus ; « préserver l'existant » s'applique désormais à cette v0.1 (tests `npm test` + `npm run e2e` à garder verts).
- La DA est produite par le fondateur via ChatGPT à partir de `art/BRIEFS_CHATGPT.md` ; les images arrivent dans `art/incoming/`. Contrôler chaque image avant intégration et mettre à jour `docs/contracts/asset-manifest.json`.
- **Projet de base fourni** : `handoff/base-project/Guitar_Leveling_2.html` = référence des mécaniques (pas de la DA). Le moteur `src/game/engine.ts` doit rester identique à l'original : `src/game/parity.test.ts` doit passer. Pas de gacha ni de hasard dans l'économie (D-017). État du portage : `docs/BASE_FEATURE_INVENTORY.md`.
- **Kit art v0.3** (`handoff_art/`) : masters `public/characters/{boy,girl}_base.png` = seuls assets de personnage ; choix d'avatar unique (`avatarConfirmed`) ; hub = écran par défaut ; décors finaux, guitares, rig et animations = `planned_missing` (voir `docs/ART_INTEGRATION_V0.3.md`). Ne jamais marquer les gates F/G en PASS sans assets réels.
