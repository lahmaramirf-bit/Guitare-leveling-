Lis CLAUDE.md, docs/DECISION_LOG.md (D-040 à D-046) et art/BRIEF_GENERATION_CHIBI.md. Chantier 1 : art chibi. Pars de la branche la plus récente (`git fetch origin claude/hopeful-allen-8xgg1o` puis travaille dessus) ; pousse ton travail sur cette même branche. Si tu ne peux pas, pousse sur ta branche désignée et donne-moi en une ligne la commande pour la récupérer.

Je te joins un zip d'images produites avec ChatGPT selon art/BRIEF_GENERATION_CHIBI.md (lot [1 / 2 / 3], personnage [Rémi / Mélodie]).

À faire :
1. Décompresse dans `art/incoming/chibi/`, contrôle chaque fichier : 1024 × 1280 (ou 512 × 512 pour les icônes), transparence réelle (coins et bord à alpha 0), pieds sur la ligne de sol y = 1170 à ± 60 px (recale et redimensionne si nécessaire, sans déformer), ressemblance au master (visage, palette). Produis un tableau fichier → OK / à refaire + raison précise.
2. Intègre ce qui passe :
   - poses `*_guitar_hold` et `*_guitar_strum_01..04` → `PLAY_SPRITES` dans `src/avatar/manifest.ts` (statut `approved`), pour que le personnage joue quand on le touche (`src/screens/Hub.tsx`, `src/avatar/Avatar.tsx`) ; la guitare vectorielle dans le dos disparaît quand une image « guitare tenue » existe ;
   - `*_success` / `*_levelup` → états `celebrate` et montée de niveau ;
   - lot 2 → options de la Garde-robe et de la Boutique (`src/game/catalog.ts` : coiffures, hauts, chaussures, accessoires existants ou à créer), rendu complet du personnage selon l'option équipée ;
   - lot 3 → vignettes des objets dans la Boutique.
3. Ne modifie jamais `public/characters/boy_base.png` et `girl_base.png`. Garde le calcul d'XP intact. Tests `npm test` et `npm run e2e` verts, captures mobile 390 px et ordinateur 1280 px dans `docs/qa/`.
4. Réponds au format habituel : 1. Décisions, 2. Implémenté et testé, 3. Fichiers modifiés, 4. Art manquant et raisons (avec la liste exacte des fichiers à refaire et le prompt correctif à coller dans ChatGPT), 5. Prochaine étape.
