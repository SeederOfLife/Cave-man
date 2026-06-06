# Collision Layers Setup

For Cave Man Roguelike, we use Godot's collision layer/mask system to control what collides with what.

## Layer Definitions

| Layer | Name | Purpose |
|-------|------|----------|
| 1 | Player | Player character |
| 2 | Enemies | Hostile creatures (bats, bears, dinosaurs) |
| 3 | Stones | Player projectiles |
| 4 | World | Walls, obstacles, tile collisions |
| 5 | Items | Pickups (weapons, food, power-ups) |

## Node-Specific Collision Setup

### Player [CharacterBody2D]
```
Collision Layer: 1 (Player)
Collision Mask: 2, 4, 5
  → Player collides with Enemies (2), World (4), and Items (5)
  → Player does NOT collide with Stones (doesn't hurt itself)
```

### Stone [RigidBody2D]
```
Collision Layer: 3 (Stones)
Collision Mask: 2, 4
  → Stones collide with Enemies (2) and World (4)
  → Stones do NOT collide with Player (1) or Items (5)
  → Binary: 18 in decimal (00010010) = layer 2 + layer 4
```

### Enemy (Bat, CaveBear, Dinosaur) [CharacterBody2D]
```
Collision Layer: 2 (Enemies)
Collision Mask: 1, 3, 4
  → Enemies collide with Player (1), Stones (3), World (4)
  → Enemies do NOT collide with Items (5)
```

### Item/Pickup [Area2D]
```
Collision Layer: 5 (Items)
Collision Mask: 1
  → Items can be detected by Player (1) only
  → Items don't physically collide with anything
```

### TestDummy [StaticBody2D]
```
Collision Layer: 2 (Enemies)
Collision Mask: 0
  → Dummy is in Enemies layer
  → Dummy doesn't need to detect anything (static)
```

### World/TileMap [TileMap]
```
Collision Layer: 4 (World)
Collision Mask: 0
  → TileMap is in World layer
  → TileMap doesn't detect anything (static)
```

## How to Set in Godot Editor

1. Select the node in the Scene tree
2. In the Inspector, scroll to "Physics" section
3. Find "Collision" subsection
4. **Layer**: Check the layer number this node is on
5. **Mask**: Check which layers this node collides with (can select multiple)

## Example: Setting Up a Stone

1. Select Stone node
2. Inspector → Physics → Collision
3. **Layer**: Uncheck all, then check **3** (Stones)
4. **Mask**: Uncheck all, then check **2** (Enemies) and **4** (World)
   - In decimal, this is: 2^(2-1) + 2^(4-1) = 2 + 8 = 10... wait
   - Actually: bit 2 + bit 4 = 0b010010 = 18 in decimal
   - But you just check the boxes, Godot calculates it!

## Binary Reference (for reference)

If you need to set collision_mask in code:

```gdscript
# Layer 1 = bit 0 = 2^0 = 1
# Layer 2 = bit 1 = 2^1 = 2
# Layer 3 = bit 2 = 2^2 = 4
# Layer 4 = bit 3 = 2^3 = 8
# Layer 5 = bit 4 = 2^4 = 16

# To collide with layers 2 and 4:
stone.collision_mask = 2 + 8  # = 10

# Or in binary:
stone.collision_mask = 0b1010  # = 10
```

## GDScript Code Examples

### Setting collision in code:

```gdscript
# Stone collides with Enemies (2) and World (4)
stone.collision_layer = 4      # Layer 3 = bit 2 = 2^2 = 4
stone.collision_mask = 10      # Layers 2 + 4 = 2 + 8 = 10

# Player collides with Enemies (2), World (4), Items (5)
player.collision_layer = 1     # Layer 1
player.collision_mask = 22     # Layers 2 + 4 + 5 = 2 + 8 + 16 = 26... wait
# Actually: layer 2 = 2, layer 4 = 8, layer 5 = 16
# 2 + 8 + 16 = 26
player.collision_mask = 26
```

## Why This Matters

- **Performance**: Only relevant collision checks are performed
- **Gameplay**: Player can't be hit by their own stones
- **Future Enemies**: Won't collide with each other (only with player, stones, world)
- **Items**: Can be collected by player without physics interference

## Common Mistakes

❌ **Setting Stone's collision_mask to 31 (all layers)**
→ Stones would hit the player, too inefficient

❌ **Not setting World/TileMap collision layer**
→ Stones and enemies pass through walls

❌ **Setting Enemy collision_mask too high**
→ Enemies collide with items and other enemies (causes jitter)

✅ **Correct**: Each node type only collides with what it needs
