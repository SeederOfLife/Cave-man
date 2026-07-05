# Cave Man Roguelike - Input Map Configuration

Add these actions to **Project → Project Settings → Input Map** in Godot:

## Movement Actions

| Action Name  | Default Input      | Type     | Description                        |
|--------------|--------------------|-----------|------------------------------------|
| move_up      | W, Up Arrow        | Key      | Move player up (8-direction)       |
| move_down    | S, Down Arrow      | Key      | Move player down (8-direction)     |
| move_left    | A, Left Arrow      | Key      | Move player left (8-direction)     |
| move_right   | D, Right Arrow     | Key      | Move player right (8-direction)    |

## Combat & Item Actions

| Action Name  | Default Input      | Type     | Description                        |
|--------------|--------------------|-----------|------------------------------------|
| throw_stone  | Space              | Key      | Throw stone in facing direction    |

## UI Actions

| Action Name      | Default Input      | Type     | Description                        |
|------------------|---------|-----------|--------------------------------------------|
| open_inventory   | I                  | Key      | Toggle inventory UI (Task 6)       |
| pause            | Esc                | Key      | Open pause menu                    |

## How to Add These to Input Map

1. Open **Project → Project Settings** (top menu)
2. Go to **Input Map** tab
3. In "Add New Action" field, type the first action name (e.g., `move_up`)
4. Press **Add**
5. Click the action to expand it
6. Click **"Add Event"** and select the input type (Key)
7. Press the key you want to bind (e.g., W)
8. Repeat for all actions

## GDScript Usage

In your scripts, check these actions with:

```gdscript
if Input.is_action_pressed("move_up"):
    # Handle upward movement
    
if Input.is_action_just_pressed("throw_stone"):
    # Handle stone throw (triggered once per press)
    
if Input.is_action_just_released("pause"):
    # Handle pause menu toggle
```

## Notes

- **is_action_pressed()** - Returns true every frame the action is held
- **is_action_just_pressed()** - Returns true only the frame the action is pressed
- **is_action_just_released()** - Returns true only the frame the action is released
- Diagonal movement will be automatically normalized in Player.gd to prevent speed boost
