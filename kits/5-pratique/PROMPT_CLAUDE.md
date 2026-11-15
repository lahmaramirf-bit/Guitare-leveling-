Lis CLAUDE.md, docs/AUDIT_V0.8.md (roadmap, lot A et lot B) et docs/DECISION_LOG.md (D-036 à D-038). Chantier 5 : **pratique**. Pars de la branche la plus récente (`git fetch origin claude/hopeful-allen-8xgg1o` et travaille dessus) ; pousse dessus ; sinon ta branche désignée + la commande pour la récupérer. Commit et push à chaque lot.

Acquis : séance guidée persistante avec minuteur à l'horloge, métronome intégré, bilan de fin, temps de pratique enregistré (`days[d].prac`), bouton « Reprendre ma séance » (`src/practice/`, `src/screens/Training.tsx`).

À faire, dans cet ordre :
1. **Lancer un exercice** depuis la bibliothèque : minuteur, métronome préréglé au tempo conseillé (`EXOS[].bpm`), bouton « terminé » qui coche l'exercice et ajoute le temps de pratique.
2. **Travailler un morceau** depuis le Répertoire : minuteur, métronome au tempo du morceau (`rep[].bpm`), validation d'une étape du plan, temps ajouté.
3. **Séance personnalisable** : remplacer un bloc par un exercice ou par le morceau en cours.
4. **Écran actif** pendant la séance (Wake Lock, avec repli silencieux si indisponible) et minuteur en grand sur mobile.
5. **Journal de pratique** dans l'onglet Journal : minutes par jour sur 7 et 30 jours, total de la semaine, meilleure série ; total du jour sur l'accueil (déjà affiché) et bilan de séance relié aux objectifs du rang.
6. Métronome : subdivisions (croches, triolets), accélérateur (+N BPM toutes les X mesures), mesures muettes.

Contraintes : moteur d'XP intact ; pas d'écoute micro ni de promesse de reconnaissance de notes ; pas de nouvelle dépendance lourde ; `npm test` et `npm run e2e` verts avec de nouveaux tests pour chaque fonction ; captures mobile et ordinateur dans `docs/qa/v10/`. Format de réponse : 1. Décisions, 2. Implémenté et testé, 3. Fichiers modifiés, 4. Art manquant et raisons, 5. Prochaine étape.
