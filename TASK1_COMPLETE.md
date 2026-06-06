# Task 1: Player Movement & Basic Scene Setup - COMPLETE DELIVERY

## 📋 DELIVERABLES CHECKLIST

✅ **1. PROJECT FOLDER STRUCTURE**
- See `PROJECT_STRUCTURE.md` for complete res:// layout

✅ **2. MAIN SCENE (World.tscn)**
- Scene file: `res://scenes/world/World.tscn`
- Script: `res://scenes/world/World.gd`
- Handles player spawning and world initialization

✅ **3. PLAYER SCENE (Player.tscn)**
- Scene file: `res://scenes/player/Player.tscn`
- Script: `res://scenes/player/Player.gd` (fully commented)
- Includes complete node tree

✅ **4. INPUT MAP**
- See `INPUT_MAP.md` for all action bindings

✅ **5. TESTING GUIDE**
- See `TESTING_GUIDE_TASK1.md` for step-by-step setup

---

## 🎮 NODE TREES

### World.tscn Node Tree
```
World [Node2D]
└── (World.gd script attached)
    └── Player [instance of Player.tscn]
    └── CanvasLayer (added in editor for future UI)
```

### Player.tscn Node Tree
```
Player [CharacterBody2D]
├── Player.gd (script)
├── CollisionShape2D
│   └── CircleShape2D (radius: 8 pixels)
├── AnimatedSprite2D
│   └── SpriteFrames (animations: idle, walk, throw, hurt)
└── Camera2D
    └── Zoom: 2.0, Enabled: True
```

---

## 🔧 KEY FEATURES IMPLEMENTED

### Player.gd Script Includes:

1. **8-Direction Movement**
   - Smooth acceleration/deceleration using `move_toward()`
   - Input normalized to prevent diagonal speed boost
   - Facing direction tracking for animations

2. **CharacterBody2D Physics**
   - Uses built-in `move_and_slide()` for collision
   - Proper handling of wall sliding and collisions

3. **Smooth Camera Following**
   - `lerp()` for smooth easing
   - Configurable follow speed (`CAMERA_FOLLOW_SPEED`)

4. **Animation System Ready**
   - Idle/Walk animation logic
   - 4-direction sprite facing system
   - Prepared for throw/hurt animations (Task 2+)

5. **Signal System**
   - `player_died` signal (emitted when health reaches 0)
   - Connected in World.gd for game over handling

---

## 📊 CONSTANTS & TUNING

All in `Player.gd`:

| Constant | Value | Purpose |
|----------|-------|---------|
| MAX_SPEED | 200.0 pixels/sec | Top movement speed |
| ACCELERATION | 1500.0 pixels/sec² | How quickly player reaches max speed |
| FRICTION | 1200.0 pixels/sec² | How quickly player stops |
| CAMERA_FOLLOW_SPEED | 0.1 (0-1 range) | Camera smoothing (higher = faster) |

**To adjust difficulty:**
- Increase MAX_SPEED for faster gameplay
- Increase ACCELERATION for more responsive controls
- Adjust CAMERA_FOLLOW_SPEED if camera feels laggy

---

## 🚀 SETUP QUICKSTART

### Prerequisites
- Godot 4.x installed
- Empty Godot project created

### 5-Minute Setup

1. **Create input actions** (Project Settings → Input Map):
   - move_up (W, Up Arrow)
   - move_down (S, Down Arrow)
   - move_left (A, Left Arrow)
   - move_right (D, Right Arrow)
   - throw_stone (Space)
   - open_inventory (I)
   - pause (Escape)

2. **Create folder structure**:
   ```bash
   mkdir -p res://scenes/world
   mkdir -p res://scenes/player
   mkdir -p res://scripts/globals
   mkdir -p res://scripts/systems
   mkdir -p res://scripts/utils
   mkdir -p res://assets
   mkdir -p res://audio
   ```

3. **Copy files from repo**:
   - `scenes/world/World.tscn` → `res://scenes/world/World.tscn`
   - `scenes/world/World.gd` → `res://scenes/world/World.gd`
   - `scenes/player/Player.tscn` → `res://scenes/player/Player.tscn`
   - `scenes/player/Player.gd` → `res://scenes/player/Player.gd`

4. **In Godot Editor - Set up Player.tscn**:
   - Add CollisionShape2D (CircleShape2D, radius 8)
   - Add AnimatedSprite2D (create empty SpriteFrames with animations: idle, walk, throw, hurt)
   - Add Camera2D (zoom 2.0, enabled)

5. **Set Main Scene**:
   - Project Settings → General → Main Scene
   - Set to `res://scenes/world/World.tscn`

6. **Play!**
   - Press F5 or click Play
   - Use WASD to move
   - Check console for "Player initialized at (320, 180)"

