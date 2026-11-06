# Guitar Leveling

RPG d'apprentissage réel de la guitare : chaque minute jouée fait progresser ton héros (XP, rangs E → S, quêtes, coffre du jour, invocation cosmétique, répertoire, journal, grimoire). Trois univers : Sakura, Cyberpunk, Ombre.

**Statut v0.1** : application web jouable en local, testée (unitaires + parcours Chromium desktop/mobile). Les personnages affichés sont des **illustrations concept** (badge « CONCEPT ») ; les tenues ne seront dessinées sur l'avatar qu'une fois les sprites en calques livrés (voir `art/BRIEFS_CHATGPT.md`). Non déployée publiquement.

## Lancer

```bash
npm install
npm run dev        # http://localhost:5173
```

Autres commandes : `npm test` (logique de jeu), `npm run build` (production dans `dist/`), `npm run e2e` (parcours navigateur, nécessite Playwright + Chromium, après `npm run build`), `npm run validate:contracts`.

## Organisation
- `src/game/` — logique pure et testée : niveaux, séances, quêtes, gacha, sauvegarde.
- `src/screens/` — écrans ; `src/appearance/` — thèmes et portrait ; `src/audio/` — métronome.
- `docs/contracts/` — contrats d'apparence (thèmes, configuration perso, manifeste d'assets).
- `art/` — briefs ChatGPT et dépôt des images reçues (`art/incoming/`).
- `handoff/` — pack de DA d'origine (références approuvées).
- `docs/` — audit, plan, décisions, rapport QA.
