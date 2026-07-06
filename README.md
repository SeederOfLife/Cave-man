# CAVE MAN — The First Tower

A room-based prehistoric roguelike inspired by The Binding of Isaac. Farm materials, craft your build, fight the Tower guardians. Runs in any browser — desktop or phone, no install.

**Play it:** open `index.html` in a browser, or via GitHub Pages at https://seederoflife.github.io/Cave-man/ to play on your phone from a link.

## Controls

Desktop (Player 1): WASD to move, mouse to aim, click or Space to throw. Q/E/R cast skills, F unleashes the Wrath (ult, charged by blood). 1/2 use active tools. C opens the shop, T spends level-up points, Escape or P pauses.

Desktop (Player 2, "Two Hunters" mode): Arrow keys to move, Enter to throw, Right-Shift / Right-Ctrl / Slash cast skills, Period for the Wrath.

Phone: left thumb is a virtual joystick for moving. Right side depends on the aiming mode picked on the title screen — Auto-Aim gives you one big throw button (the game aims at the nearest beast), Twin-Stick gives you a second joystick that aims and fires. The skill circles (and the bigger Wrath circle) sit above the throw zone, tool circles next to it, the flint button opens the shop, pause is top-left.

## The Silent Trader & skills

The shop (C) is the same for every hunter: 8 raw parts combine into 60 finished works — 20 FURY (physical damage), 17 SPIRIT (on-hit effects and skill power), 16 HIDE (defense), 7 WIND (speed) — plus 6 active TOOLS. You carry at most 6 things. Materials from the farm loop are the currency.

Skills are innate: STONE VOLLEY (Q), URM'S STEP (E), WAR HOWL (R), and WRATH OF THE MOUNTAIN (F) — the ult charges from the damage you deal. Kills give XP; each level grants one point to improve the skill of your choice (max 5).

## Title screen parameters

Aiming mode (Auto-Aim / Twin-Stick), difficulty (Cub / Hunter / Urm's Chosen — scales beast health, damage and hunger drain), and sound on/off. The pause menu offers Resume, Restart Room, Restart Run, and Title Screen.

## Project structure

```
index.html            page shell — loads the scripts IN ORDER (order matters, no modules)
css/style.css         menus, overlays, HUD text styling
js/*.js               the game, one job per file, max 300 lines each (see CLAUDE.md)
scripts/check-sizes.mjs   guard: no js file over 300 lines
tests/smoke.mjs       headless smoke test (start, movement, craft limits, tower flow)
HANDOFF.md            full architecture brain-dump
CAVEMAN_LORE.md       the world and item fiction
CLAUDE.md             working rules for AI agents
```

Everything is plain HTML/CSS/JavaScript with zero dependencies, so it works offline from a double-click and deploys anywhere static files can be hosted.

## Checks before committing

```
node scripts/check-sizes.mjs   # all js files under 300 lines
node tests/smoke.mjs           # 0 failed
```

## Roadmap

The MOBA vision (dungeon-farming, then racing or fighting to the top of the First Tower) is documented in `CAVEMAN_LORE.md`. Current build covers: farm loop, craft loadout (2 active tools / 3 passive crafts), Tower bosses every 3 caves, and local 2-player co-op. Next big step is a WebSocket server for online play.
