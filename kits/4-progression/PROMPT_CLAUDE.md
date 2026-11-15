Lis CLAUDE.md, docs/DECISION_LOG.md (surtout D-016, D-017, D-041, D-042) et docs/BASE_FEATURE_INVENTORY.md. Chantier 4 : **progression**. Pars de la branche la plus récente (`git fetch origin claude/hopeful-allen-8xgg1o` et travaille dessus) ; pousse dessus ; sinon ta branche désignée + la commande pour la récupérer. Commit et push à chaque lot.

Décision du fondateur : **appliquer l'échelle F → SSS sur 200 niveaux** (D-042), avec une progression non linéaire : très généreuse les premières semaines, puis de plus en plus lente, pour qu'un joueur régulier ne finisse pas en un mois. Les 7 paliers de contenu existants (donjons, portails, Limit Break, boutique) restent, mais mappés sur 9 rangs affichés : F, E, D, C, B, A, S, SS, SSS.

À faire :
1. Propose d'abord en 10 lignes la courbe (XP par niveau de 1 à 200, seuils des 9 rangs, temps estimé pour un joueur à 30 min/jour) et l'association rangs ↔ paliers de contenu ; applique-la sans attendre (je corrige après si besoin).
2. Remplace `src/game/parity.test.ts` par des tests de la nouvelle courbe (monotonie, seuils, temps estimés), en gardant le reste du moteur intact (registres, recalcul de l'XP, cristaux). Les sauvegardes existantes doivent se recalculer sans perte.
3. Quêtes **quotidiennes, hebdomadaires et mensuelles** : bonus d'XP si une catégorie est complète ; le mensuel complet donne un objet de personnalisation (à choisir dans `src/game/catalog.ts`, sans hasard). Portails hebdomadaires ouverts avec des **clés** : définis une règle de gain des clés (par exemple 1 clé par semaine complète, 1 par boss) et documente-la.
4. Mets à jour l'affichage : gemme de rang, barre d'XP, onglet Donjons (9 rangs), questionnaire de placement (`src/game/placement.ts`) qui place désormais de F à B.
5. `npm test` et `npm run e2e` verts ; `docs/DECISION_LOG.md` et `docs/QA_REPORT.md` à jour ; captures dans `docs/qa/v10/`.

Interdits : gacha, achats réels, modification des masters, suppression de contenu. Format de réponse : 1. Décisions, 2. Implémenté et testé, 3. Fichiers modifiés, 4. Art manquant et raisons, 5. Prochaine étape.
