# Guitar Leveling

RPG d'apprentissage réel de la guitare : chaque minute jouée fait progresser ton héros (XP, rangs E → S, quêtes, coffre du jour, invocation cosmétique, répertoire, journal, grimoire). Trois univers : Sakura, Cyberpunk, Ombre.

**Statut v0.2** : les mécaniques du projet de base (`handoff/base-project/`) sont portées — 7 quêtes adaptées au rang, Limit Break, portails, défis hebdo, 7 donjons, répertoire de 193 morceaux avec plan et collections, armée des ombres, records, 56 succès, grimoire, session guidée — avec un calcul d'XP **identique à l'original** (test de parité). Le gacha est remplacé par une **boutique liée à la progression**. Salles d'entraînement audio et partitions jouables : lots suivants (`docs/BASE_FEATURE_INVENTORY.md`). Personnages = **illustrations concept** en attendant les sprites (`art/BRIEFS_CHATGPT.md`). Non déployée publiquement.

## Lancer

```bash
npm install
npm run dev        # http://localhost:5173
```

Autres commandes : `npm test` (logique de jeu), `npm run build` (production dans `dist/`), `npm run e2e` (parcours navigateur, nécessite Playwright + Chromium, après `npm run build`), `npm run validate:contracts`.

## Organisation
- `src/content/` — contenu pédagogique extrait du projet de base (`tools/extract*.cjs`).
- `src/game/` — moteur pur et testé : calcul d'XP, quêtes, donjons, répertoire, boutique, sauvegarde.
- `src/screens/` — écrans ; `src/appearance/` — thèmes et portrait ; `src/audio/` — métronome.
- `docs/contracts/` — contrats d'apparence (thèmes, configuration perso, manifeste d'assets).
- `art/` — briefs ChatGPT et dépôt des images reçues (`art/incoming/`).
- `handoff/` — pack de DA d'origine (références approuvées).
- `docs/` — audit, plan, décisions, rapport QA.
