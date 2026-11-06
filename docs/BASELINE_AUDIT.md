# BASELINE AUDIT — Guitar Leveling

> Date : 2026-11-06 · Branche : `claude/hopeful-allen-8xgg1o` · Auteur : Claude Code (lead technique)
> Légende de statut : **VÉRIFIÉ** (constaté par commande/fichier) · **CONSTATÉ SUR CAPTURE** (visible sur image, non prouvé dans le code) · **SUPPOSÉ** (hypothèse à confirmer) · **MANQUANT**.

## 0. Verdict

**GL-001 est BLOQUÉ : aucun code source de l'application Guitar Leveling n'est disponible.**

| Constat | Statut | Preuve |
|---|---|---|
| Dépôt local `/home/user/Guitare-leveling-` vide (seulement `.git`, « No commits yet ») | VÉRIFIÉ | `git status`, `ls -la` |
| Dépôt distant `lahmaramirf-bit/Guitare-leveling-` vide (0 branche, 0 ref) | VÉRIFIÉ | `git ls-remote origin` → rien ; API GitHub `list_branches` → `[]` |
| Aucun autre dépôt accessible ne correspond à l'app (autres dépôts : `TTMC`, `Fil-rouge-`) | VÉRIFIÉ (noms seulement) | `list_repos` |
| Seule source fournie : le pack `Guitar-Leveling-Kit-Claude-Code-v1.zip` (handoff, 24 fichiers) | VÉRIFIÉ | intégrité SHA-256 OK via `handoff/scripts/check_package.py` |
| Le pack déclare lui-même ne pas contenir le code de l'artefact | VÉRIFIÉ | `handoff/README_START_HERE.md`, `handoff/docs/07_STATUS_REALITY_CHECK.md` |

Conformément à `CLAUDE.md` (« ne pas créer une fausse nouvelle app »), **aucune application n'a été créée** et la démo `handoff/reference_only/demo/` **n'a pas** été promue en app.
Conséquence : impossible de lancer l'app, de lister ses commandes build/test, de cartographier son stockage ou de capturer une baseline réelle. Ce document audite donc **le handoff** et reconstitue l'existant **d'après les captures**, en le signalant comme tel.

## 1. Ce qu'il faut me fournir (action fondateur, P0)

Par ordre de préférence — **une seule** de ces sources suffit pour débloquer GL-001 :

