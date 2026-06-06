# Task 1: Player Movement & Basic Scene Setup - Testing Guide

## STEP-BY-STEP SETUP INSTRUCTIONS

### 1. Create Input Map Actions

1. Open Godot and your project
2. Go to **Project → Project Settings** (top menu bar)
3. Click the **Input Map** tab
4. For each action below, type the action name and click **Add**:

**Actions to create:**
- `move_up`
- `move_down`
- `move_left`
- `move_right`
- `throw_stone` (we'll use this in Task 2)
- `open_inventory` (we'll use this in Task 6)
- `pause` (we'll use this in Task 4)

**Example for `move_up`:**
1. Type "move_up" in the text field
2. Click "Add"
3. Click the newly created action to expand it
4. Click "Add Event"
5. Press **W** (or Up Arrow)
6. Repeat to add **Up Arrow** as a second input

**Repeat for all actions with these default bindings:**

| Action | Primary | Secondary |
|--------|---------|-----------|
| move_up | W | Up Arrow |
| move_down | S | Down Arrow |
| move_left | A | Left Arrow |
| move_right | D | Right Arrow |
| throw_stone | Space | - |
| open_inventory | I | - |
| pause | Escape | - |

### 2. Set Up Project Folders

Create these folders in your res:// (root):
```
res://scenes/
res://scenes/world/
res://scenes/player/
res://scripts/
res://scripts/globals/
res://scripts/systems/
res://scripts/utils/
res://assets/
res://audio/
```

### 3. Create Scene Files

**In res://scenes/world/:**
- World.tscn (copy from repo)
- World.gd (copy from repo)

**In res://scenes/player/:**
- Player.tscn (copy from repo)
- Player.gd (copy from repo)

### 4. Add a Temporary Sprite to Player (For Testing)

Since we don't have sprites yet, we'll use a ColorRect as a placeholder:

1. Open Player.tscn in Godot editor
2. **Do NOT attach scripts yet** - we need to set up the node tree first
3. With "Player" selected in the Scene tree, add these child nodes:
   - **CollisionShape2D** (right-click Player → Add Child Node)
   - **AnimatedSprite2D**
   - **Camera2D**

**For CollisionShape2D:**
1. Select it
2. In the Inspector (right panel), find "Shape" property
3. Click the dropdown → **"New CircleShape2D"**
4. Set Radius to **8** (pixels)

**For AnimatedSprite2D:**
1. Select it
2. In Inspector, find "Sprite Frames" property
3. Click "Create New SpriteFrames"
4. Now we need to create placeholder animations:
   - Click on the SpriteFrames resource you just created to open it
   - In the "Animations" panel on the left, click **"Add Animation"**
   - Name it **"idle"**
   - We'll leave it empty for now (no frames) - it will just show nothing
   - Add animations: **"walk"**, **"throw"**, **"hurt"** the same way

**For Camera2D:**
1. Select it
2. In Inspector, set these properties:
   - **Zoom**: 2.0 (to make the player easier to see)
   - **Enabled**: True (checkbox)

### 5. Create a Minimal World Scene

1. Open World.tscn
2. Make sure World node is selected
3. Add a child node: **CanvasLayer** (for UI layering)
4. Save World.tscn

### 6. Set World as Main Scene

1. In Godot top menu: **Project → Project Settings → General**
2. Search for "Main Scene"
3. Set it to **res://scenes/world/World.tscn**

---

## TESTING PLAYER MOVEMENT

### Test 1: Basic Movement (All 8 Directions)

**What to do:**
1. **F5** to play the game (or click Play button)
2. Press **W** - player should move UP
3. Press **A** - player should move LEFT
4. Press **S** - player should move DOWN
5. Press **D** - player should move RIGHT

**What to check:**
- ✅ Player moves smoothly in all 4 cardinal directions
- ✅ Movement responds immediately to input
- ✅ Movement stops when you release the key
- ✅ Check the debug console (Output tab at bottom) - you should see "Player initialized at (320, 180)"

**If it fails:**
- Did you create all 4 input actions? (move_up, move_down, move_left, move_right)
- Is the CollisionShape2D added to Player? (without it, move_and_slide won't work)
- Check that Player.gd is attached as the script to the Player node

### Test 2: Diagonal Movement

**What to do:**
1. Press **W + D** simultaneously - player should move UP-RIGHT
2. Release and press **A + S** - player should move DOWN-LEFT
3. Try all diagonal combinations

**What to check:**
- ✅ Diagonals work smoothly
- ✅ Player moves at the SAME speed as cardinal directions (not faster!)
- ✅ No jittering or stuttering

**Why this matters:**
- The `normalized()` function in Player.gd ensures diagonal movement isn't faster
- Without normalize, (1,1) has magnitude √2 ≈ 1.41x faster than (1,0)
- This is a VERY common beginner mistake!

### Test 3: Acceleration & Friction

**What to do:**
1. Hold **W** for 2 seconds - player should smoothly accelerate
2. Release **W** - player should smoothly decelerate to a stop (not stop instantly)

**What to check:**
- ✅ Player doesn't move at max speed immediately (smooth acceleration)
- ✅ Player doesn't stop instantly when you release input (smooth deceleration)
- ✅ No clipping or jitter

**Why this matters:**
- `move_toward()` creates smooth acceleration/deceleration
- This feels better than instant velocity changes
- Games like Isaac use this for responsive but smooth movement

### Test 4: Camera Following

**What to do:**
1. Play the game
2. Move the player around
3. The camera should smoothly follow, keeping player centered

**What to check:**
- ✅ Camera follows player smoothly
- ✅ Camera doesn't lag too much behind the player
- ✅ Camera doesn't snap/jitter

**If the camera is too slow or too fast:**
- In Player.gd, change `CAMERA_FOLLOW_SPEED` (0.05 = slower, 0.2 = faster)

### Test 5: Animations (Idle vs Walk)

**What to do:**
1. Play the game
2. Stand still - watch the Output console
3. Move around - watch the Output console

**What to check:**
- ✅ No console errors about animations
- ✅ The script runs without crashing
- (We can't see animations yet since we have no sprite frames, but the script structure is ready)

### Test 6: Debug Output

**What to check in the Output panel (bottom of Godot):**

```
Player initialized at (320, 180)
```

You should see this message when you play. If you don't:
- Player.gd script might not be attached
- World.tscn might not be set as the main scene

---

## COMMON BEGINNER MISTAKES TO AVOID

### ❌ Mistake 1: Forgetting to Normalize Input Direction

```gdscript
# WRONG - diagonal movement is sqrt(2) times faster!
velocity = input_direction * MAX_SPEED

# CORRECT - always normalize before multiplying by speed
if input_direction != Vector2.ZERO:
    input_direction = input_direction.normalized()
    velocity = input_direction * MAX_SPEED
```

**Why it matters:** Diagonals feel unbalanced and make the game feel cheap.

---

### ❌ Mistake 2: Not Using `move_and_slide()`

```gdscript
# WRONG - this ignores physics and collision
global_position += velocity

# CORRECT - use CharacterBody2D's physics system
velocity = move_and_slide(velocity)
```

**Why it matters:** `move_and_slide()` handles:
- Wall sliding (you slide along walls instead of getting stuck)
- Proper collision detection
- Platform support (standing on moving platforms)

---

### ❌ Mistake 3: Using `_process()` for Movement

```gdscript
# WRONG - inconsistent frame rate causes uneven movement
func _process(delta):
    velocity.x += INPUT...
    global_position += velocity * delta

# CORRECT - use _physics_process() for physics
func _physics_process(delta):
    velocity = move_and_slide(velocity)
```

**Why it matters:** `_physics_process()` is called at a fixed 60 FPS, so movement is consistent. `_process()` varies with frame rate.

---

### ❌ Mistake 4: Not Checking if Node References Exist

```gdscript
# WRONG - if $AnimatedSprite2D doesn't exist, game crashes
if animated_sprite.animation != "walk":
    animated_sprite.play("walk")

# CORRECT - get reference in _ready()
func _ready():
    animated_sprite = $AnimatedSprite2D  # Cache it
```

**Why it matters:** Safer, faster, and easier to debug.

---

### ❌ Mistake 5: Creating New Vector2 Every Frame

```gdscript
# WRONG - creates garbage every frame (bad for performance)
func _physics_process(delta):
    var input_direction = Vector2(Input.is_action_pressed("move_right"), ...)
    # ...

# CORRECT - reuse Vector2 or just add to it
var input_direction = Vector2.ZERO
if Input.is_action_pressed("move_up"):
    input_direction.y -= 1
```

**Why it matters:** More efficient, less memory allocation.

---

## NEXT STEPS (Task 2)

Once movement is working:
1. Add a simple sprite (even a colored rectangle is fine for prototyping)
2. Test animations play correctly
3. Then move to **Task 2: Combat System (Stone Throwing)**

## TROUBLESHOOTING CHECKLIST

| Problem | Solution |
|---------|----------|
| Player doesn't move | Check that input actions exist in Project Settings |
| Game crashes on startup | Check that Player.gd is attached to Player node |
| Player moves too fast/slow | Adjust MAX_SPEED constant in Player.gd |
| Diagonal movement is faster | Make sure normalize() is being called |
| Camera doesn't follow | Check Camera2D is enabled in Inspector |
| No console output | Check World.tscn is set as Main Scene |
| Player gets stuck on walls | Make sure CharacterBody2D has a CollisionShape2D child |
