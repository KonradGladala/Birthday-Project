const baseSpeed = 150; // Base speed
const maxSpeed = 500; // Normal maximum speed
const airBoostFactor = 5; // Speed increase per airTime unit
const airBoostCap = 150; // Maximum additional speed allowed while in air
let currentSpeed = baseSpeed;
let jumpCount = 0; // Track the number of jumps
let stamina = 100; // Bunny's stamina (out of 100)
let staminaDrainRate = 1; // Stamina drained per attack
const staminaRegenRate = 30; // Stamina regenerated per second
const minimumStaminaForAttack = 3.5; // Define the minimum stamina required to start an attack

export function handlePlayerMovement(bunny, cursors, attackKey, delta) {
    
    let movementState = {
        isMovingLeft: false,
        isMovingRight: false,
        isIdle: true,
        isJumping: false,
        isAttacking: false
    };

    // Regenerate stamina when not attacking
    if (!attackKey.isDown) {
        stamina = Math.min(stamina + (staminaRegenRate * delta) / 1000, 100); // Regenerate stamina over time
    }

    // Only allow attack if bunny is on the ground and has enough stamina
    if (attackKey.isDown && bunny.body.onFloor() && stamina >= minimumStaminaForAttack) {
        bunny.setVelocityX(0); // Stop horizontal movement
        movementState.isAttacking = true;
        movementState.isIdle = false;
        stamina -= staminaDrainRate - (stamina / 100 / 1.2); // Deplete stamina over time
        return movementState; // Exit early to block other actions
    }

    // If airborne, increment airTime; else, reset it.
    if (!bunny.body.onFloor()) {
        bunny.airTime = (bunny.airTime || 0) + 1; // frame-based increment
    } else {
        bunny.airTime = 0;
    }

    // Gradual deceleration when no key is pressed
    if (!cursors.left.isDown && !cursors.right.isDown) {
        currentSpeed = baseSpeed; // Reset to base when idle on the ground
        if (bunny.body.velocity.x > 0) {
            bunny.setVelocityX(Math.max(bunny.body.velocity.x - 43, 0));
        } else if (bunny.body.velocity.x < 0) {
            bunny.setVelocityX(Math.min(bunny.body.velocity.x + 43, 0));
        }
    }

    // Calculate the current max speed based on airTime.
    let dynamicMaxSpeed = bunny.body.onFloor()
        ? maxSpeed
        : Math.min(maxSpeed + bunny.airTime * airBoostFactor, maxSpeed + airBoostCap);

    // Move left
    if (cursors.left.isDown) {
        if (bunny.lastDirection !== 'left') {
            currentSpeed = baseSpeed + 50;
            bunny.lastDirection = 'left';
        }
        currentSpeed = Math.min(
            currentSpeed + Math.floor(Math.random() * 5) + 1,
            dynamicMaxSpeed
        );
        bunny.setVelocityX(-currentSpeed);
        movementState.isMovingLeft = true;
        movementState.isIdle = false;
        bunny.flipX = true; // Face left
    }
    // Move right
    else if (cursors.right.isDown) {
        if (bunny.lastDirection !== 'right') {
            currentSpeed = baseSpeed + 50;
            bunny.lastDirection = 'right';
        }
        currentSpeed = Math.min(
            currentSpeed + Math.floor(Math.random() * 5) + 1,
            dynamicMaxSpeed
        );
        bunny.setVelocityX(currentSpeed);
        movementState.isMovingRight = true;
        movementState.isIdle = false;
        bunny.flipX = false; // Face right
    }

    // Jump logic (using space key)
    if (Phaser.Input.Keyboard.JustDown(cursors.space) && jumpCount < 2) {
        if (jumpCount === 0) {
            bunny.jumpInProgress = true;
            if (cursors.left.isDown) {
                bunny.jumpDirection = 'left';
            } else if (cursors.right.isDown) {
                bunny.jumpDirection = 'right';
            } else {
                bunny.jumpDirection = null;
            }
        }
        const randomJumpVelocity = Math.floor(Math.random() * (900 - 600 + 1)) + 600;
        bunny.setVelocityY(-randomJumpVelocity);
        jumpCount++;
        movementState.isJumping = true;
        movementState.isIdle = false;
    }

    return movementState;
}

export function resetJumpState(bunny) {
    bunny.jumpDirection = null;
    bunny.jumpInProgress = false;
}

export function getJumpCount() {
    return jumpCount;
}

export function setJumpCount(count) {
    jumpCount = count;
}

export function getStamina() {
    return stamina;
}