1. **Le code de l'artefact Claude actuel** : dans claude.ai, ouvrir l'artefact Guitar Leveling → menu `…` / bouton **Copier** ou **Télécharger** le code → enregistrer le fichier tel quel (probablement un unique `.jsx`/`.tsx` React ou un `.html`). Le déposer à la racine du dépôt dans `legacy-artifact/` (ou me l'envoyer en pièce jointe).
2. À défaut, si l'app a déjà été sortie de claude.ai : l'archive `.zip` du projet complet **avec** `package.json` et lockfile (sans `node_modules/`, sans secrets `.env`).
3. **Un export de sauvegarde** de votre progression actuelle (si l'app propose un export JSON) ou, sinon, une capture de l'écran Statistiques/Héros — pour tester la migration de données sans perte.
4. Facultatif mais utile : les captures des écrans non fournis (Quêtes, Héros/Personnaliser, Donjons, Répertoire, Entraînement, Journal, Coffre/gacha, Statistiques).

Dès réception, la reprise est : GL-001 (audit code) → GL-002 (baseline + tests) → fondations `CharacterConfig`/`ThemeConfig` (cf. `docs/IMPLEMENTATION_PLAN.md`).

## 2. Inventaire du handoff (VÉRIFIÉ)

Installé dans `handoff/` (copie conforme du zip, intégrité 24/24). `CLAUDE.md` copié à la racine (aucun fichier préexistant à fusionner).

| Fichier | Nature | Dimensions | Usage autorisé |
|---|---|---|---|
| `assets/reference/master-characters-APPROVED.png` | Planche concept composite, **source de vérité DA** | 1536×1024 RGBA | Référence visuelle uniquement |
| `assets/reference/art-and-three-themes-APPROVED.png` | Planche DA + 3 environnements | 1536×1024 RGB (sans alpha) | Référence visuelle uniquement |
| `assets/existing-app/*.png` (3) | Captures de l'app actuelle | 1305×913, 1268×1008, 867×646 | Preuve d'existence fonctionnelle (pas de fonctionnement) |
| `reference_only/demo/` | Mini démo HTML (avatar + thème + localStorage, avatars en SVG/recadrages) | — | **Ne pas intégrer** |
| `reference_only/previews/` | Captures de la démo | — | Contexte seulement |
| `templates/asset-manifest.example.json` | Schéma cible d'assets (tout `missing`) | — | Base du contrat `docs/contracts/` |
| `docs/01…07` | Brief, DA, backlog, spec assets, gates, ADR, reality check | — | Règles |

### Analyse des références (VÉRIFIÉ visuellement)

- **Personnages** : garçon brun ébouriffé (écouteurs, veste bleu nuit/crème/bordeaux, étui de guitare) et fille corail (queue de cheval, barrette clé de sol, veste académie). Proportions ≈2,4 têtes annotées sur les planches.
- **Grandes figures** : portraits **coupés à la taille** et superposés (la fille chevauche le garçon) → inutilisables comme sprite plein pied.
- **Figures plein pied** (vues, sets « Académie Musicale / Scène Urbaine / Virtuose ») : ~100–200 px de haut dans la planche → **trop petites** pour la cible 1024×1280 ; un upscale est interdit (`04_ASSET_SPEC`).
- **Pièces de personnalisation** (5 coiffures, 4 hauts, 3 bas, 5 accessoires, 4 guitares Commun/Rare/Épique/Légendaire) : dessinées **isolément**, sans ancrage commun, sans calques arrière/avant → ce sont des **vignettes d'inventaire concept**, pas des couches empilables.
- **Conclusion** : aucune couche/sprite de production n'existe. Toute intégration visuelle finale de personnage est **bloquée** sur GL-003 (production artistique multicouche).

## 3. Existant reconstitué d'après captures (CONSTATÉ SUR CAPTURE — non vérifié dans le code)

### Écrans et navigation
- **Accueil / fiche héros** : titre « GUITAR LEVELING », bouton **THÈMES**, bandeau de quête (« Vous avez reçu une quête : Reprendre la guitare »), scène de fond thématique (Sakura : torii, Fuji, soleil), avatar **pixel art** (garçon cheveux bleus, guitare acoustique).
- **Barre de navigation (7 onglets)** : Quêtes · Héros (badge « 2 ») · Donjons · Répertoire · Entraînement · Journal · Grimoire.
- **Grimoire** : sous-onglets Bases · Les 10 lois · Codex · Méthode ; « Méthode » = procédure « Apprendre un nouveau morceau » (≥9 étapes : Écoute, Repère, Marque les pièges, Doigtés, Section par section, Les pièges d'abord, Relie, Tempo +4 BPM, Musique…).
- **Sélecteur de thèmes (modale)** : **au moins 7 thèmes** visibles : Ombre, Cyberpunk, Moe moe, Manga, Arcade 8-bit, Sakura (sélectionné), + 1 coupé en bas. Chaque carte : aperçu de scène, 3 pastilles de palette, sous-titre. Mention « …sur tous tes appareils » en haut → **SUPPOSÉ** : persistance synchronisée (stockage persistant d'artefact Claude).

### Données de progression visibles
| Donnée | Valeur affichée | Interprétation |
|---|---|---|
| Nom du héros | AMIR | Profil joueur |
| Niveau | NIV. 1 | Courbe de niveau |
| Titre | « Maladroit » + badge « Débutant éveillé » | Titres liés au niveau/rang |
| Rang | E (losange) | Rangs E→S |
| XP du niveau | 0 / 150 | Seuil niveau 1→2 = 150 XP |
| Vers le rang D · niveau 17 | 0 / 20 400 | XP cumulé pour rang D (atteint au niveau 17) |
| Série | 0 jour | Streak quotidien |
| Monnaies | 0 cristaux, 0 éclats | Deux monnaies (gacha / fragments ?) |
| Coffre du jour | bouton | Récompense quotidienne |
| Statistiques | repliable | Stats détaillées |
| PERSONNALISER | bouton | **Personnalisation existante** (pixel art) |

### Ce qu'on ne sait PAS (à auditer dans le code)
Framework (React artefact ? HTML ?), clé(s) et format de sauvegarde, formules XP/rang exactes, table de gacha et taux, contenu des Donjons/Répertoire/Entraînement/Journal, existence d'audio/micro, existence de tests, dépendances externes (CDN, polices pixel).

## 4. Risques et conflits identifiés

| ID | Risque | Gravité | Mitigation proposée |
|---|---|---|---|
| R1 | **Pas de code** → aucun travail d'intégration possible | Bloquant | Fournir l'export (§1) |
| R2 | **Conflit thèmes** : l'app a ≥7 thèmes, la directive en garde 3. Retirer Moe moe/Manga/Arcade/… = **suppression d'une fonction existante** (arbitrage fondateur requis par `CLAUDE.md`) | Haute | Décision D-003 en attente : proposition = masquer (feature flag) plutôt que supprimer, et migrer l'id sauvegardé vers un des 3 thèmes |
| R3 | **Changement de style d'avatar** : pixel art actuel → chibi illustré. La personnalisation pixel existante doit rester fonctionnelle tant que les sprites chibi ne sont pas validés | Haute | Renderer double (`legacy-pixel` / `chibi-layered`), bascule par flag, défaut = legacy |
| R4 | **Stockage d'artefact Claude** (SUPPOSÉ `window.storage`) indisponible hors claude.ai → perte de progression à l'export | Haute | Adaptateur de stockage (artefact → localStorage) + export/import JSON avant toute migration |
| R5 | Assets de production inexistants (planches aplaties, petites silhouettes) | Bloquant pour G1/G2 | Commande artistique multicouche (GL-003) ; aucun upscale |
| R6 | Écart de périmètre assets : la planche « Plan de production » liste 6 coiffures/4 hauts/4 bas/8 accessoires/4 guitares ; la spec MVP en demande 2/2/1/1/2 par avatar | Moyenne | Livrer d'abord le mini-pack de la spec ; catalogue étendu ensuite |
| R7 | Set « Virtuose » : garçon cheveux blancs / fille lavande — risque de dériver l'identité (brun/corail) | Moyenne | Traiter blanc/lavande comme **options de coiffure déblocables**, base toujours brun/corail |
| R8 | Environnements de la planche personnages (Village/Académie/Grande Scène) ≠ 3 thèmes (Sakura/Cyberpunk/Ombre) | Faible | Les 3 thèmes font foi ; les lieux sont des contenus/futurs décors, pas des thèmes |
| R9 | Droits sur l'art (probablement généré par IA) et polices | Moyenne (avant commercialisation) | Gate A-008 : provenance/licence dans le manifeste |
| R10 | Gacha : risque réglementaire si monétisé | Moyenne | MVP : monnaie gagnée uniquement (A-005) ; afficher les taux |
| R11 | Dépendance Figma (quota Starter atteint) | Faible | Le build ne dépend pas de Figma |

## 5. Gate G0 — état

- [ ] Dépôt original identifié — **NON (absent)**
- [x] Git status et branche de travail sûrs — branche `claude/hopeful-allen-8xgg1o`, rien supprimé
- [ ] Commandes install/lancer/build/test vérifiées — **impossible sans code**
- [~] Carte écrans/XP/rangs/monnaie/quêtes/gacha/stockage — **partielle, d'après captures uniquement**
- [x] Réel vs simulé distingué — oui, dans ce document
