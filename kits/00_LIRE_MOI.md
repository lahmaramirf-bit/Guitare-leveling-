# Kits par chantier — Guitar Leveling (état du 15 novembre 2026, v0.9.1)

| Conv. | Chantier | Outil | Dossier | Peut tourner en parallèle ? |
|---|---|---|---|---|
| 1 | Art chibi : poses, personnalisation, icônes | **ChatGPT Plus** (génération d'images) + **Claude Code** pour contrôler et intégrer | `1-art-chibi/` | Oui |
| 2 | Décors Cyberpunk et Ombre | **ChatGPT Plus** + Claude Code pour intégrer | `2-decors/` | Oui |
| 3 | Interface : tous les écrans au style de l'accueil | **Claude Code** seul | `3-interface/` | **Après** ou **avant** 4 et 5, pas en même temps (même code) |
| 4 | Progression : F → SSS sur 200 niveaux, quêtes jour/semaine/mois, clés | **Claude Code** seul | `4-progression/` | idem |
| 5 | Pratique : lancer un exercice ou un morceau, journal de pratique | **Claude Code** seul | `5-pratique/` | idem |

## Quel abonnement
- **ChatGPT Plus** (environ 20 €/mois) suffit pour les chantiers 1 et 2 : génération d'images avec références jointes et fond transparent. C'est l'outil que tu connais déjà et qui a produit Sakura. Pas besoin de Midjourney ni d'autre chose.
- **Claude Code** (déjà en place) pour tout le reste.

## Règles pour les conversations Claude Code (3, 4, 5)
- Une conversation = un chantier. Colle le `PROMPT_CLAUDE.md` du dossier tel quel au début.
- Lance-les **l'une après l'autre** (3 puis 4 puis 5, ou dans l'ordre que tu veux), jamais deux en même temps : elles modifient les mêmes fichiers.
- Chaque prompt demande à Claude de partir de la branche la plus récente et d'y pousser son travail. Pour voir le résultat chez toi : `cd C:\Users\Lahmar\Guitare-leveling-`, `git pull origin claude/hopeful-allen-8xgg1o`, `npm run dev`.

## Règles pour les conversations ChatGPT (1, 2)
- Une conversation ChatGPT par chantier, en joignant les `pieces-jointes/` **à chaque demande d'image** (ChatGPT oublie vite le style).
- Tu récupères chaque image en **fichier PNG téléchargé** (jamais un lien), tu les mets dans un zip, et tu colles `CLAUDE_RECEPTION.md` dans la conversation Claude Code du chantier avec le zip.
