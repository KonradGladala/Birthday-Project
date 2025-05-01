export class Bunny {
    constructor(scene, x, y, texture = 'bunny_idle') {
        this.scene = scene;

        // Create the bunny sprite
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite.setScale(3.5);
        this.sprite.setCollideWorldBounds(true);

        // Add custom properties
        this.name = 'Siva';
        this.health = 100;
        this.speed = 0;
        this.stamina = 100;

        // Track the current state
        this.currentState = 'idle';
        this.currentlyJumping = false;

        // Add movement keys
        this.controls = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
            rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        // Handle animation completion
        this.sprite.on('animationcomplete', (animation) => {
            if (animation.key === 'jump' && this.sprite.body.onFloor()) {
                this.currentlyJumping = false;
                this.currentState = 'idle';
            }
        });
    }

    update() {
        this.handleMovement();
        this.processState();
    }

    handleMovement() {
        const cursors = this.controls;

        // Handle horizontal movement
        if (cursors.left.isDown || cursors.leftArrow.isDown) {
            this.sprite.setVelocityX(-this.speed - 450);
            this.sprite.flipX = true; // Flip horizontally to face left
            if (this.sprite.body.onFloor() && !this.currentlyJumping) {
                this.currentState = 'moving';
            }
        } else if (cursors.right.isDown || cursors.rightArrow.isDown) {
            this.sprite.setVelocityX(this.speed + 450);
            this.sprite.flipX = false; // Flip horizontally to face right
            if (this.sprite.body.onFloor() && !this.currentlyJumping) {
                this.currentState = 'moving';
            }
        } else if (this.sprite.body.onFloor() && !this.currentlyJumping) {
            this.sprite.setVelocityX(0); // Stop horizontal movement
            this.currentState = 'idle';
        }

        // Handle jumping
        if (Phaser.Input.Keyboard.JustDown(cursors.jump) && this.sprite.body.onFloor()) {
            this.sprite.setVelocityY(-700); // Jump
            this.currentState = 'jumping';
            this.currentlyJumping = true; // Set jump initiated flag
        }
    }

    processState() {
        // Play animations based on the current state
        if (this.currentState === 'jumping') {
            this.sprite.anims.play('jump', true);
        } else if (this.currentState === 'moving') {
            this.sprite.anims.play('run', true);
        } else if (this.currentState === 'idle') {
            this.sprite.anims.play('idle', true);
        }
    }
}