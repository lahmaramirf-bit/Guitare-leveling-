# 02 — Pipeline animation 2D : niveau production

## Décision
**Pipeline hybride 2D : personnages articulés (cutout rig) pour hub/idle/strum + animations premium dessinées pour certains moments de boss/rang.** Pas de 3D, pas de personnages redessinés en SVG simple.

## Contrat de canevas
- **Export d'affichage temporaire actuel** : RGBA PNG 1024 × 1280, axe central x=512, ligne du sol y=1170 ; base originale 1122 × 1402 aussi incluse.
- **Source animable future** : PSD/KRA/équivalent calques, au minimum 2× résolution du rendu affiché si illustrateur disponible, **calques non aplatis** et séparations cachées réparées (dessiner les portions du bras derrière la manche, etc.).
- **Pivot commun** : pieds (512,1170). Les pivots articulation ne doivent pas être déduits des bounding boxes par fichier ; ils sont documentés dans la source de rig.
- **Personnage** : garde la même échelle à l'écran homme/femme, toute variation accidentelle entre états est un bug.

## Découpage minimal recommandé
**back_hair, front_hair, head, face_eyes/open, face_eyes/closed, face_mouth, neck, torso_base, top_front, top_back, upper_arm_L/R, forearm_L/R, hand_L/R, hips, thighs_L/R, calves_L/R, shoes_L/R, headphones_back/front, guitar_back, guitar_front, guitar_strap**. Les calques d'équipement doivent couvrir correctement les jonctions. Dessiner des éléments cachés pour permettre les rotations sans trous.

## Animation MVP et séquence de production
1. **Idle** : cycle doux 3–5 s, respiration du torse + oscillation discrète de la chevelure ; pas d'hyperanimation qui distrait la pratique.
2. **Interaction hub** : regard/bonjour, variation faciale et bras légère ; les articulations et sprites devront exister.
3. **Guitare équipée** : guitare portée en bandoulière sans strumming d'abord, bandoulière, superposition guitar_back/front, mains par-dessus les points de contact.
4. **Strum** : 1–2 s boucle démonstrative, main droite sur les cordes et gauche sur le manche, animation rythmée sans prétendre refléter des notes réellement détectées si non synchronisées.
5. **Célébration** : 0,8–1,5 s sur mission réussie, puis retour idle.
6. **Déplacement dans le hub** : uniquement lorsque vue 3/4, côté, dos et cycle de marche sont validés ; ne PAS promettre une vraie marche avec une seule pose frontale.

## Règles de qualité
- 60 FPS cible si possible, mais préférer une animation fluide fiable plutôt qu'une performance revendiquée sans test.
- Accès à la lecture de progression et aux exercices sans animation obligatoire. Support `prefers-reduced-motion`, pause hors écran, économie batterie.
- Pas de squash/stretch violent du visage, pas de déformation involontaire de la guitare, pas d'articulations disjointes ou de couture visible.
- **Interdiction** de valider une animation de tout-PNG en va-et-vient comme "rig 2D" : c'est seulement un effet d'interface temporaire.

## Paquet suivant attendu côté illustration (non encore livré)
`boy_rig_source.psd`, `girl_rig_source.psd`, dossiers de calques PNG avec même canevas + fichier pivots; `boy_idle`, `girl_idle` prévisualisations d'animation validées, puis `boy_guitar_idle` / `girl_guitar_idle`. **Rien de tout cela n'est dans le kit v0.3.**
