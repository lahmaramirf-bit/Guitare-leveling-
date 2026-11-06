# GUITAR LEVELING — Handoff vers Claude Code

> **Version de passation : 6 novembre 2026.** Ce dossier est un **brief + des références + une démo isolée**, **pas** le code source de ton artefact Claude, et **pas** des assets multicouches terminés.

## Utilisation recommandée (3 actions)

1. Place **l'export complet de ton artefact Claude ou ton véritable dépôt** dans un dossier de projet. Ne le remplace pas par `reference_only/demo/index.html`.
2. Décompresse ce pack à la racine du **même projet**, en conservant son dossier sous `handoff/` (ou copie ses fichiers à la racine si tu pars d'un dossier vide). Copie aussi `handoff/CLAUDE.md` en `./CLAUDE.md` à la racine du dépôt, **sans écraser** un fichier existant : fusionne les instructions s'il y en a déjà un.
3. Lance Claude Code **à la racine du véritable projet**, puis colle le contenu de `PROMPT_A_COLLER_DANS_CLAUDE_CODE.md`. S'il n'y a pas de code source, Claude doit s'arrêter après le constat et demander l'export, pas inventer un remplacement de l'app.

Les références font foi : `assets/reference/master-characters-APPROVED.png` pour les personnages ; `assets/reference/art-and-three-themes-APPROVED.png` pour les 3 univers. Les anciennes captures `assets/existing-app/` sont utiles pour préserver les fonctionnalités (elles **ne** sont **pas** la nouvelle DA à recopier).

## Quel est le premier vrai livrable attendu de Claude Code ?

- Audit réel de l'app existante et liste des fonctions vérifiées, avec captures/constats.
- Plan de migration **incrémental**, sans réécriture générale.
- Contrat de données de personnalisation et renderer isolé *seulement si* les vrais assets sont disponibles ; sinon prototype de prévisualisation explicitement signalé.
- Tests et rapport d'intégration qui prouvent l'absence de régression sur les quêtes, XP, gacha, objectifs et exercices.

## Dossiers

- `CLAUDE.md` : consignes persistantes pour Claude Code.
- `PROMPT_A_COLLER_DANS_CLAUDE_CODE.md` : ton message de lancement.
- `docs/` : le contrat produit, l'art contract, le plan, le backlog et les critères de recette.
- `assets/reference/` : illustrations principales approuvées (images concept, non découpées en calques).
- `assets/existing-app/` : captures de l'artefact actuel, informatives uniquement.
- `reference_only/demo/` : démo HTML séparée, **à ne pas substituer à l'app réelle**.
- `reference_only/previews/` : screenshots de la démo, pas preuves de fonctionnement de l'app réelle.
- `templates/asset-manifest.example.json` : contrat de structure avec états `missing/reference_only` ; aucun asset manquant n'est inventé.
- `scripts/check_package.py` : contrôle d'intégrité des fichiers fournis, sans dépendance externe.

## Réalité actuelle (à ne pas maquiller)

Aucun code source complet de l'artefact Claude original n'était disponible au moment de préparer le pack. Aucun PSD/AI multicouche ni sprite haute résolution séparé conforme n'a été livré. Les images approuvées sont **des planches conceptuelles**. Les grands portraits sont partiellement coupés ; les petits avatars plein pied ont une faible résolution. Une reprise artistique contrôlée est nécessaire pour fabriquer des vrais layers.

**Lien Figma de travail :** https://www.figma.com/design/Bf0vUmC9kZjOngBHlxipdt (contient la référence, ne présume pas qu'il contient les assets finaux). Les appels Figma Starter ont atteint leur limite pendant une session précédente ; le projet ne doit pas en dépendre.
