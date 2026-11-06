# QA et critères d'acceptation par jalon

## G0 — Baseline avant tout refactor

- [ ] Dépôt original identifié (pas `reference_only/demo`).
- [ ] Git status et branche de travail sûrs ; aucune suppression de fichier non sauvegardé.
- [ ] Commandes pour installer/lancer/build/test vérifiées ; environnement décrit.
- [ ] Carte écrans / XP / rangs / monnaie / quêtes / objectifs / gacha / entraînements / stockage.
- [ ] Fonctions **réellement testées** distinguées des simulations/constats à l'écran.

## G1 — Assets

- [ ] Deux personnages finaux plein pied conformes aux références.
- [ ] Source artistique multicouche vraie, pas une seule image aplatie.
- [ ] PNG transparent 1024×1280 ou dimensions explicitement validées ; pas de faux upscale.
- [ ] Contrôle sur fond clair et foncé, et à la résolution d'affichage mobile.
- [ ] Comparaison côte à côte avec `master-characters-APPROVED.png` acceptée par le fondateur.

## G2 — Personnalisation

- [ ] Changements coiffure/haut/bas/accessoire/guitare sans chevauchements ni double visage.
- [ ] Ancrages et z-order fiables sur toutes les combinaisons de la mini-collection.
- [ ] Chaque tenue est un vrai fichier remplaçable, pas des pixels découpés au hasard dans une planche.
- [ ] Pas de perte de performance excessive sur mobile.

## G3 — Intégration

- [ ] Les 3 thèmes fonctionnent sans changer les proportions du perso.
- [ ] Choix et équipement sauvegardés sans casser sauvegardes existantes.
- [ ] Même logique de quêtes, XP, monnaie, gacha, objectifs, journaux, exercices qu'avant.
- [ ] Responsive et navigation clavier/focus préservés.
- [ ] Build/lint/tests existants exécutés et résultat fourni ; captures comparatives.

## G4/G5 — Apprentissages / livraison

- [ ] L'exercice fournit un feedback honnête ; aucun « accord reconnu » sans mécanisme et tests.
- [ ] Rollback documenté et répétable.
- [ ] Licences/privacité/sécurité/conditions des stores vérifiées avant toute publication commerciale.

**Les anciennes démos** `reference_only/demo` n'ont été testées que comme sélecteur de deux personnages et trois thèmes en navigateur Chromium injecté : elles ne prouvent **aucun** fonctionnement de l'app Claude existante ou d'une app déployée. Ne réutilise pas leurs captures comme preuve de G3.
