Guitar Leveling — Tiki-taka n°9 → ChatGPT
v0.8 : parcours de pratique réparé et enrichi (progrès fonctionnel livré)

Rôles inchangés : tu fais la direction artistique et les assets ; Claude Code fait le code, l'intégration et les tests. Guitar Leveling est une app de pratique de la guitare gamifiée, pas un RPG.

1. Audit des fonctionnalités réelles (détail complet dans AUDIT_V0.8.md)
* **Fonctionnelles** :
  * répertoire de 193 morceaux ;
  * quêtes, portail, défis hebdo et Limit Break ;
  * XP, rangs et série (moteur identique à l'original, test de parité) ;
  * cristaux et boutique liée à la progression, sans hasard ni argent réel ;
  * sauvegarde locale, export et import ;
  * journal ;
  * séance guidée (corrigée en v0.8).
* **Partielles** :
  * temps de pratique (séance guidée seulement) ;
  * métronome (pas de subdivisions ni d'accélérateur) ;
  * exercices (case « fait », mais pas de lancement avec minuteur et tempo) ;
  * hors ligne (build statique, pas encore installable).
* **Manquantes** :
  * équipement visible sur l'avatar (art) ;
  * animations (art) ;
  * salles audio : manche, oreille, rythme, accords ;
  * partitions.

2. Blocage constaté et améliorations développées
* **Blocage mesuré dans le navigateur** : pendant une séance, ouvrir le métronome remettait tout à zéro (02:57 → 03:00). Un rechargement de la page aussi. Le temps de pratique n'était enregistré nulle part.
* **Corrigé et livré** :
  * la séance est conservée : changement d'onglet ou d'écran, rechargement ;
  * minuteur calculé sur l'horloge réelle, juste même si l'onglet passe en arrière-plan ;
  * **métronome intégré** à la séance, tempo mémorisé ;
  * plan affiché avant de démarrer ;
  * **bilan de fin** : temps pratiqué, blocs, XP gagnée, cristaux, quêtes x/7, série ;
  * **temps de pratique enregistré** dans la sauvegarde, sans effet sur l'XP ;
  * bouton **« Reprendre ma séance »** sur l'accueil, avec le temps pratiqué du jour ;
  * sur mobile, au plus 2 notifications visibles, pour qu'elles ne masquent plus les boutons.
* Sakura : V1 active, V3 candidate. Aucune nouvelle variante.

3. Fichiers modifiés
* Nouveaux : `src/practice/session.ts`, `src/practice/useSession.ts`, `src/practice/session.test.ts`, `docs/AUDIT_V0.8.md`, captures `docs/qa/v08/`.
* Modifiés : `src/screens/Training.tsx`, `src/screens/Hub.tsx`, `src/game/model.ts` (+ champ `prac`), `src/game/storage.ts`, `src/game/actions.ts`, `src/styles.css`, `src/App.tsx`, `e2e/smoke.mjs`, `docs/DECISION_LOG.md` (D-035 à D-038), `docs/QA_REPORT.md`.

4. Résultats des tests
* Unitaires : **42/42**, dont 6 nouveaux sur la séance et le temps de pratique. Parité XP OK.
* De bout en bout : **47/47**, dont 7 nouveaux : séance conservée après l'onglet Métronome, reprise après rechargement, temps enregistré, bilan affiché.
* Typage : 0 erreur. Contrats : 0 erreur.
* Non testé : Safari/iOS, Firefox, appareil réel.

5. Roadmap (par valeur pour l'utilisateur)
* **Lot A, pratique** :
  * lancer un exercice ou un morceau avec minuteur et métronome préréglé ;
  * séance personnalisable ;
  * temps de pratique partout ;
  * écran qui reste allumé ;
  * métronome avec subdivisions et accélérateur.
* **Lot B, progression** :
  * journal de pratique sur 7 et 30 jours ;
  * bilan relié aux objectifs du rang ;
  * records de tempo par exercice ;
  * conditions de déblocage visibles en boutique.
* **Lot C, application premium** :
  * barre du bas à 5 entrées ;
  * hors ligne et installable (PWA) ;
  * accessibilité, Safari et Firefox ;
  * rappels de sauvegarde.
* Mobile : Capacitor évalué et adapté, aucune migration engagée. Risques : bouton silencieux iOS et Web Audio, métronome suspendu écran verrouillé, purge du stockage de la WebView. Solutions détaillées dans l'audit.

6. Assets nécessaires côté ChatGPT (par ordre d'utilité, aucun ne bloque le lot A)
A. **Icône d'application** (lot C, PWA et Capacitor) :
   * PNG carré 1024 × 1024, sans texte, avec un motif lisible à 48 px (médiator ou clé de sol, palette de l'app) ;
   * plus une version « maskable » avec le motif dans les 80 % centraux.
B. **Guitare de départ en calques** sur le canevas des masters 1024 × 1280 (sol à 512, 1170), PNG transparents :
   * `guitar_strap_back`, `guitar_back`, `guitar_body_front` ;
   * une version pour le garçon et une pour la fille ;
   * plus un JSON des ancrages `shoulder_strap`, `left_hand_neck`, `right_hand_strum` et `guitar_neck_angle`.
C. **Décors Cyberpunk et Ombre** (1400 × 620), mêmes règles que Sakura V3. Seulement si le fondateur le demande, puisqu'aucune nouvelle itération artistique n'est prévue pour l'instant.
D. Plus tard : rig (membres découpés, zones cachées repeintes, pivots en JSON).

7. Blocages restants
* Équipement visible : pas de calques de guitare. Solution : asset B.
* Animations : masters aplatis, sans rig. Solution : asset D, après les guitares.
* Sakura « V3.1 » : jamais reçue. V3 reste la candidate.
* Salles audio : portage lourd, prévu après le lot A.

8. Captures (jointes)
`v08_mobile_*` et `v08_desktop_*` : choix de la séance, séance en cours avec métronome, accueil « Reprendre ma séance », bilan.

Retour attendu de ta part : l'icône (A) en fichier PNG joint. La guitare (B) si tu peux la produire en vrais calques alignés sur les masters ; sinon, dis-le clairement.
