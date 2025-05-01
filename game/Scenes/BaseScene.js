import { preloadBasic } from '../Preload/preloadBasic.js';
import { defineAnimations } from '../Animations/animations.js';
import Phaser from 'phaser';

export class BaseScene extends Phaser.Scene {
    constructor(key) {
        super({ key }); // Each scene will have a unique key
    }

    preload() {
        // Load shared assets
        console.log('Loading BaseScene...');
        preloadBasic(this);
    }

    create() {
       // this.physics.world.createDebugGraphic(); // If using Arcade physics
        // Define shared animations
        defineAnimations(this);

        // Add a key listener for switching scenes (for testing)
        this.input.keyboard.on('keydown-M', () => {
            this.scene.start('World2'); // Example: Switch to World2
        });
    }

    update(time, delta) {
        // Cull objects outside the camera's view
        this.cullOffscreenObjects();
    }

    cullOffscreenObjects() {
        const cameraBounds = this.cameras.main.worldView; // Get the camera's current view bounds

        this.children.list.forEach((child) => {
            if (child.active && child.getBounds) {
                const bounds = child.getBounds();

                // Check if the object is outside the camera's view
                if (
                    bounds.right < cameraBounds.left || // Object is to the left of the camera
                    bounds.left > cameraBounds.right || // Object is to the right of the camera
                    bounds.bottom < cameraBounds.top || // Object is above the camera
                    bounds.top > cameraBounds.bottom // Object is below the camera
                ) {
                    // Cull the object (deactivate or unload)
                    child.setActive(false).setVisible(false);
                } else {
                    // Reactivate the object if it's back in view
                    child.setActive(true).setVisible(true);
                }
            }
        });
    }
}