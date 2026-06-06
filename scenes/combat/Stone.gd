## Stone.gd
## Projectile script for thrown stones
## Handles movement, collision detection, damage, and cleanup

extends RigidBody2D

# ============================================================================
# PROPERTIES
# ============================================================================

## How fast the stone travels (pixels per second)
const STONE_SPEED: float = 400.0

## How long the stone exists before self-destructing (seconds)
const STONE_LIFETIME: float = 2.0

## Amount of damage this stone deals on hit
const STONE_DAMAGE: int = 1

# ============================================================================
# STATE VARIABLES
# ============================================================================

## Direction the stone is traveling (normalized)
var direction: Vector2 = Vector2.ZERO

## Time remaining before auto-destruction (if no collision)
var lifetime_remaining: float = STONE_LIFETIME

## Whether this stone has already dealt damage (prevent multiple hits to same target)
var has_dealt_damage: bool = false

## Reference to the particle system for impact effects
var impact_particles: CPUParticles2D

# ============================================================================
# LIFECYCLE METHODS
# ============================================================================

## Called when the scene is ready
func _ready() -> void:
	# Get reference to the particle system
	impact_particles = $CPUParticles2D
	
	# Set initial velocity based on direction
	# RigidBody2D doesn't use velocity directly, we update position manually
	velocity = direction * STONE_SPEED
	
	# Disable gravity for this projectile (we handle movement manually)
	gravity_scale = 0.0
	
	print("Stone spawned at ", global_position, " heading toward ", direction)

## Called every physics frame (60 times per second)
func _physics_process(delta: float) -> void:
	# Update lifetime counter
	lifetime_remaining -= delta
	
	# Auto-destruct if stone exceeds lifetime (prevents orphaned projectiles off-screen)
	if lifetime_remaining <= 0.0:
		print("Stone exceeded lifetime, destroying...")
		queue_free()
		return
	
	# Move the stone in its direction
	# Use move_and_collide to detect collisions manually
	var collision = move_and_collide(velocity * delta)
	
	# If we hit something, handle the collision
	if collision:
		_on_collision(collision)

# ============================================================================
# COLLISION HANDLING
# ============================================================================

## Called when the stone collides with something
func _on_collision(collision: KinematicCollision2D) -> void:
	# Get the object we hit
	var collider = collision.get_collider()
	
	# Check if the collider has an apply_damage() method (enemy/damageable object)
	if collider.has_method("apply_damage") and not has_dealt_damage:
		# Deal damage to the hit object
		collider.apply_damage(STONE_DAMAGE)
		has_dealt_damage = true
		print("Stone hit enemy and dealt ", STONE_DAMAGE, " damage")
	
	# Play impact particle effect at collision point
	_play_impact_effect(collision.get_position())
	
	# Stop the stone and clean up
	velocity = Vector2.ZERO
	queue_free()

## Play particle burst at impact location
func _play_impact_effect(position: Vector2) -> void:
	# Move particles to impact location
	impact_particles.global_position = position
	
	# Emit the particle burst
	impact_particles.emitting = true
	
	print("Impact effect played at ", position)

# ============================================================================
# INITIALIZATION HELPER
# ============================================================================

## Set the direction this stone will travel
func set_direction(new_direction: Vector2) -> void:
	# Normalize the direction to ensure consistent speed in all directions
	direction = new_direction.normalized()
	
	# Set initial velocity
	velocity = direction * STONE_SPEED
