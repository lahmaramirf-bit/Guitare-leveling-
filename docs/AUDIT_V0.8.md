# Audit fonctionnel et roadmap, v0.8 (2026-11-06)

Méthode : lecture du code (`src/`), parcours réel dans Chromium (Playwright), tests unitaires et E2E.
Légende :
- **Fonctionnelle** : utilisable de bout en bout et testée.
- **Partielle** : présente, mais incomplète ou peu pratique.
- **Manquante** : inexistante.

## 1. Fonctionnalités réelles

| Domaine | État | Constat vérifié |
|---|---|---|
| Séance guidée (15/30/45/60 min, blocs chronométrés) | **Fonctionnelle** (corrigée en v0.8) | Avant : un changement d'onglet (Métronome) ou un rechargement remettait la séance à zéro, mesuré 02:57 → 03:00. Maintenant persistante, horloge réelle, métronome intégré, bilan. |
| Temps de pratique | **Partielle** (nouveau en v0.8) | Enregistré pour la séance guidée (`days[d].prac`, en secondes). Pas encore pour les exercices ni les morceaux, et pas de graphique dans le Journal. |
| Métronome | **Partielle** | Clic Web Audio stable, tap tempo, mesures 2/4, 3/4 et 4/4, tempo mémorisé (v0.8). Manquent les subdivisions, les mesures muettes, l'accélérateur et un préréglage par exercice. |
| Exercices (bibliothèque) | **Partielle** | Liste filtrable, case « fait » qui rapporte de l'XP. Pas de lancement d'un exercice avec minuteur et tempo conseillé, ni de tablature audio. |
| Répertoire (193 morceaux) | **Fonctionnelle** | Statuts, plan en étapes, tempo, morceaux perso, maîtrise. Pas de minuteur de travail par morceau. |
| Quêtes du jour, portail, défis hebdo, Limit Break | **Fonctionnelle** | Moteur identique à l'original (test de parité, 200 sauvegardes). |
| XP, rangs, série, succès | **Fonctionnelle** | Recalculés depuis les registres. |
| Cristaux et boutique (sans hasard, sans argent réel) | **Fonctionnelle** | Achat conditionné à la progression ; garde-robe et équipement enregistrés. |
| Rendu de l'équipement sur l'avatar | **Manquante** (art) | Aucun calque de guitare ni de tenue livré. |
| Sauvegarde locale, export et import, reprise de l'original | **Fonctionnelle** | `localStorage`, nettoyage champ par champ, export JSON. Pas de synchronisation entre appareils. |
| Reprise de séance | **Fonctionnelle** (v0.8) | Bouton « Reprendre ma séance » sur l'accueil après rechargement. |
| Journal (records, révisions) | **Fonctionnelle** | N'affiche pas encore le temps pratiqué. |
| Salles audio (manche, oreille, rythme, accords…) | **Manquante** | Annoncées « lot 3 », non portées. |
| Partitions et lecture à vue | **Manquante** | Non portées. |
| Hors ligne / application mobile | **Partielle** | Build statique, aucune ressource externe. Pas de service worker, pas de Capacitor. |

## 2. Parcours d'entraînement (8 étapes demandées)

| Étape | Avant v0.8 | Après v0.8 |
|---|---|---|
| 1. Ouvrir l'app | OK | OK |
| 2. Voir les objectifs du jour | OK (accueil : quêtes x/7, morceau, rang) | OK, plus le temps pratiqué du jour |
| 3. Choisir exercice ou morceau | Partiel : la séance impose ses blocs, et les exercices ne se lancent pas | inchangé (lot A) |
| 4. Démarrer une séance | OK | Plan affiché avant de démarrer |
| 5. Outils musicaux | **Bloquant** : ouvrir le métronome effaçait la séance | Métronome **dans** la séance ; l'onglet Métronome ne perd plus rien |
| 6. Terminer | OK | OK, minuteur juste même onglet en arrière-plan |
| 7. Enregistrer la progression | Partiel : quêtes oui, temps non | Quêtes et temps de pratique |
| 8. Résultat et récompenses | Faible : « Session terminée » sans chiffres | Bilan : temps, blocs, XP gagnée, cristaux, quêtes x/7, série |

