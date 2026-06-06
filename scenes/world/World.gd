## World.gd
## Root scene manager for Cave Man Roguelike
## Handles scene setup, player spawning, and overall game flow

extends Node2D

# Node references
var player: Node2D = null

# Called when the scene is ready (all nodes initialized)
func _ready() -> void:
	# Load the player scene and instantiate it
	var player_scene = load("res://scenes/player/Player.tscn")
	player = player_scene.instantiate()
	
	# Add the player to the world at the center of the screen
	add_child(player)
	player.global_position = Vector2(320, 180)  # Center of a 640x360 viewport
	
	# Connect player death signal (will be emitted when player health reaches 0)
	player.player_died.connect(_on_player_died)
	
	print("World initialized - Player spawned at ", player.global_position)

# Called when the player dies
func _on_player_died() -> void:
	print("Player has died! TODO: Show game over screen")
	# TODO: In Task 4, we'll show a game over screen here
	# TODO: In Task 5+, we'll handle respawning or level transitions
