# CLAUDE.md — règles de travail sur Cave Man

Lire `HANDOFF.md` pour l'architecture complète avant de toucher au code. Lire `CAVEMAN_LORE.md` avant d'écrire tout texte joueur, item ou ennemi — tout doit coller au monde (Urm le dieu-montagne silencieux, la First Tower, les slither-men, messages de jeu en CAVEMAN-SPEAK ALL CAPS, Grok parle à la troisième personne).

## Ce projet

Roguelike préhistorique en salles, style The Binding of Isaac. HTML/CSS/JS pur, zéro dépendance : le jeu doit toujours marcher offline depuis un double-clic sur `index.html`. Desktop (clavier+souris), mobile (joystick virtuel, auto-aim ou twin-stick), co-op 2 joueurs local. Vision long terme : MOBA en ligne autour de la First Tower.

## Règle #1 — Un fichier, une job (NON-NÉGOCIABLE)

- **Seuil : 300 lignes. Cible : 150–200 lignes.**
- Un fichier dépasse 300 lignes → le découper AVANT d'ajouter des features.
- Vérifier après chaque série de modifs : `node scripts/check-sizes.mjs`

Le jeu vit dans `js/*.js`, des scripts classiques (pas de modules) chargés **dans l'ordre** par `index.html`. L'ordre de chargement est l'ordre des sections de l'ancien `game.js` monolithique — ne pas le changer sans vérifier les dépendances au chargement. Tout code qui s'exécute au chargement (pas seulement des déclarations) ne peut référencer que des fichiers chargés avant lui ; l'amorçage (`resize()`) vit dans `js/boot.js`, toujours dernier.

| Fichier | Job |
|---|---|
| `core.js` | canvas & DPR, sfx |
| `sprites.js` / `sprites-defs.js` | helpers de dessin / dictionnaire SPR + passe outline |
| `data.js` | constantes (salles, lore), settings |
| `items-data.js` / `items-data2.js` | catalogue du shop : 8 composants, 20 FURY / 17 SPIRIT / 16 HIDE / 7 WIND / 6 TOOLS |
| `input.js` | clavier/souris, touch |
| `world.js` | layout, utils, génération d'étage, contenu des salles |
| `state.js` | start de partie, solidité, fx |
| `sprites-beasts.js` | sprites des 6 bêtes (bat, ours, dino, spider, boar, slither-man) |
| `sprites-boss.js` | sprites boss + npc : Ghur, Slither-Priest, Grok, Silent Trader |
| `craft.js` | loot, actives (tools), pause/restart |
| `stats.js` | recalcul des stats depuis les items, effets on-hit, dots |
| `shop.js` | boutique à onglets (The Silent Trader), fusion composants → objets |
| `skills.js` | 3 skills + ult à charge, XP, level-up |
| `update.js` | boucle principale, update(dt) |
| `combat.js` | IA boss, transitions, dégâts |
| `enemies.js` | IA des bêtes non-boss (chase, flee, spit, lunge, zigzag) |
| `render-room.js` / `render-fx.js` | rendu salle / helpers de dessin + lighting |
| `comic.js` | passe print comic : points Ben-Day, speed lines, POW bursts |
| `hud.js` | HUD, touch UI |
| `hud-skills.js` | barre de skills, jauge d'ult, XP, 6 slots d'items |
| `panels.js` | panneau de craft, minimap |
| `boot.js` | amorçage, toujours en dernier |

## Règles projet (héritées du handoff — toujours valides)

- Zéro dépendance : pas de framework, pas de build step, pas de npm package, pas d'asset externe (image, police, fichier audio).
- Tout l'art est vectoriel procédural pré-rendu via `mkS()` ; tout nouveau sprite passe par `outlined()` (look cel-outline). Registre visuel = **pulp héroïque** (Frazetta / Savage Sword) : ombre dure d'un côté, rim light de l'autre, muscles/contours en `groove()`, dégradés durs via `lg()`. Tout le son est synthétisé dans `sfx()`.
- Tailles, vitesses et rayons en unités `TILE`, jamais en pixels codés en dur.
- Chaque passe de rendu commence par `resetT(ctx)` (DPR-aware), jamais `setTransform` brut.
- Tout changement doit marcher dans les 4 modes : desktop solo, desktop 2 joueurs, phone auto-aim, phone twin-stick. Tout nouvel élément interactif a un chemin clavier ET une hitbox touch (`touch.btns` dans `drawTouchUI`, ou `touch.panelRows` pour les panneaux).
- **Ne jamais supprimer `keepInRoom()` ni ses appels** — il empêche les entités de sortir des salles après knockback.

