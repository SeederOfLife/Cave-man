# Task 2: Combat System — Testing Guide & Setup

## COMPLETE COMBAT LOOP TEST

This guide walks you through setting up and testing the entire stone throwing → hitting → damage → screen shake system.

---

## 🚀 SETUP (15 MINUTES)

### Step 1: Copy New Files to Project

Copy these from your repository:
- `scenes/combat/Stone.tscn`
- `scenes/combat/Stone.gd`
- `scenes/test/TestDummy.tscn`
- `scenes/test/TestDummy.gd`
- Updated `scenes/world/World.gd` (with screen shake)
- Updated `scenes/player/Player.gd` (with throwing)

### Step 2: Update Player.gd

Replace your existing `scenes/player/Player.gd` with the new version that includes:
- `throw_stone` input handling
- `stone_thrown` signal
- Stone spawning logic
- Throw cooldown management
- Throw animation playback

### Step 3: Update World.gd

Replace your existing `scenes/world/World.gd` with the new version that includes:
- `camera_shake()` method
- Stone thrown signal connection

### Step 4: Set Up Stone Scene in Editor

Open `Stone.tscn`:

1. **Add CollisionShape2D**
   - Select CollisionShape2D node
   - Inspector → Shape → New CircleShape2D
   - Set Radius: 3 pixels

2. **Add Sprite2D** (optional, for visual)
   - You can add a colored square or skip for now

3. **CPUParticles2D should already exist**
   - Set Texture to something (can be blank for testing)
   - Make sure it's set to emitting: false (will be triggered on hit)

### Step 5: Set Up TestDummy Scene in Editor

Open `TestDummy.tscn`:

1. **Add CollisionShape2D**
   - Select CollisionShape2D node
   - Inspector → Shape → New CircleShape2D
   - Set Radius: 8 pixels

2. **Add Sprite2D** (optional)
   - Add a colored square or cube for visibility

3. **Label already exists**
   - Shows "HP: 5" initially

### Step 6: Set Collision Layers

This is **CRITICAL**. See `COLLISION_LAYERS.md` for full reference.

#### Player Node (CharacterBody2D)
```
Physics → Collision → Layer: 1
Physics → Collision → Mask: 2, 4, 5
```
(Checkbox layer 1, checkbox masks for 2, 4, 5)

#### Stone Node (RigidBody2D)
```
Physics → Collision → Layer: 3
Physics → Collision → Mask: 2, 4
```
(Checkbox layer 3, checkbox masks for 2, 4)

#### TestDummy Node (StaticBody2D)
```
Physics → Collision → Layer: 2
Physics → Collision → Mask: (uncheck all)
```

### Step 7: Place a TestDummy in World

Edit `World.tscn`:

1. Right-click World node → Instance Child Scene
2. Select `res://scenes/test/TestDummy.tscn`
3. Position the dummy a few hundred pixels away from player spawn point
4. Example: Player spawns at (320, 180), place dummy at (500, 180)

### Step 8: Save All Scenes

Save World.tscn, Player.tscn, Stone.tscn, TestDummy.tscn

---

## 🧪 TESTING THE FULL COMBAT LOOP

### Test 1: Basic Stone Throwing (30 seconds)

**What to do:**
1. Press **F5** to play
2. Move mouse cursor to the right of the player
3. Press **Space** to throw stone toward the cursor
4. Stone should appear at player position and travel toward mouse

**What to check:**
- ✅ Stone appears
- ✅ Stone travels in the direction of the mouse
- ✅ Console shows "Stone spawned at..." message
- ✅ Stone exists briefly then disappears (self-destructs after 2 seconds)

**If it fails:**
- Did you press Space? Check input action exists (move_up, move_down, etc. + **throw_stone**)
- Is Stone.tscn loaded? Check the path in Player.gd: `const STONE_SCENE_PATH`
- Does Stone have a CollisionShape2D? Without it, collision won't work

---

### Test 2: Throw Cooldown (30 seconds)

**What to do:**
1. Press **Space** rapidly multiple times
2. Observe the frequency of stone spawning

**What to check:**
- ✅ First stone spawns immediately
- ✅ Second stone doesn't spawn for 0.4 seconds
- ✅ Throw animation plays during cooldown
- ✅ After 0.4 seconds, you can throw again

