## Player.gd
## Complete player controller for Cave Man Roguelike
## Handles 8-direction movement, animations, and signals

extends CharacterBody2D

# ============================================================================
# SIGNALS
# ============================================================================

## Emitted when player health reaches 0
signal player_died

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
	
	# TODO: Remove this print after testing
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

# ============================================================================
# INPUT HANDLING
# ============================================================================

## Read input actions and update velocity accordingly
func _handle_input(delta: float) -> void:
	# Get input direction from action inputs
	# We'll use a Vector2 to store the raw input direction
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
	# Without normalize(), moving diagonally would give sqrt(2) times speed increase
	# Example: right(1,0) + up(0,-1) = (1,-1) with magnitude ~1.41
	# After normalize: (0.707, -0.707) with magnitude 1.0
	if input_direction != Vector2.ZERO:
		input_direction = input_direction.normalized()
		
		# Update facing direction for animations and throwing
		facing_direction = input_direction
		
		# Accelerate towards max speed in the input direction
		velocity = velocity.move_toward(input_direction * MAX_SPEED, ACCELERATION * delta)
	else:
		# No input detected - apply friction (deceleration)
		velocity = velocity.move_toward(Vector2.ZERO, FRICTION * delta)

# ============================================================================
# ANIMATION HANDLING
# ============================================================================

## Update the animation sprite based on velocity and state
func _update_animation() -> void:
	# Check if player is moving
	if velocity.length() > 10.0:  # Threshold to avoid animation jitter at low speeds
		# Play walk animation
		if animated_sprite.animation != "walk":
			animated_sprite.play("walk")
		
		# Rotate sprite to face movement direction
		_update_sprite_direction()
	else:
		# Player is idle
		if animated_sprite.animation != "idle":
			animated_sprite.play("idle")

## Update sprite rotation/flipping based on facing direction
func _update_sprite_direction() -> void:
	# Calculate angle from current velocity
	var angle = velocity.angle()
	
	# Simple 4-direction system: snap to 90-degree angles
	# This makes animations cleaner without needing diagonal frames
	var snapped_angle = snappedf(angle, PI / 2)
	
	# Map angle to frame direction
	# 0 = right, PI/2 = down, PI or -PI = left, -PI/2 = up
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
	# This prevents jittery camera movement and creates a more polished feel
	camera.global_position = camera.global_position.lerp(
		global_position,
		CAMERA_FOLLOW_SPEED
	)

# ============================================================================
# DEBUG & TESTING
# ============================================================================

## Print current player state for debugging
func _print_debug() -> void:
	print_debug("Velocity: ", velocity, " | Facing: ", facing_direction)
