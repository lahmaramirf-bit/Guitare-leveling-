# Inventaire du projet de base et état du portage

> Source : `handoff/base-project/Guitar_Leveling_2.html` (≈ 600 Ko : 530 lignes de HTML, 4 000 lignes de JS, abcjs 6.7.1 en CDN).
> Consigne du fondateur (2026-11-06) : **reprendre les fonctions et mécaniques, rien de la direction artistique** (pixel art, palettes, sprites, effets visuels) ; **remplacer le gacha** par des achats liés à la progression.
> Légende : ✅ porté et testé · 🟡 partiel · ⏳ lot suivant · ✖ volontairement non repris

## Architecture d'origine (reprise telle quelle)
- **Sauvegarde = registres** : `days` (quêtes et actions par jour), `items` (donjons, partitions, morceaux maîtrisés), `weeks`, `records`, `meta.peak`, `rep`, `repc`. L'XP n'est **jamais stockée** : elle est recalculée (`compute()`). ✅
- Courbe : `xpFor(L) = 75·L·(L−1)`, rangs E(1) D(17) C(32) B(45) A(64) S(78) N(100) + étoiles tous les 10 niveaux au-delà. ✅
- **Parité vérifiée** : `src/game/parity.test.ts` exécute le moteur d'origine et compare 200 sauvegardes aléatoires (XP, minutes, niveau, rang identiques). ✅
- Reprise d'une sauvegarde d'origine (`localStorage['guitar-leveling-v1']` ou import du JSON `{days, items, …}`). ✅ La synchro cloud de l'artefact Claude (`window.claude.use('db')`) ✖ n'existe pas hors claude.ai.

## Quêtes (accueil)
| Fonction | État |
|---|---|
| 7 quêtes quotidiennes (FOR, DEX, AGI, INT, PER, END, CHA), XP et durée | ✅ |
| Consignes adaptées au rang (E→N) + fiche de théorie/étude/morceau suivante non validée | ✅ |
| Morceau du jour = morceau en cours du répertoire ; révision d'une ombre 1 jour sur 3 | ✅ |
| Journée parfaite +80 XP ; série tenue avec 5/7 | ✅ |
| Zone de pénalité (hier manqué) + parchemin pour sauver la série | ✅ |
| Conseil du Système (112 conseils, 1 par jour, « autre conseil ») | ✅ |
| Limit Break : jauge 7/7 → défi plus dur que le rang, relance unique | ✅ |
| Portail du jour (32 défis par rang) + clé pour relancer | ✅ |
| 3 défis hebdo (16 au total), réinitialisés le lundi | ✅ |
| Ligne du Système (XP restante avant promotion) | ✅ |

## Héros
| Fonction | État |
|---|---|
| Niveau, rang, titre de rang, barres XP, statistiques FOR…CHA, heures | ✅ |
| Nom, choix d'avatar | ✅ (2 avatars de la nouvelle DA) |
| Garde-robe par emplacement | ✅ (titres visibles ; tenues = visuels en production) |
| Personnalisations « ★ Maîtrise » (46 objets : genres × paliers, 22 collections) | ✅ |
| **Invocation aléatoire, taux, pitié, coffres aléatoires, éclats, vitrine hebdo** | ✖ **remplacés** (décision D-016) |
| **Boutique liée à la progression** (prix en cristaux + condition : niveau, rang, série, quêtes, journées parfaites, portails, hebdos, records, boss, succès, morceaux maîtrisés, Limit Break) | ✅ nouveau |
| Cristaux dérivés de la progression (formule d'origine + primes fixes à la place des coffres) | ✅ |
| Potions d'XP | ✖ (gonflent l'XP sans pratique réelle) |
| Parchemin de série, clé de portail | ✅ (prix fixes) |
| Scène animée du héros (canvas, auras, familiers, cadres, tap, gratte) | ✖ DA d'origine — à refaire avec les sprites de la nouvelle DA |

## Donjons
| Fonction | État |
|---|---|
| 7 donjons (E→N) : objectifs, théorie, études, morceaux, boss, partitions du rang | ✅ |
| Rang effectif ne redescend jamais (`meta.peak`) | ✅ |
| Donjon suivant ouvert en avance après le boss (Limit Break de rang) | ✅ |

## Répertoire / Partitions
| Fonction | État |
|---|---|
| 173 morceaux + 20 partitions, 8 genres, 5 niveaux, conseils Lire/Jouer | ✅ |
| Filtres (genre, niveau, statut, recherche, adapté à mon rang) et tris | ✅ |
| Statuts à apprendre / en cours / maîtrisé ; plan en 8 étapes (+10 XP) | ✅ |
| Tempo noté, Limit Break de morceau (3 défis) | ✅ |
| Liens YouTube, MuseScore, IMSLP, This is Classical Guitar | ✅ |
| Morceaux perso (ajout, suppression) | ✅ |
| Collections (22 œuvres) et paliers de genre | ✅ |
| Compás flamenco / rythmes latinos (lecture audio) | ⏳ lot 3 |
| **Bibliothèque de partitions jouables** (abcjs, lecture, boucle, clic, tablature, note cliquable) | ⏳ lot 4 (validation « apprise » déjà possible dans Donjons) |
| **Lecture à vue** (génération d'exercices, 5 niveaux, vérification à l'écoute) | ⏳ lot 4 |
| **Quiz des symboles** + lexique (48 entrées), guide des tablatures | ⏳ lot 4 |

## Entraînement
| Fonction | État |
|---|---|
| Session guidée 15/30/45/60 min, blocs → quêtes, bonus de session | ✅ |
| Bibliothèque de 45 exercices (validation, plafond 12/jour) | ✅ (sans écoute) |
| Métronome : tempo, ±4, tap, 2/4 3/4 4/4 | ✅ |
| Métronome : subdivisions, mesures muettes, accélérateur | ⏳ lot 3 |
| Quiz du manche, lecture de portée, oreille (5 types), dictée rythmique | ⏳ lot 3 |
| Atlas des gammes, dictionnaire d'accords, grilles, générateur d'arpèges, jam | ⏳ lot 3 |
| Guitare de synthèse (Karplus-Strong), réverbération, sons du Système | ⏳ lot 3 (à réimplémenter, pas de DA) |

## Journal
| Fonction | État |
|---|---|
| Carte de pratique 12 mois, chiffres clés | ✅ |
| Armée des ombres (puissance qui décroît, grades, révision) | ✅ |
| Sources d'XP, records (5 types), 56 succès (+25 cristaux) | ✅ |

## Grimoire
| Fonction | État |
|---|---|
| Bases, 10 lois, Codex (112 conseils par thème), Méthode + séance type | ✅ (schémas du manche ⏳) |

## Réglages
Sons du Système on/off ⏳ (pas encore de sons) · remise à zéro ✅ · export/import ✅.
