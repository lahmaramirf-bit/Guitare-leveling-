# 05 — Choix initial, identité et navigation

## Parcours attendu
**Première ouverture de compte :** écran clair avec exactement deux silhouettes prévisualisées (garçon / fille) tirées des véritables assets, option de confirmer. **Après confirmation :** sauvegarde durable dans le compte, arrivée au hub, plus de sélecteur permanent garçon/fille.

**Sessions suivantes :** avatar conservé (y compris reload, navigation, reconnexion). Compte v0.2 existant sans champ avatar : migrer sans perdre XP/données, afficher onboarding une fois au prochain accès. En cas de conflit entre état local et compte, la sauvegarde du compte est la référence, après chargement des données. Réduire risque de voir brièvement le mauvais avatar pendant le chargement (squelette neutre plutôt que défaut faux).

**Nommer comme choix d'avatar de départ, pas comme déclaration sur le genre de la personne.** Le joueur choisit une apparence ; éviter d'en déduire quoi que ce soit sur lui.

**Navigation** : chaque page doit continuer à montrer l'avatar choisi, ou son portrait dérivé officiellement, sans crop accidentel et sans permutation. Dans les écrans d'exercice denses, le personnage peut être réduit ou masqué si nécessaire à la lisibilité — pas d'animation parasitant le métronome ou l'apprentissage.

**À ne pas faire** : refaire l'authentification ou déplacer les données métier sans besoin ; masquer la progression derrière un écran esthétique difficile à quitter.
