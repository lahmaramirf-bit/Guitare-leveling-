# GUITAR LEVELING — PASSATION ART + ANIMATION v0.3

**Destination : Claude Code travaillant DANS le dépôt Git existant de Guitar Leveling v0.2.**  
**Notre rôle (ChatGPT) : direction artistique, production/validation des références et spécifications. Zéro modification du code de l'application.**

## Démarrage (3 étapes)
1. Décompresser l’archive à la racine du dépôt Guitar Leveling v0.2, puis **renommer le dossier extrait en `handoff_art`** (sans remplacer les sources `src/`). Le prompt suppose exactement ce chemin : `./handoff_art/`.
2. Envoyer à Claude Code le contenu de `PROMPT_CLAUDE_CODE_A_COLLER.md` ou lui demander de lire ce fichier, `docs/*` et `manifest/asset_status.json`.
3. Exiger une PR/petit lot testable, pas une réécriture de l'app.

## Ce que contient réellement ce kit
- `assets/characters/masters/boy_base.png`, `girl_base.png` : **vrais PNG RGBA 1024×1280** des deux modèles que le fondateur a qualifiés d'exceptionnels, réduits et recentrés sans changement artistique ; personnages *aplatis*, donc non articulables pour l'instant.
- `assets/characters/originals/` : **sources haute résolution 1122×1402** non retouchées. Elles font foi pour les détails ; ne jamais les remplacer par les anciens SVG ou découpages de screenshot.
- `assets/references/` : planches APPROUVÉES, utilisées comme garde-fous de style. Attention : concept art composite, **pas** des sprites transparents prêts à animer.
- `assets/app-captures/` : captures de l'app Claude Code v0.2 en contexte, **pas** un cahier des charges UI final.
- `docs/` : spécifications du hub, choix initial d'avatar, mouvements, guitare, thèmes, recette, backlog, reporting.
- `manifest/asset_status.json` : inventaire distinguant **réel** et **non disponible**.

## Non inclus — ne pas inventer
- Pas de PSD/KRA multicouche, pas de membres séparés, pas de rig Live2D/Spine/Rive.
- Pas d'animations image-par-image approuvées.
- Pas de 4 guitares indépendantes, pas de fonds 1920×1080 approuvés.
- Pas de synchronisation réseau testée sur le dépôt de l'utilisateur ; pas de code source v0.2 dans cette archive.

## Recommandation de lead
**Milestone 1 :** affichage propre du personnage statique intégral et choix initial persistant, hub 3 thèmes avec décor complet (se servir des visuels actuels seulement s'ils sont adaptés et explicitement étiquetés comme provisoires). **Milestone 2 :** vraie fabrication du rig 2D + guitares, contrôle DA. **Milestone 3 :** customisation visible, animations et recette sur mobile. Les modules pédagogiques restent inchangés.

**Compromis provisoire autorisé :** animation très légère du personnage *entier* (translation de 2–4 px, léger clignement si asset disponible) uniquement si honnêtement désignée "placeholder d'animation" ; interdiction de présenter cela comme un modèle 2D articulé.