## Invariants gameplay

- Le shop (The Silent Trader, touche C) est **identique pour tous les joueurs**. Les composants (8, partagés entre tous les arbres) fusionnent en objets finis. **Max 6 objets portés** (composants inclus). Les matériaux sont la monnaie.
- Skills innés : 3 à petit cooldown (Q/E/R) + une ult chargée par les dégâts/kills (F). Level-up (XP des kills) = choisir UN skill à améliorer (max 5). Ne pas ajouter de skill sans passer par ce système.
- Les matériaux sont l'économie — le nouveau contenu doit la nourrir (destructibles → drops, ennemis → table dans `dropLoot`).
- **Carte MOBA unique et persistante** (`genFloor`, world.js) — **pas de niveaux de donjon, pas de descente**. Base au sud `(0,0)`, gardien-objectif au nord `(0,-6)`. 3 lanes verticales — SOLO `gx=-2`, MID `gx=0`, BOT `gx=2` — avec des **clusters de jungle fractals** entre elles (`gx=-1,1`) : chaque colonne alterne camps (`dino`), rooms de planque (`brush`, couvert dense pour se cacher/repositionner) et un buff (shrine / relic). Ne pas re-randomiser : la structure lanes/jungle est le cœur du design.
- **Difficulté par position, pas par étage** : `room.tier = max(1, -gy)` (croît vers le nord). Passer `room.tier` à `buildRoom`/`spawnEnemies`/`newEnemy` — jamais `game.depth` (qui ne fait plus que suivre le tier courant pour l'ambiance/obscurité).
- **Objectif = gardien boss** (room `exit`, `spawnEnemies` pousse `newBoss`). Le tuer déclenche `win()` — c'est la fin de run (victoire). Il n'y a plus de boss ailleurs.
- **Carte vivante (MOBA + tower-defense)** — NE PAS revenir à un modèle « nettoyer la salle » :
  - **Free-roam** : `roomDoorsOpen()` renvoie toujours `true`, portes jamais verrouillées. Les rooms lane/jungle ne se « clearent » jamais (`checkClear` les ignore).
  - **Vagues continues** : `update()` appelle `spawnWave(room)` sur un timer dans les rooms `normal`/`dino` ; les creeps entrent au nord (`march:true`) et poussent vers la base au sud (tower-defense). S'ils atteignent le bord sud → despawn (`pushed`, aucun reward).
  - **Escalade dans le temps** : `game.warT` monte ; `newEnemy` scale hp/dmg avec `warT` (~+40%/min) et `hordeBuff`. Ne pas remettre de scaling par étage.
  - **Sneak** : chaque bête a un `aggroR` ; hors rayon elle erre/marche (ne chasse pas). En room `brush`, `aggroR` est divisé par 2 → planque. Toucher une bête inconsciente inflige quand même des dégâts.
  - **Lords** (`makeLord`, tag `e.lord`) dans les camps jungle : élites tanky ; leur mort fait `game.hordeBuff++` (toute la horde durcit) + loot riche.
- Co-op : un joueur down revit avec 1 cœur à la transition de salle suivante ; le run ne finit que quand tous sont down.

## Vérifications obligatoires avant chaque commit

| Commande | 🟢 Vert | 🔴 Rouge = ne pas pousser |
|---|---|---|
| `node scripts/check-sizes.mjs` | tous les fichiers sous 300 lignes | découper d'abord |
| `node tests/smoke.mjs` | `0 failed` | fonction critique cassée |

Puis vérifier à la main dans un navigateur pour tout changement de gameplay : un étage de cave complet, un craft, un combat de tower, et Restart Room du menu pause dans une salle de cave ET une salle de tower.

## Environnement dev

- Git binary : `C:\Users\user palis\AppData\Local\GitHubDesktop\app-3.5.8\resources\app\git\cmd\git.exe`
- Node en PowerShell : `$env:Path = "C:\Program Files\nodejs;" + $env:Path`
- Commit style : `feat:` / `fix:` / `docs:` / `refactor:`
- Test téléphone : Vercel (auto-déployé à chaque push sur main) → https://cave-man-project-game-2d.vercel.app/