---

## ⚠️ COMMON BEGINNER MISTAKES

### 1. **Forgetting Input Normalization**
Without `.normalized()`, diagonal movement is √2 times faster. This breaks game balance.

### 2. **Using `global_position +=` Instead of `move_and_slide()`**
Breaks wall sliding, collision detection, and platform support.

### 3. **Running Physics in `_process()` Instead of `_physics_process()`**
Causes inconsistent movement due to variable frame rates.

### 4. **Not Caching Node References**
Getting `$AnimatedSprite2D` every frame wastes CPU. Cache in `_ready()`.

### 5. **Creating New Vector2s Every Frame**
Garbage collection overhead. Reuse or accumulate vectors.

### 6. **Forgetting CollisionShape2D**
`move_and_slide()` doesn't work without a collision shape child node.

### 7. **Not Setting Main Scene**
World won't load if it's not set in Project Settings.

---

## 🧪 VERIFICATION TESTS

Run these to confirm everything works:

| Test | How | Expected Result |
|------|-----|-----------------|
| Cardinal Movement | Hold W/A/S/D | Smooth movement in 4 directions |
| Diagonal Movement | Hold W+D | Same speed as cardinal directions |
| Acceleration | Hold W for 2s | Smooth speed increase, not instant max |
| Deceleration | Press then release W | Smooth slowdown, not instant stop |
| Camera Follow | Move around | Camera smoothly tracks player |
| Console Output | Play game | "Player initialized at (320, 180)" appears |

---

## 📚 CODE STRUCTURE EXPLAINED

### Player.gd Organization

```gdscript
# 1. SIGNALS - Events the player emits
signal player_died

# 2. MOVEMENT PROPERTIES - Constants
const MAX_SPEED: float = 200.0
const ACCELERATION: float = 1500.0

# 3. LIFECYCLE METHODS
func _ready() -> void        # One-time setup
func _process(_delta) -> void        # Camera update
func _physics_process(delta) -> void # Movement

# 4. INPUT HANDLING
func _handle_input(delta) -> void  # Read keys, update velocity

# 5. ANIMATION HANDLING
func _update_animation() -> void        # Switch between idle/walk
func _update_sprite_direction() -> void # Face correct direction

# 6. CAMERA HANDLING
func _update_camera() -> void  # Smooth camera follow
```

Every section is clearly marked with `# ====` separators for easy navigation.

---

## 🎯 DESIGN DECISIONS

### Why CharacterBody2D?
- Has built-in physics (`move_and_slide()`)
- Handles wall sliding automatically
- Better than RigidBody2D for top-down games
- Better than kinematic bodies (deprecated in Godot 4)

### Why Normalized Input?
Ensures consistent speed in all directions. Without it, diagonal = 1.41x faster.

### Why move_toward()?
Creates smooth acceleration/deceleration instead of instant speed changes. Feels more natural.

### Why Four-Direction Sprite Facing?
- Cleaner than 8-direction (half the sprite frames needed)
- Still supports true 8-direction movement
- Snapped angles prevent flickering

### Why Separate _update_* Functions?
Easier to read, modify, and debug. Each function has one responsibility.

---

## 🔄 NEXT TASK: Combat System

Once movement is tested and working:

**Task 2: Combat System (Stone Throwing)**
- Add `throw_stone` input handling
- Create stone projectile (Area2D + velocity)
- Collision detection with enemies
- Stone impact effects (particles, sound)
- Enemy hit feedback

---

## 📝 NOTES FOR FUTURE TASKS

These systems are stubbed out and ready to connect:

- **player_died signal** - Emitted in Task 4 when health reaches 0
- **facing_direction variable** - Used in Task 2 for throwing direction
- **AnimatedSprite2D animations** - Will play throw/hurt in Tasks 2-4
- **World.gd death handler** - Will show game over screen in Task 4

---

## ✨ POLISH TIPS

After Task 1 is working, you can improve feel:

1. **Tweaking Movement**:
   - Reduce MAX_SPEED for precision, increase for arcade feel
   - Reduce ACCELERATION for floaty feel, increase for snappy feel
   - Adjust FRICTION to feel like Isaac vs Zelda vs Spelunky

2. **Camera Feel**:
   - Lower CAMERA_FOLLOW_SPEED (e.g., 0.05) for cinematic feel
   - Higher CAMERA_FOLLOW_SPEED (e.g., 0.15) for responsive feel
   - Add screen shake in Task 8 for impact feedback

3. **Animation Feel**:
   - Speed up walk animation when player is faster
   - Add directional dust particles in Task 8
   - Add footstep sounds in Task 8

---

**READY FOR TASK 2: Combat System (Stone Throwing)** ✓
