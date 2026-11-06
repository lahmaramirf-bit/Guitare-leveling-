# QA REPORT — v0.3 (2026-11-06)

## Commandes exécutées
| Commande | Résultat |
|---|---|
| Contrôle PNG du kit (Pillow) : taille, mode, coins alpha, bbox α>20, SHA-256 | boy/girl 1024×1280 RGBA, coins 0, bbox = manifeste, SHA = `verification.json` — **PASS** |
| Composition sur fonds clair et sombre (QA uniquement) | aucun halo, même échelle garçon/fille — **PASS** |
| `npm run typecheck` | 0 erreur — **PASS** |
| `npm test` | 3 fichiers, **33/33** (dont parité XP avec l'original, 200 sauvegardes) — **PASS** |
| `npm run build` | **PASS** |
| `npm run e2e` (Chromium) | **40/40** — **PASS** |
| `python3 scripts/validate_contracts.py` | 0 erreur (vérifie aussi SHA et taille des masters) — **PASS** |

## Gates du kit (`handoff_art/docs/06_QUALITY_GATES.md`)
| Gate | Statut | Preuve |
|---|---|---|
| A — Fichiers | **PASS** | `src/avatar/avatar.test.ts`, validateur de contrats |
| B — Style | **PASS (à confirmer par le fondateur)** | masters affichés sans retouche ni recadrage ; `docs/qa/v03-00-hub.png` |
| C — Avatar | **PASS** | E2E : choix unique, rechargement, navigation (hub/héros/quêtes), compte v0.2, silhouette neutre avant choix. « Reconnexion » = rechargement (pas de compte serveur) |
| D — Hub | **PASS** | E2E : personnage entier dans la scène et l'écran, desktop 1280×900 et mobile 390×844 ; `v03-00-hub.png`, `v03-07-mobile-hub.png` |
| E — Thèmes | **PENDING** | 3 captures sans nom `v03-06-sans-nom-A/B/C.png` reconnaissables, mais décors = vignettes provisoires basse résolution ; `bg_*` finaux manquants |
| F — Équipement | **BLOCKED** | aucune guitare livrée ; `blocked_by_missing_art` testé |
| G — Animation | **BLOCKED** | aucun rig ; placeholder seulement ; reduced-motion testé (E2E) |
| H — Non-régression | **PASS** | parité XP, 25 tests métier, parcours E2E quêtes/donjons/répertoire/boutique/journal inchangés |
| I — Qualité technique | **PASS (Chromium)** | 0 erreur console, pas de débordement mobile sur 7 écrans ; clavier : boutons natifs, non audité avec lecteur d'écran ; Safari/Firefox NOT_TESTED |

## Non testé
Safari/iOS, Firefox, appareils Android réels ; lecteur d'écran ; performance de l'ambiance canvas sur mobile bas de gamme (mise en pause hors écran et onglet caché implémentée, non mesurée).

## Lot v0.7 — panneau personnage compact (2026-11-06)
| Commande | Résultat |
|---|---|
| `npm test` | 33/33 — PASS |
| `npm run e2e` | 40/40 — PASS (personnage entier dans le panneau : desktop 430/468 px, mobile 212/230 px) |
| `python3 scripts/validate_contracts.py` | 0 erreur — PASS |
| `node e2e/preview-panel.mjs sakura` | captures + mesures produites, **avec décor provisoire** (`art/previews/*_PROVISOIRE.*`) |
| `python3 scripts/check_panel_bg.py` | testé sur 2 fichiers factices (non versionnés) : accepte 1400×620 opaque, refuse mauvaise taille et transparence — PASS |
| Intégration `panel_bg_sakura.png` | **BLOCKED** : fichier non reçu (absent du zip, lien Adobe → proxy 403) |

## Lot v0.7.1 — décor Sakura candidat (2026-11-06)
| Commande | Résultat |
|---|---|
| `python3 scripts/check_panel_bg.py art/incoming/panel_bg_sakura.png --install` | PNG 1400×620 opaque, contraste zone héros 36,8 (< 60) — **OK** |
| `node e2e/preview-panel.mjs sakura` (fille et garçon) | personnage entier ; pieds à 89,7 % (ordinateur) / 90,4 % (mobile), sur le ponton ; mobile : cadrage central, torii et guitare de décor rognés (attendu) |
| `npm test` / `npm run e2e` / `validate_contracts.py` | 33/33 · 40/40 · 0 erreur — **PASS** |
| Lisibilité « Niv. » sur cerisiers | défaut constaté puis corrigé (voile radial, D-029) |
| Gate E | **PENDING** : Sakura candidat, en attente de validation du fondateur ; Cyberpunk/Ombre non commencés |

## Lot v0.7.3 — comparatif Sakura V1/V2 (2026-11-06)
| Commande / mesure | V1 | V2 |
|---|---|---|
| `check_panel_bg.py` | OK, contraste héros σ 36,8 | OK, contraste héros σ 42,3 |
| Coin haut-gauche (niveau), luminance moyenne / σ | 151 / 62 (clair, chargé ; voile D-029 requis) | **74 / 13** (sombre, uni) |
| Coin haut-droit (gemme), luminance moyenne / σ | **109 / 47** (ciel) | 147 / 56 (cerisiers clairs) |
| Pieds (ordi / mobile) | 89,7 % / 90,4 %, sur plancher avec profondeur | 89,7 % / 90,4 %, sur l'arête d'un muret vu de face |
| Personnage entier, fille et garçon, ordi et mobile | oui | oui |
| Style vs masters | peint, cohérent | aplats, ciel en bandes (pixel art), rupture |
| `npm test` / `npm run e2e` / contrats | 36/36 · 40/40 · 0 erreur — **PASS** (nouveau test `worlds.test.ts`) | |
Captures : `art/previews/compare/`.

## Lot v0.7.4 — comparatif Sakura V1/V3 (2026-11-06)
| Mesure (luminance moyenne / σ) | V1 | V3 |
|---|---|---|
| Coin du niveau, ordinateur (x 0–420, y 0–170) | 151 / 62 | **98 / 44** |
| Coin du niveau, **mobile** (x 252–560, y 0–150) | 165 / 51 | 121 / 41 (encore clair) |
| Gemme, mobile (x 1000–1148, y 0–150) | 165 / 26 | **140 / 26** |
| Zone du héros (`check_panel_bg`) | σ 36,8 | **σ 31,7** |
| Ponton (y 520–620) | 111 / 38 | 106 / 30, plus profond (y ≈ 518–620) |
| Pieds (ordi / mobile) | 89,7 % / 90,4 % | 89,7 % / 90,4 %, au milieu du ponton |
| Personnage entier, 2 avatars × 2 formats | oui | oui |
| Écart moyen V1→V3 | — | 41,8/255 : **recréation**, pas une retouche locale |
| `references/panel_bg_sakura_v1_original.png` (ChatGPT) vs notre V1 | écart 3,0/255 : même image, notre copie vient du WebP ; non remplacée sans accord | |
| `npm test` / `npm run e2e` / contrats | 36/36 · 40/40 · 0 erreur — **PASS** | |