**If it fails:**
- Check `THROW_COOLDOWN = 0.4` in Player.gd
- Check `_update_throw_cooldown()` is being called in `_physics_process()`

---

### Test 3: Stone Hits Dummy (1 minute)

**What to do:**
1. Stand near the TestDummy
2. Press **Space** to throw a stone directly at it
3. Watch the dummy for:
   - Red flash effect
   - HP number changes (5 → 4 → 3 → ...)
   - Console output

**What to check:**
- ✅ Stone hits dummy and disappears
- ✅ Dummy flashes red (Tween effect)
- ✅ HP label updates (e.g., "HP: 4")
- ✅ Console shows "Dummy hit! HP: 4 / 5"
- ✅ Console shows "Stone hit enemy and dealt 1 damage"

**If it fails:**
- **Stone passes through dummy**: Check collision layers! Dummy must be layer 2, Stone must have mask including 2
- **Dummy doesn't flash**: Check TestDummy.gd has Tween code in `_play_hit_flash()`
- **HP doesn't update**: Check `_update_hp_label()` is called in `apply_damage()`

---

### Test 4: Dummy Dies at 0 HP (1 minute)

**What to do:**
1. Throw 5 stones at the dummy (5 hits = 5 damage)
2. Watch as HP decreases: 5 → 4 → 3 → 2 → 1 → 0
3. When HP reaches 0, dummy should disappear

**What to check:**
- ✅ Each hit reduces HP by 1
- ✅ At 5th hit, HP label shows "HP: 0"
- ✅ Dummy flashes red one final time
- ✅ After a short delay (0.2 seconds), dummy disappears
- ✅ Console shows "Dummy defeated!"

**If it fails:**
- **Dummy doesn't die**: Check `if current_hp <= 0: _die()` in TestDummy.gd
- **Dummy disappears immediately**: Check the `queue_free()` in `_die()` is after the timeout

---

### Test 5: Screen Shake on Hit (30 seconds)

**What to do:**
1. Throw a stone at the dummy
2. Watch the camera movement when stone hits

**What to check:**
- ✅ When stone hits dummy, camera vibrates briefly
- ✅ Vibration is subtle (not nauseating)
- ✅ Camera returns to player position after shake

**If it fails:**
- **No screen shake**: Check World.gd has `camera_shake()` method
- **Stone not calling shake**: Check Stone.gd calls `get_parent().camera_shake()` on hit
- **Shake too strong/weak**: Adjust `strength` parameter (default 4.0)

---

### Test 6: Stone Auto-Destructs (1 minute)

**What to do:**
1. Throw a stone in an empty area (toward nothing)
2. Wait 2 seconds
3. Stone should disappear

**What to check:**
- ✅ Stone travels and doesn't hit anything
- ✅ After 2 seconds, stone auto-destroys (checks `STONE_LIFETIME = 2.0`)
- ✅ No orphaned projectiles cluttering the scene

**If it fails:**
- **Stone persists**: Check `if lifetime_remaining <= 0.0: queue_free()` in Stone.gd

---

## 📊 CONSOLE OUTPUT DURING FULL TEST

When you complete a full combat cycle, console should show:

```
Player initialized at (320, 180)
World initialized - Player spawned at (320, 180)
TestDummy spawned with 5 HP
Stone spawned at (320, 180) heading toward (0.707, 0)
Stone hit enemy and dealt 1 damage
Dummy hit! HP: 4 / 5
Impact effect played at (500, 180)
Stone exceeded lifetime, destroying...  [when 2nd stone expires]
...
Dummy defeated!
```

---

## ⚠️ COMMON BEGINNER MISTAKES

### ❌ Mistake 1: Wrong Collision Layers

```gdscript
# WRONG - all nodes in same layer, everything collides with everything
player.collision_layer = 1
player.collision_mask = 1  # Only sees layer 1

# CORRECT - specific layers for each type
stone.collision_layer = 3  # I am a stone
stone.collision_mask = 2 | 4  # I collide with enemies and world
```

**Impact:** Stones hit player, stones hit other stones, enemies ignore walls.

---

### ❌ Mistake 2: Not Checking for `apply_damage()` Method