## 3. Roadmap, par valeur pour l'utilisateur

### Lot A : expérience de pratique (prochaine itération)
1. **Lancer un exercice ou un morceau** directement : minuteur, métronome préréglé au tempo conseillé (`EXOS[].bpm`, `rep[].bpm`), « terminé » qui coche l'exercice ou l'étape du plan et enregistre le temps.
2. **Séance personnalisable** : remplacer un bloc par un exercice ou par le morceau en cours.
3. **Temps de pratique partout** : exercices et morceaux, avec le total du jour et de la semaine sur l'accueil.
4. Écran **actif pendant la séance** (Wake Lock API), et minuteur en plein écran sur mobile.
5. Métronome : subdivisions, accélérateur (+N BPM toutes les X mesures), mesures muettes.

### Lot B : progression motivante
1. **Journal de pratique** : minutes par jour sur 7 et 30 jours, série, morceaux en cours et maîtrisés.
2. Bilan de séance relié aux **objectifs du rang** (ce qui a avancé, ce qui reste).
3. Records de tempo par exercice, liés au métronome (« nouveau record à 84 BPM »).
4. Montrer dans la boutique **quelle pratique** débloque chaque objet (déjà calculé par `req`).

### Lot C : expérience d'application premium
1. Navigation mobile : barre du bas à 5 entrées (Accueil, Pratiquer, Morceaux, Progrès, Profil), les autres dans « Plus ».
2. **Hors ligne** : service worker (vite-plugin-pwa, léger) et installation sur l'écran d'accueil.
3. États vides, transitions, accessibilité (lecteur d'écran, focus), tests Safari et Firefox.
4. Sauvegarde : export automatique et rappel de sauvegarde ; plus tard, synchronisation (backend, décision produit).

## 4. Capacitor (évaluation, aucune migration engagée)
Verdict : **adapté**. Le code React est réutilisable tel quel (build Vite statique, aucune ressource externe), mais il faut traiter quatre risques.

| Risque | Détail | Solution |
|---|---|---|
| Audio iOS | La WebView (WKWebView) ne démarre le Web Audio qu'après un geste de l'utilisateur, ce qui est déjà le cas (bouton Lancer). En revanche, le **bouton silencieux de l'iPhone coupe le Web Audio**. | Configurer la session audio iOS en mode lecture, via un plugin natif de session audio, ou le contournement avec un élément `<audio>` silencieux. |
| Métronome écran verrouillé ou app en arrière-plan | Les minuteurs JS sont suspendus, donc le métronome s'arrête. | Accepter (usage au premier plan) et garder l'écran allumé avec un plugin keep-awake. Le minuteur de séance, basé sur l'horloge depuis v0.8, reste juste au retour. |
| Sauvegardes | Le `localStorage` d'une WebView iOS peut être purgé si le stockage manque. | Stockage natif (`@capacitor/preferences` ou fichiers) en miroir de `localStorage`, et export automatique. |
| Hors ligne | Les fichiers sont embarqués dans l'app, donc OK. | Rien à faire ; ajouter un service worker pour la version web (lot C). |

## 5. Blocages

| Blocage | Cause exacte | Solution proposée |
|---|---|---|
| Sakura « V3.1 » | Aucun fichier V3.1 n'a été reçu. V3 est la dernière candidate. | V1 active et V3 candidate, comme demandé. Plus de variante sans demande explicite. |
| Équipement visible sur l'avatar | Aucun calque de guitare ou de tenue avec ancrages. | Lot ChatGPT : guitare de départ en 3 calques et JSON d'ancrages. |
| Animations | Masters aplatis, sans rig. | Après les guitares. Rien ne bloque les lots A, B et C. |
| Salles audio | Portage lourd (environ 2 000 lignes) et guitare de synthèse à valider à l'oreille. | Après le lot A. |
