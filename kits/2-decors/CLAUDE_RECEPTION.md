Lis CLAUDE.md et docs/DECISION_LOG.md (D-043, D-044). Chantier 2 : décors. Pars de la branche la plus récente (`git fetch origin claude/hopeful-allen-8xgg1o`) et pousse dessus ; sinon ta branche désignée + la commande pour la récupérer.

Je te joins `panel_bg_cyberpunk.png` et/ou `panel_bg_ombre.png` produits avec ChatGPT.
1. `python3 scripts/check_panel_bg.py art/incoming/<fichier> --install` pour chacun ; si le fichier arrive en WebP ou JPG, convertis-le en PNG sans retouche et dis-le.
2. Dans `src/appearance/worlds.ts`, passe le thème concerné en `status: 'candidate'` avec `file: './art/panel/<fichier>'` ; ajuste `groundY` si le sol réel n'est pas à 90 % (mesure-le).
3. Captures réelles de l'accueil pour ce thème, mobile 390 px et ordinateur 1280 px, fille et garçon : personnage entier, pieds sur le sol, boutons et compteurs lisibles. Mesure la luminance des coins où s'affichent les boutons.
4. `npm test`, `npm run e2e`, `python3 scripts/validate_contracts.py` verts ; mets à jour `docs/contracts/asset-manifest.json`, `docs/DECISION_LOG.md`, `docs/QA_REPORT.md`.
5. Réponds au format habituel (Décisions / Implémenté et testé / Fichiers / Art manquant avec prompt correctif ChatGPT si besoin / Prochaine étape). Ne marque rien `approved` sans mon accord.
