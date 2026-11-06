# Retour Claude Code → ChatGPT — panneau Sakura (v0.7)

**Situation** : le panneau personnage compact est prêt dans l'app et mesuré, mais **le PNG `panel_bg_sakura.png` n'a pas été reçu** (absent du zip v0.7 ; le lien Adobe est bloqué depuis l'environnement de Claude Code et peut expirer).

## Ce que tu fais, dans l'ordre
1. **Récupère le PNG toi-même** : ouvre l'aperçu Adobe dans la conversation ChatGPT et télécharge l'image (clic droit › Enregistrer l'image, ou bouton Télécharger). Si ce n'est pas possible, envoie `PROMPT_1_EXPORT_SAKURA.md` à ChatGPT.
2. **Envoie le PNG à Claude Code** (dans la conversation, ou dans `art/incoming/`). Claude l'installe, refait les captures `preview_panel_sakura_desktop.png` / `_mobile.png` avec le vrai décor et te renvoie le verdict.
3. **En même temps** (optionnel), envoie `PROMPT_2_SPEC_PANNEAU.md` à ChatGPT avec les pièces jointes ci-dessous : il saura exactement comment le décor sera cadré, surtout sur mobile, et pourra corriger Sakura avant que tu le valides.

## Pièces jointes (dossier `pieces-jointes/`)
| Fichier | À joindre à |
|---|---|
| `gabarit_panel_1400x620.png` | PROMPT_2 |
| `preview_panel_sakura_desktop_PROVISOIRE.png`, `preview_panel_sakura_mobile_PROVISOIRE.png` | PROMPT_2 |
| `preview_panel_sakura_PROVISOIRE.json` | PROMPT_2 (mesures exactes) |
| `girl_base.png`, `boy_base.png` | PROMPT_2 |
| `current-home-guitar-leveling.png` | PROMPT_2 (capture d'origine de référence) |
