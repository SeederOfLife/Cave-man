## World.gd
## Root scene manager for Cave Man Roguelike
## Handles scene setup, player spawning, and overall game flow

extends Node2D

# ============================================================================
# NODE REFERENCES
# ============================================================================

var player: Node2D = null
var camera: Camera2D = null

# ============================================================================
# LIFECYCLE METHODS
# ============================================================================

## Called when the scene is ready (all nodes initialized)
func _ready() -> void:
	# Load the player scene and instantiate it
	var player_scene = load("res://scenes/player/Player.tscn")
	player = player_scene.instantiate()
	
	# Add the player to the world at the center of the screen
	add_child(player)
	player.global_position = Vector2(320, 180)  # Center of a 640x360 viewport
	
	# Get reference to the player's camera for screen shake effects
	camera = player.get_node("Camera2D")
	
	# Connect player death signal (will be emitted when player health reaches 0)
	player.player_died.connect(_on_player_died)
	
	# Connect player throw signal for future stats tracking
	player.stone_thrown.connect(_on_player_threw_stone)
	
	print("World initialized - Player spawned at ", player.global_position)

## Called when the player dies
func _on_player_died() -> void:
	print("Player has died! TODO: Show game over screen")
	# TODO: In Task 4, we'll show a game over screen here
	# TODO: In Task 5+, we'll handle respawning or level transitions

## Called whenever the player throws a stone
func _on_player_threw_stone() -> void:
	print("Stone thrown - TODO: Update stats")
	# TODO: Update throw counter, etc.

# ============================================================================
# SCREEN SHAKE EFFECT
# ============================================================================

## Apply screen shake to the camera
## Called when stones hit things to add impact feedback
func camera_shake(duration: float = 0.15, strength: float = 4.0) -> void:
	if camera == null:
		return
	
	# Create a tween for the shake effect
	var tween = create_tween()
	
	# Store original position
	var original_position = camera.global_position
	
	# Shake duration and strength
	var shake_count = int(duration * 60.0)  # Number of frames
	
	# Apply random offset every frame for duration
	for i in range(shake_count):
		var random_offset = Vector2(
			randf_range(-strength, strength),
			randf_range(-strength, strength)
		)
		camera.global_position = original_position + random_offset
		await get_tree().process_frame
	
	# Return camera to original position
	camera.global_position = original_position
