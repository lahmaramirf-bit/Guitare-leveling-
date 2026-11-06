# Ce que Claude Code vérifie à la réception de panel_bg_*.png
`python3 scripts/check_panel_bg.py art/incoming/panel_bg_sakura.png --install`
- [ ] Nom exact `panel_bg_<sakura|cyberpunk|ombre>.png`, format PNG, 1400 × 620, opaque.
- [ ] Contraste de la zone héros (alerte si trop chargée).
- [ ] Captures `preview_panel_<thème>_desktop.png` / `_mobile.png` (+ JSON de mesures) : personnage entier, pieds sur le sol du décor, rien de coupé, titre/rang lisibles, actions de pratique visibles.
- [ ] Statut `candidate` tant que le fondateur n'a pas validé ; `approved` ensuite.
