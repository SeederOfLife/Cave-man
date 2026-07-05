## Player.gd
## Complete player controller for Cave Man Roguelike
## Handles 8-direction movement, animations, throwing, and signals

extends CharacterBody2D

# ============================================================================
# SIGNALS
# ============================================================================

## Emitted when player health reaches 0
signal player_died

## Emitted whenever player throws a stone (for stats tracking)
signal stone_thrown

# ============================================================================
# MOVEMENT PROPERTIES
# ============================================================================

## Maximum speed the player can move (pixels per second)
const MAX_SPEED: float = 200.0

## Acceleration rate when player presses input (pixels per second²)
const ACCELERATION: float = 1500.0

## Deceleration rate when player releases input (pixels per second²)
const FRICTION: float = 1200.0

## Current velocity of the player (used by CharacterBody2D)
var velocity: Vector2 = Vector2.ZERO

## Direction the player is currently facing (for animations and throwing)
var facing_direction: Vector2 = Vector2.RIGHT

# ============================================================================
# THROWING PROPERTIES
# ============================================================================

## Path to the stone scene to spawn
const STONE_SCENE_PATH: String = "res://scenes/combat/Stone.tscn"

## How long between throws (cooldown in seconds)
const THROW_COOLDOWN: float = 0.4

## Time remaining in the current throw cooldown
var throw_cooldown_remaining: float = 0.0

## Whether the player can throw right now
var can_throw: bool = true

# ============================================================================
# CAMERA PROPERTIES
# ============================================================================

## Smoothing speed for camera follow (0-1, higher = faster)
const CAMERA_FOLLOW_SPEED: float = 0.1

# ============================================================================
# REFERENCES TO CHILD NODES
# ============================================================================

var animated_sprite: AnimatedSprite2D
var camera: Camera2D

# ============================================================================
# LIFECYCLE METHODS
# ============================================================================

## Called when the scene is ready (all nodes initialized)
func _ready() -> void:
	# Get references to child nodes
	animated_sprite = $AnimatedSprite2D
	camera = $Camera2D
	
	print("Player initialized at ", global_position)

## Called every frame
func _process(_delta: float) -> void:
	# Update camera to smoothly follow player
	_update_camera()

## Called every physics frame (60 times per second)
func _physics_process(delta: float) -> void:
	# Get input and update velocity
	_handle_input(delta)
	
	# Apply velocity to position using built-in physics
	velocity = move_and_slide(velocity)
	
	# Update animation based on current state
	_update_animation()
	
	# Update throw cooldown
	_update_throw_cooldown(delta)

# ============================================================================
# INPUT HANDLING
# ============================================================================

## Read input actions and update velocity accordingly
func _handle_input(delta: float) -> void:
	# Get input direction from action inputs
	var input_direction = Vector2.ZERO
	
	# Check each movement action
	if Input.is_action_pressed("move_up"):
		input_direction.y -= 1
	if Input.is_action_pressed("move_down"):
		input_direction.y += 1
	if Input.is_action_pressed("move_left"):
		input_direction.x -= 1
	if Input.is_action_pressed("move_right"):
		input_direction.x += 1
	
	# IMPORTANT: Normalize the input direction to prevent diagonal speed boost
	if input_direction != Vector2.ZERO:
		input_direction = input_direction.normalized()
		facing_direction = input_direction
		velocity = velocity.move_toward(input_direction * MAX_SPEED, ACCELERATION * delta)
	else:
		velocity = velocity.move_toward(Vector2.ZERO, FRICTION * delta)
	
	# Check for throw input
	if Input.is_action_just_pressed("throw_stone"):
		_attempt_throw()

# ============================================================================
# THROWING MECHANICS
# ============================================================================

## Attempt to throw a stone if cooldown has expired
func _attempt_throw() -> void:
	# Check if we can throw (cooldown expired)
	if not can_throw:
		return
	
	# Calculate direction to mouse cursor
	# get_global_mouse_position() gets the mouse location in world space
	var mouse_position = get_global_mouse_position()
	var throw_direction = (mouse_position - global_position).normalized()
	
	# Spawn the stone at player position
	var stone = _spawn_stone(throw_direction)
	
	if stone:
		# Start the throw cooldown
		_start_throw_cooldown()
		
		# Play throw animation
		if animated_sprite.animation != "throw":
			animated_sprite.play("throw")
		
		# Emit signal for stats tracking
		stone_thrown.emit()
		
		print("Stone thrown toward ", throw_direction)

## Spawn a stone projectile and return it
func _spawn_stone(direction: Vector2) -> Node2D:
	# Load the stone scene
	var stone_scene = load(STONE_SCENE_PATH)
	
	if stone_scene == null:
		push_error("Failed to load stone scene at ", STONE_SCENE_PATH)
		return null
	
	# Create an instance of the stone
	var stone = stone_scene.instantiate()
	
	# Set the stone's starting position (at player)
	stone.global_position = global_position
	
	# Set the stone's direction
	stone.set_direction(direction)
	
	# Add the stone to the scene
	# Use get_parent() to add it to the world level, not as a child of the player
	get_parent().add_child(stone)
	
	return stone

## Start the throw cooldown timer
func _start_throw_cooldown() -> void:
	can_throw = false
	throw_cooldown_remaining = THROW_COOLDOWN

## Update the throw cooldown timer every frame
func _update_throw_cooldown(delta: float) -> void:
	if not can_throw:
		throw_cooldown_remaining -= delta
		
		# Check if cooldown has expired
		if throw_cooldown_remaining <= 0.0:
			can_throw = true
			throw_cooldown_remaining = 0.0

# ============================================================================
# ANIMATION HANDLING
# ============================================================================

## Update the animation sprite based on velocity and state
func _update_animation() -> void:
	# Check if player is moving
	if velocity.length() > 10.0:
		# Play walk animation only if not already playing throw or hurt
		if animated_sprite.animation not in ["throw", "hurt"]:
			animated_sprite.play("walk")
		
		# Rotate sprite to face movement direction
		_update_sprite_direction()
	else:
		# Player is idle - only switch to idle if not playing throw or hurt
		if animated_sprite.animation not in ["throw", "hurt"]:
			animated_sprite.play("idle")

## Update sprite rotation/flipping based on facing direction
func _update_sprite_direction() -> void:
	# Calculate angle from current velocity
	var angle = velocity.angle()
	
	# Simple 4-direction system: snap to 90-degree angles
	var snapped_angle = snappedf(angle, PI / 2)
	
	# Map angle to frame direction
	match snapped_angle:
		0:  # Right
			animated_sprite.rotation = 0
			animated_sprite.flip_h = false
		PI / 2:  # Down
			animated_sprite.rotation = PI / 2
			animated_sprite.flip_h = false
		PI, -PI:  # Left
			animated_sprite.rotation = 0
			animated_sprite.flip_h = true
		-PI / 2:  # Up
			animated_sprite.rotation = -PI / 2
			animated_sprite.flip_h = false

# ============================================================================
# CAMERA HANDLING
# ============================================================================

## Smoothly update camera position to follow player
func _update_camera() -> void:
	# Camera follows player with smooth easing
	camera.global_position = camera.global_position.lerp(
		global_position,
		CAMERA_FOLLOW_SPEED
	)

# ============================================================================
# DEBUG & TESTING
# ============================================================================

## Print current player state for debugging
func _print_debug() -> void:
	print_debug("Velocity: ", velocity, " | Facing: ", facing_direction, " | Can throw: ", can_throw)
