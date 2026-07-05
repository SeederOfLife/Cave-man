# CAVE MAN — Project Handoff (everything Claude knows)

This document is the complete brain-dump for continuing development in VS Code (with Claude Code, Copilot, or by hand). Read this first; read `CLAUDE.md` for agent-specific working rules; read `CAVEMAN_LORE.md` for the world and item fiction.

> **Note (2026-07-05):** since this handoff was written, the monolithic `js/game.js` has been split into one file per labeled section under `js/` (max 300 lines each, loaded in order by `index.html` — same script scope, no modules). The section-by-section architecture below still applies 1:1; each section is now its own file. See `CLAUDE.md` for the file table.

## What this project is

A room-based prehistoric roguelike in the style of The Binding of Isaac, written in plain HTML/CSS/JavaScript with zero dependencies. It runs from a double-click on `index.html`, works on desktop (keyboard + mouse) and phone (virtual joystick, auto-aim or twin-stick), and supports local two-player co-op on one keyboard. The long-term vision is an online room-based MOBA where players farm dungeons for materials, craft skill loadouts, and race or fight their way up "the First Tower". The current build is the complete single-player/co-op foundation for that.

The project went through six versions in one build session: v1 open-world pixel prototype, v2 Isaac-style rooms, v3 materials + crafting + lore, v4 skill loadout + Tower bosses + 2P co-op, v5 smooth vector art + mobile touch controls, v6 pause menu + difficulty parameters + monster containment fix + art readability pass (cel outlines, loot glow, vignette).

## File layout

`index.html` is the page shell (meta viewport for mobile, overlay DOM for title/pause/death menus) and loads the `js/` files in order. `css/style.css` styles the DOM overlays and HUD text. The game lives in `js/*.js`, split by the labeled sections described below.

## Architecture of game.js, section by section

The file is organized top to bottom in labeled comment sections. Order matters because everything is plain script scope (no modules).

**Canvas & DPR.** `cvs`/`ctx` are the main canvas, `lightCvs`/`lctx` an offscreen canvas used only for the darkness/light pass. `DPR` handles devicePixelRatio (capped at 2); every render pass starts with `resetT(c)` which applies the DPR transform — never call `setTransform(1,0,0,1,0,0)` directly. `resize()` recomputes canvas size and re-centers the layout; `IS_TOUCH` is detected once at load.

**Sound.** `sfx(name)` synthesizes every sound with WebAudio oscillators (no audio files). Sound names: throw, hit, rock, pickup, hurt, die, stairs, slam, clear, grok, boss. Gated by the `soundOn` setting. The AudioContext is created lazily on the first user click (browser autoplay rules).

**Sprites.** All art is procedural vector drawing pre-rendered once to offscreen canvases. `mkS(fn)` creates a 96×96 canvas (constant `S=96`) and runs a draw function on it; helpers are `rg` (radial gradient), `ell` (ellipse), `heartPath`, and `drawHunter(g,s,skin,skinD,hair,tunic,tunicD)` which draws any humanoid (player 1, player 2, Grok are palette variants; the club in the right hand is drawn first so it sits behind the body). After all sprites are defined, `outlined(canvas,color,px)` wraps each one with a dark cel-style outline by stamping a tinted silhouette at 8 offsets under the original — this is the main readability trick; keep it for any new sprite. The `SPR` dictionary holds every sprite: caveman, caveman2, grok, bat, bear, dino, serpent, meat, heart, heartHalf, heartEmpty, flint, stone, rock, obrock, root, torch, bone, slab, wood, sinew, feather, fang, obsidian, shrine, bola.

**Constants.** Rooms are `C=17` by `R=11` tiles including the wall ring (15×9 interior, Isaac-like). `DOOR` maps n/s/w/e to wall-tile coordinates; `OPP` and `DIRV` are direction helpers. Obstacle cell types: `O_NONE, O_ROCK, O_WATER, O_BONES, O_ROOT, O_OBROCK`. `MATS` lists the seven materials. `REC` is the crafting recipe table — each entry has id, kind ('passive' or 'active'), name, cost (material:count), fx (effect text), lore (flavor). `ACD_MAX` holds active-tool cooldowns. `DEPTH_LORE`, `TOWER_LORE`, `GROK_LINES` are the flavor-text pools.

**Settings.** `aimMode` ('auto'/'twin'), `difficulty` ('cub'/'hunter'/'chosen' — the `DIFF` table multiplies enemy hp, enemy damage, and hunger drain), `soundOn`. All wired to title-screen DOM buttons.

