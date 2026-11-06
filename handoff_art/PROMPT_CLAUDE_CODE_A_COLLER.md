# PROMPT — CLAUDE CODE / GUITAR LEVELING

Tu es le **lead developer responsable de l'intégration** de Guitar Leveling v0.2. Je t'ai ajouté un dossier `handoff_art/` produit par mon directeur artistique. **Travaille uniquement dans mon vrai dépôt React + TypeScript existant.** Pas de nouveau site démo ou de seconde application.

Lis avant toute modification :
- `handoff_art/README_START_HERE.md`
- `handoff_art/manifest/asset_status.json`
- Tous les documents `handoff_art/docs/01_...` à `handoff_art/docs/07_...`
- Les images `handoff_art/assets/characters/masters/boy_base.png`, `girl_base.png`
- Les planches `handoff_art/assets/references/*APPROVED.png`.

## État métier à préserver, sans régression
Guitar Leveling v0.2 est décrit comme disposant des 7 quêtes/jour, séries, Limit Break, portail, défis hebdo, 7 donjons E → S+, répertoire 193 morceaux, 56 succès, journal, grimoire, exercices, métronome et calcul XP testé contre l'original. **Vérifie cet état dans le dépôt** ; ne le déduis pas de ce prompt. Le gacha a été remplacé par une boutique : déblocage des cosmétiques par progression musicale puis achat en cristaux gagnés dans l'app, **aucun hasard et aucun argent réel**.

## Travail attendu, par lots strictement isolés
**Lot A — inspection/baseline :** inspecte routes, composants avatar, sérialisation de l'onboarding, styles de thèmes, shop et tests. Crée un état des lieux vérifiable, relève les éléments manquants, exécute les tests disponibles. N'ajoute pas de dépendance avant justification.

**Lot B — identité et hub :** intègre les **deux véritables PNG RGBA de base** du kit (pas de crops de la planche), chacun visible entièrement dans un hub central. À la première ouverture d'un compte, l'utilisateur choisit **UNE FOIS** garçon ou fille ; ce choix devient l'identité de son avatar et reste stable sur toutes les pages et sessions. Pas de contrôle homme/femme dans les écrans courants. Prévois le cas où les données locales/serveur divergent et les comptes existants non initialisés. La logique XP/quête/shop est hors scope.

**Lot C — direction artistique thématique :** implémente les thèmes Sakura, Cyberpunk et Ombre comme des **ensembles visuels complets** (décor, éléments, textures, luminosité, panneaux et effets atmosphériques, pas seulement variables CSS de couleur). Ne prétends pas que le kit contient les décors finaux : si manquants, crée des points d'accueil propres et consigne explicitement le manque d'asset, sans remplacer par de mauvais dessins. Responsive desktop/mobile, zone centrale lisible, navigation accessible.

**Lot D — préparation anim / accessoires (sans inventer les assets) :** crée des slots et points d'ancrage documentés pour guitar_back / body / guitar_front, les états idle/celebrate/strum/walk et les calques futurs. Les avatars fournis sont **aplatis** : un effet de bounce sur tout le PNG n'est pas un vrai rig. N'essaie pas de découper automatiquement le PNG en bras/jambes ni de générer des parties en SVG simplifié ; signale `blocked_by_missing_art` pour le rig, les strums réalistes, les variantes de vêtements et guitares non reçues. Garde le résultat propre pour le futur pipeline 2D hybride.

## DoD pour toute livraison
- Aucune dégradation des systèmes métier v0.2 ni du calcul XP.
- Sélection du garçon/fille une seule fois, sauvegardée et testée en reload, navigation et reconnexion.
- Avatar complet sans coupe sur chaque taille d'écran ; fond transparent vérifié, pas de screenshot ni décoration importée en tant que personnage.
- Changement Sakura/Cyberpunk/Ombre = changements d'environnement/texture/composants, avec preuves visuelles avant/après.
- `prefers-reduced-motion` respecté ; boutons/accessibilité clavier ; mobile portrait testé.
- Tests utiles (et résultats réellement exécutés), captures avant/après, liste des fichiers modifiés et note sur ce qui reste bloqué par l'art.

## Règles de conduite
1. **Aucune refonte artistique improvisée** : les portraits du kit sont définitifs comme illustration de base validée ; les planches APPROVED font foi. Ne touche pas aux visages/proportions.
2. **Préserve l'existant** : audit puis patchs petits et réversibles, pas de rewrite du domaine.
3. **Ne revendique pas une animation/personalisation que les assets ne permettent pas** : une image aplatie reste une image aplatie.
4. **Pas de gacha, pas de nouvelle monnaie, pas de microtransactions**.
5. **Pas de décor générique ajouté pour "faire joli"**. Un vrai asset de fond doit être approuvé par la direction artistique.
6. Quand tu rencontres un blocage artistique, décris **l'image exacte à produire**, le format, le point d'ancrage et l'écran impacté pour que je le renvoie à ChatGPT côté DA.

## Compte-rendu obligatoire à chaque échange
Termine chaque réponse avec ces cinq rubriques :
- **Décisions prises**
- **Modifications vérifiables** (fichiers/commits, captures, tests)
- **Livrables attendus du pôle illustration** (nom exact des PNG/PSD, état et critères)
- **Blocages / risques**
- **Prochain lot recommandé**

Commence maintenant par **l'audit du dépôt**, puis propose la première petite modification qui permettra de mettre les deux avatars complets dans l'app existante. Si le dépôt est sain, réalise le premier lot qui ne dépend pas d'illustrations manquantes et vérifie-le. Ne crée pas une autre démo.
