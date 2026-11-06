# 06 — Recette visuelle & fonctionnelle

| Gate | Critère d'acceptation | Preuve demandée |
|---|---|---|
| A — Fichiers | `boy_base.png`, `girl_base.png` 1024×1280 RGBA, coins alpha=0, pieds y≈1170. Source HD disponible. | inspection PNG + capture sur damier *uniquement dans la QA* |
| B — Style | personnages reconnaissables comme les deux masters retenus, sans SVG simplifié, armures, artefacts ni crops de screenshot | comparaison côte à côte avec références |
| C — Avatar | choix une fois à l'onboarding, compte stable au reload/reconnexion/navigation ; legacy accounts gérés | procédure de test + captures avant/après |
| D — Hub | personnage entier, pas coupé, rang et navigation lisibles en desktop et mobile | capture desktop et 390×844 mobile |
| E — Thèmes | Sakura, Cyberpunk, Ombre : trois décors et matières distincts, pas seulement bordures CSS | 3 captures sans labels |
| F — Équipement | guitar visible, correctement tenue et harmonisée avec le joueur ; statut inventory cohérent | captures 2 avatars × chaque guitare approuvée |
| G — Animation | idle fluide et non intrusive, reduced-motion respecté ; un **vrai rig** uniquement après source multicouche | vidéo ou GIF + fichiers de rig/pivots |
| H — Non régression | systèmes 7 quêtes, XP, niveaux, donjons, boutique sans aléatoire et apprentissage inchangés | tests existants + diff/rapport |
| I — Qualité technique | pas de console error, navigation clavier, supports min mobile, assets optimisés | résultats tests exécutés |

**Gates non atteignables à ce stade :** F et G car guitares et rig manquent. Ne pas les marquer PASS avec des placeholders. Gate E dépend des vrais décors ; si seuls des panneaux de couleur existent, statut FAIL/PENDING.

**Reporting obligatoire :** PASS / FAIL / BLOCKED / NOT_TESTED pour chaque gate, avec un lien de capture/commit si possible. Ne jamais écrire "testé" sans avoir réellement exécuté le test.