```gdscript
# WRONG - crashes if object doesn't have apply_damage()
collider.apply_damage(1)

# CORRECT - check first
if collider.has_method("apply_damage"):
    collider.apply_damage(1)
```

**Impact:** Stone hits wall → crash because walls don't have apply_damage().

---

### ❌ Mistake 3: Using `RigidBody2D` With Gravity

```gdscript
# WRONG - gravity pulls stones down
extends RigidBody2D
# gravity_scale = 1.0 (default)

# CORRECT - disable gravity for projectiles
extends RigidBody2D
const gravity_scale: float = 0.0
```

**Impact:** Stones curve downward weirdly.

---

### ❌ Mistake 4: Stone Spawning As Player Child

```gdscript
# WRONG - stone is child of player, moves with player
add_child(stone)  # Adds to Player

# CORRECT - add to World so it's independent
get_parent().add_child(stone)  # Adds to World/Scene root
```

**Impact:** Stones follow player around, never hit anything.

---

### ❌ Mistake 5: Not Normalizing Throw Direction

```gdscript
# WRONG - speed varies by angle
var direction = mouse_pos - player_pos
stone.velocity = direction * SPEED

# CORRECT - constant speed in all directions
var direction = (mouse_pos - player_pos).normalized()
stone.velocity = direction * SPEED
```

**Impact:** Stones move faster diagonally.

---

### ❌ Mistake 6: Infinite Stone Cooldown

```gdscript
# WRONG - can_throw is never set back to true
func _attempt_throw():
    can_throw = false
    # ... but never set can_throw = true again!

# CORRECT - update cooldown every frame
func _update_throw_cooldown(delta):
    if not can_throw:
        throw_cooldown_remaining -= delta
        if throw_cooldown_remaining <= 0.0:
            can_throw = true
```

**Impact:** Can only throw once.

---

## 🎛️ TUNING & TWEAKING

Once everything works, you can adjust these in the scripts:

| Parameter | Location | Default | Effect |
|-----------|----------|---------|--------|
| STONE_SPEED | Stone.gd | 400.0 | How fast stone travels |
| STONE_LIFETIME | Stone.gd | 2.0 | Before auto-destruct |
| STONE_DAMAGE | Stone.gd | 1 | Damage per hit |
| THROW_COOLDOWN | Player.gd | 0.4 | Seconds between throws |
| MAX_HP | TestDummy.gd | 5 | Dummy health |
| Shake Duration | World.gd | 0.15 | How long shake lasts |
| Shake Strength | World.gd | 4.0 | How intense shake is |

---

## 📋 FULL TEST CHECKLIST

Run through these in order:

- [ ] Stone spawns when Space pressed
- [ ] Stone travels toward mouse cursor
- [ ] Can't spam stones (0.4s cooldown)
- [ ] Stone hits dummy (test collision layers)
- [ ] Dummy flashes red on hit
- [ ] Dummy HP decreases
- [ ] Dummy dies at 0 HP and disappears
- [ ] Screen shakes when stone hits
- [ ] Stone auto-destructs after 2 seconds if no hit
- [ ] Console shows all debug messages

---

## ✨ NEXT STEPS

Once combat is working:

**Task 3: Procedural Cave Generation**
- Generate random levels using drunk-walker or BSP algorithm
- Place walls using TileMap
- Spawn player and enemies in valid areas
- Add starting room and exit

---

## 🐛 TROUBLESHOOTING REFERENCE

| Issue | Cause | Fix |
|-------|-------|-----|
| Stone doesn't appear | Path wrong or scene missing | Check STONE_SCENE_PATH in Player.gd |
| Stone passes through dummy | Collision layers wrong | See COLLISION_LAYERS.md |
| Dummy doesn't take damage | No `apply_damage()` method | Check TestDummy.gd has it |
| Camera doesn't shake | World.gd not updated | Replace World.gd from repo |
| Stone hits player | Collision mask includes layer 1 | Stone mask should only be 2, 4 |
| Can only throw once | Cooldown not resetting | Check `_update_throw_cooldown()` |
| Dummy disappears instantly | queue_free() not after timeout | Check await in `_die()` |

---

**READY TO TEST!** 🎮