**Input.** Keyboard state lives in `keys[code]`; `P1KEYS`/`P2KEYS` map actions per player. Mouse in `mouse`. Touch state lives in the `touch` object: a move joystick (any touch starting in the left 45% of the screen), an aim joystick in twin mode (right side), and tappable buttons registered each frame into `touch.btns` by `drawTouchUI` (throw, tool0, tool1, craft, pause). The craft panel registers row hitboxes into `touch.panelRows` so taps and clicks both work (`craftPanelTap`).

**Layout.** `computeLayout(lockTile)` computes `TILE` (tile size in CSS pixels) from the window and centers the room at `ORX/ORY` below the `HUDH=64` HUD strip. TILE is locked after game start; resizing mid-game only re-centers. Almost every speed, radius and size in the game is expressed in TILE units so the game scales to any screen.

**Floor generation.** `genFloor(depth)` builds an Isaac-style grid of rooms: start at 0,0, randomly grow to `6+depth+min(depth,4)` rooms keeping the graph tree-ish (a new cell may touch only one existing room). Dead-ends sorted by distance become exit, treasure, and grok rooms; remaining normals roll shrine (10%), water (20%), or dino (12%, depth 2+) flavors. Room objects carry gx, gy, type, visited, cleared, spawned, seed, obst (lazy), live (enemy instances), items, grok, shrine, slabT, tileHP, drops, doors.

**Room content.** `buildRoom(room,depth)` lazily generates the obstacle grid from the room's seed via the deterministic `hash(i,j,seed)` — layouts are horizontally mirrored for the Isaac feel, door lanes and center kept clear. It seeds `tileHP` for destructibles (rock 3, root 2, obsidian rock 4) and places pedestal items, the shrine, or Grok. Tower rooms get four pillars instead. `spawnEnemies(room,depth,entryDir)` fills fight rooms on first entry, avoiding the entry door area; co-op adds one extra enemy. `newEnemy`/`newBoss` build stat blocks (difficulty-scaled); enemy `sc` is the sprite draw scale, `r` the collision radius.

**Game state.** `start(np)` creates the global `game` object: players array (from `mkPlayer`), tribe-shared hunger, mats pouch, crafted flags, actives array (max 2 tool ids), acd cooldowns, pierce/projMul global projectile modifiers, projectile arrays (stones, spits, bolas), parts/floats FX arrays, trans (room-slide transition state), craftOpen, paused. `newCaveFloor()`/`newTowerFloor()` build floors; Tower floors trigger after leaving a cave whose depth is divisible by 3 (see the exit-hole handler in `update`).

**Main loop.** `frame` runs on requestAnimationFrame with dt capped at 50 ms; it routes to death-render, pause-render, transition update, or `update(dt)` + `render()`. `update` early-returns while the craft panel is open (pauses the world).

**update(dt) order.** Players (input from keyboard/joystick, water slowdown, facing, throw with cooldown — aim comes from `aimOf(P)` which resolves mouse, twin-stick, auto-aim-nearest-enemy, or facing direction; actives on Q/E or touch buttons; door-crossing check which calls `startTrans`). Then tribe hunger with starvation ticks; bolas (snare projectiles, apply `e.slow`); stones (tile collision damages destructibles via tileHP and drops materials — rock→flint 60%, root→wood 90%, obsidian rock→obsidian 85%; enemy hits apply damage, knockback, pierce countdown); `checkClear` (opens doors, room-clear reward); dino spits vs players; enemy AI (nearest-player targeting, dino keep-away and spit, bat wobble+fly-over-rocks, slow effect, `keepInRoom` containment clamp, contact damage); material drop pickup; shrine touch (one-time heal + random material); Grok (one-time feed/heal/rumor); item pickup; exit-hole check (routes cave→tower→cave and increments depth); particles/floats decay; screen-shake decay.

**Boss AI.** `updateBoss` is a three-state machine: chase (slow approach, atkT countdown; serpent also fires a 3-spread spit), wind (0.7 s telegraphed flash), charge (0.85 s dash along a locked direction with `keepInRoom` clamp). At half HP the boss summons adds once. Contact damage every frame it overlaps a player. Boss death routes through `onEnemyDeath` which calls `relicDrop` (+1 heart to all players, full heal/hunger, bonus obsidian).

