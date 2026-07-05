## TestDummy.gd
## Simple test dummy for combat testing
## Has HP that decreases on hit and flashes red

extends StaticBody2D

# ============================================================================
# SIGNALS
# ============================================================================

## Emitted when this dummy is destroyed (HP reaches 0)
signal enemy_died

# ============================================================================
# PROPERTIES
# ============================================================================

## Maximum HP for this dummy
const MAX_HP: int = 5

## Current HP
var current_hp: int = MAX_HP

## Reference to the HP label
var hp_label: Label

## Reference to the sprite for tween effects
var sprite: Sprite2D

# ============================================================================
# LIFECYCLE METHODS
# ============================================================================

## Called when the scene is ready
func _ready() -> void:
	# Get references to child nodes
	hp_label = $Label
	sprite = $Sprite2D
	
	# Update label to show current HP
	_update_hp_label()
	
	print("TestDummy spawned with ", current_hp, " HP")

# ============================================================================
# DAMAGE SYSTEM
# ============================================================================

## Apply damage to this dummy
## Called by Stone.gd when a stone hits this dummy
func apply_damage(amount: int) -> void:
	# Reduce HP
	current_hp -= amount
	
	print("Dummy hit! HP: ", current_hp, " / ", MAX_HP)
	
	# Update HP label
	_update_hp_label()
	
	# Play hit effect (flash red)
	_play_hit_flash()
	
	# Check if dummy is dead
	if current_hp <= 0:
		_die()

## Update the HP label display
func _update_hp_label() -> void:
	hp_label.text = "HP: " + str(current_hp)

## Play a red flash effect when hit
func _play_hit_flash() -> void:
	# Create a tween for the flash effect
	var tween = create_tween()
	
	# Set tween properties
	tween.set_trans(Tween.TRANS_QUAD)  # Smooth easing
	tween.set_ease(Tween.EASE_OUT)     # Ease out
	
	# Flash red: change modulate color to red, then back to white
	tween.tween_property(sprite, "modulate", Color.RED, 0.1)
	tween.tween_property(sprite, "modulate", Color.WHITE, 0.1)

## Called when HP reaches 0
func _die() -> void:
	print("Dummy defeated!")
	
	# Emit death signal (for future game logic)
	enemy_died.emit()
	
	# Wait a short time for visual feedback, then destroy
	await get_tree().create_timer(0.2).timeout
	queue_free()
