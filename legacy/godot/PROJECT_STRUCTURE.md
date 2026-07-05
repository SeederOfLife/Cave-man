# Cave Man Roguelike - Project Folder Structure

```
res://
├── PROJECT_STRUCTURE.md          # This file
├── INPUT_MAP.md                  # Input actions reference
├── scenes/
│   ├── world/
│   │   ├── World.tscn            # Root scene (player, tilemap, enemies, UI)
│   │   └── World.gd              # World manager script
│   ├── player/
│   │   ├── Player.tscn           # Player character scene
│   │   └── Player.gd             # Player controller script
│   ├── enemies/
│   │   ├── Bat.tscn              # Bat enemy
│   │   ├── Bat.gd
│   │   ├── CaveBear.tscn         # Cave bear enemy
│   │   ├── CaveBear.gd
│   │   ├── Dinosaur.tscn         # Dinosaur enemy
│   │   └── Dinosaur.gd
│   ├── npcs/
│   │   ├── Grok.tscn             # Grok NPC
│   │   └── Grok.gd               # NPC dialogue & quest handler
│   ├── items/
│   │   ├── ItemPickup.tscn       # Generic item pickup
│   │   └── ItemPickup.gd
│   ├── ui/
│   │   ├── HUD.tscn              # Main HUD (health, hunger bars)
│   │   ├── HUD.gd
│   │   ├── InventoryUI.tscn      # Grid-based inventory
│   │   ├── InventoryUI.gd
│   │   ├── PauseMenu.tscn        # Pause menu
│   │   └── PauseMenu.gd
│   └── effects/
│       ├── Particle_Impact.tscn  # Stone impact particles
│       └── ScreenShake.tscn      # Camera screen shake effect
├── scripts/
│   ├── globals/
│   │   ├── GameManager.gd        # Singleton for game state
│   │   ├── EventBus.gd           # Signal broadcaster
│   │   └── ItemDatabase.gd       # Item definitions
│   ├── systems/
│   │   ├── CaveGenerator.gd      # Procedural generation (drunk-walker/BSP)
│   │   ├── EnemyAI.gd            # Base enemy AI class
│   │   └── InventorySystem.gd    # Inventory management
│   └── utils/
│       └── Helpers.gd            # Utility functions
├── assets/
│   ├── sprites/
│   │   ├── player/
│   │   │   ├── caveman_idle.png
│   │   │   ├── caveman_walk.png
│   │   │   ├── caveman_throw.png
│   │   │   └── caveman_hurt.png
│   │   ├── enemies/
│   │   │   ├── bat.png
│   │   │   ├── cave_bear.png
│   │   │   └── dinosaur.png
│   │   ├── items/
│   │   │   ├── stone.png
│   │   │   ├── food.png
│   │   │   └── weapon.png
│   │   ├── tileset/
│   │   │   └── cave_tileset.png
│   │   └── ui/
│   │       ├── health_bar.png
│   │       ├── hunger_bar.png
│   │       └── inventory_slot.png
│   ├── tileset/
│   │   └── CaveTileset.tres      # TileSet resource
│   └── particle_effects/
│       └── stone_impact.tres     # Particle system resource
├── audio/
│   ├── sfx/
│   │   ├── player_throw.ogg
│   │   ├── enemy_hit.ogg
│   │   ├── player_damage.ogg
│   │   └── item_pickup.ogg
│   ├── music/
│   │   ├── cave_ambient.ogg
│   │   └── boss_music.ogg
│   └── voice/
│       └── grok_dialogue.ogg
└── project.godot                 # Project settings
```

## Folder Guidelines

- **scenes/** - All `.tscn` scene files organized by system
- **scripts/** - All `.gd` scripts organized by type
  - `globals/` - Autoload singletons
  - `systems/` - Major game systems
  - `utils/` - Helper functions
- **assets/** - All art, including sprites, tilesets, particles
- **audio/** - Music, SFX, voice organized by type

## Important Notes

- Scene files should have their companion script in the same folder
- Use PascalCase for class names and script files (Player.gd, not player.gd)
- Use snake_case for signal names and variables (player_died, not playerDied)
- Each major system (AI, inventory, generation) gets its own folder