**Containment.** `keepInRoom(o)` hard-clamps any entity inside the interior and, if it still sits in a solid tile (knockback tunneling), nudges it toward room center until free. It runs on every enemy every frame, after boss charges, and after Urm's Fist knockback. This fixed the "monster pushed out of the room" bug — do not remove it.

**Transitions.** `startTrans(dir)` clears projectiles and builds the destination room; `updateTrans` slides both rooms over 0.45 s (easeInOut), places players at the opposite door, revives downed players with 1 heart ("Urm gives another stone"), then spawns enemies (door slam + slab shake) or auto-clears pacifist rooms.

**Damage & death.** `hurtPlayer(P,dmg,from)` has a 0.85 s invulnerability window; at 0 HP a player goes down (bones sprite) — the run only ends when all players are down, which shows the death overlay (`#death` DOM, separate from the title overlay so title survives). `die`/`deathRestart`/`goTitle` manage overlay flow.

**Pause & restart.** `setPause`, `restartRoom` (regenerates the current room from scratch, respawns the boss in Tower mode, revives downed players), `restartRun`, `goTitle`. Escape/P on desktop, pause button on touch.

**Rendering.** `render` orchestrates: room (or two rooms during a transition slide), light pass, HUD, minimap, touch UI, craft panel. `renderRoom(room,ox,oy,active)` draws tiles (tower rooms use a cold blue-grey palette and serpent wall glyphs; caves get ochre cave paintings — bison, handprint, hunter, spiral — via `drawPainting`), a soft radial vignette, the exit hole (slab-sealed until cleared), shrine, glowing material drops, pedestal items, Grok, then when active: spits, stones/darts, bolas, enemies (hit flash via ctx.filter brightness, hp bars, slow rings), the boss hp bar with name, players (hop animation, hurt blink, downed bones), particles, floating texts. `renderLight` fills darkness scaled by depth and punches radial holes at players, room corners (with torch sprites), the exit, and the boss. `drawHUD` draws hearts (P2 gets a second smaller row), the meat/hunger bar, depth label, materials pouch, crafted-passive tags, desktop tool slots with cooldown sweeps. `drawTouchUI` draws the joysticks and buttons. `drawCraftPanel` renders the 8 recipes with affordability states, limit counters (crafts n/3, tools n/2), and tap/click hitboxes.

## Tuning reference

| What | Where | Current value |
|---|---|---|
| Player speed | update, `spd` | TILE*5.2 (TILE*2.9 in water) |
| Throw cooldown | mkPlayer `cdMax` | 0.38 s (fletch: ×0.65, floor 0.14) |
| Stone speed / life | update throw | TILE*10.5, 1.2 s (atlatl ×1.5 both) |
| Hunger drain | update | 0.8/s (water 1.6, ×1.25 in co-op, ×DIFF) |
| Bola / Dart / Fist cooldowns | ACD_MAX | 4 / 5 / 7 s |
| Enemy stats | newEnemy | bat 2hp TILE*2.3; bear 6+depth hp TILE*1.25; dino 3+depth/2 hp TILE*1.1 |
| Boss hp | newBoss | 22+12×tier (×DIFF.hp) |
| Rooms per floor | genFloor | 6+depth+min(depth,4) |
| Darkness | renderLight | caves .5+depth×.035 (cap .8), tower .68 |

## Known state, quirks, ideas

Everything listed in the roadmap through "Phase 2 and half of Phase 3" of the MOBA plan is implemented and headless-tested (movement, craft limits, actives, tower flow, relic, co-op down/revive, containment clamp, pause/restart). Not yet built: online multiplayer (needs a WebSocket server — Colyseus or plain socket.io; the game loop is already deterministic-friendly but has no netcode), persistent unlocks between runs (localStorage would work in the browser build), more boss variety past tier 3, gamepad support, and any audio beyond synth blips. Two soft quirks worth knowing: the craft panel pauses the world by early-returning `update` (msg timer still ticks by design), and TILE is frozen at run start so rotating a phone mid-run re-centers but doesn't rescale — restart the run after rotating for best fit.

## How to run and test

Open `cave-man/index.html` directly, or serve the folder (`npx serve` or VS Code Live Server) — serving is required for phone testing on the same wifi. The quickest manual test loop: start a run on Cub, break a rock and a root, open craft (C), make the Flint Spear, clear a room, reach the cave-3 exit, fight Ghur, confirm the relic heart. For phone: enable GitHub Pages (steps in `cave-man/README.md`) and open the Pages URL.
