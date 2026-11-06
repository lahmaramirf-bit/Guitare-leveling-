# 03 — Hub central & thèmes complets

## Hub = page d'accueil principale, pas un simple profil
Composition : décor illustré plein écran, personnage entier au centre et sur un plan de sol crédible, espace clairement consacré aux entrées **Quêtes / Entraînement / Donjons / Répertoire / Boutique / Journal** selon l'existant. Statut XP/rang en surimpression lisible ; action commencer l'entraînement accessible en 1 clic/tap ; univers qui récompense les progrès de l'instrument.

**Vue desktop** : personnage approx. 35–55% de la hauteur utile, perspective de scène cohérente, espace libre latéral pour UI. **Vue mobile portrait** : personnage visible de la tête aux pieds, couche décor reconfigurée en vertical (pas simple crop destructeur du 16:9), menu tactile ancré bas, safe areas et texte contrasté. Tiers décor proches/moyens/lointains pour parallax léger si disponible.

## Thèmes — trois identités, pas trois palettes
| Thème | Décor | Matériaux / interface | Atmosphère | Audio/animation éventuels |
|---|---|---|---|---|
| **Sakura** | Village musical japonais-fantasy, cerisiers, torii, pavillons, horizon montagneux, sol pavé ou plancher | bois clair, papier crème, cadres dorés, pétales | lumineux, rose corail, vert tendre | pétales en couches lentes, ambiance calme |
| **Cyberpunk** | Place urbaine de concert néon, façades, enseigne musicale, scène / métro, perspective nocturne | métal sombre, verre holographique, panneaux lumineux, textures digitales | bleu nuit, cyan, magenta, reflets après pluie | lumières douces, pluie derrière personnage, éviter flash |
| **Ombre** | Terrasse/scène de concert gothique-fantasy, arches et tours lointaines, projecteurs violets, symbolique musicale | pierre sombre, cuir/bordeaux, velours, or ancien | violet, bleu profond, brume, contraste dramatique | particules et faisceaux doux non stroboscopiques |

## Structure visuelle (minimum)
Un thème inclut : 1 arrière-plan *sans personnage*, 2 un premier plan / sol, 3 éléments décoratifs/texture, 4 type de panneau et bouton, 5 palette de contraste, 6 traitement des éclairages, 7 option d'animation ambiante, 8 version desktop + composition mobile. **Les trois univers doivent rester le même jeu** (même personnages et typo de base).

## Contraintes art
- Aucun background définitif n'est livré dans ce kit. Les images de planche sous `assets/references/` sont seulement une **direction d'art** : ne pas utiliser un montage entier avec personnages et texte comme background.
- Pour l'art final, produire `bg_sakura_desktop.png`, `bg_sakura_mobile.png`, etc. (1920×1080 et 1080×1920), ainsi que `fg_*.png`, calques d'ambiance en PNG, et maquettes UI de chaque thème.
- Les thèmes n'ont aucun impact sur l'XP, les objets débloqués et l'apparence essentielle de l'avatar ; seulement l'univers de présentation.

## Test rapide de reconnaissance
Afficher trois captures dans lesquelles on a **neutralisé le bouton de sélection de thème et les noms** : l'utilisateur doit pouvoir reconnaître Sakura, Cyberpunk ou Ombre rien qu'au décor, matières et ambiance. Si seule la couleur du contour a changé : **rejet**.
