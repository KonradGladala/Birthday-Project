import { BaseScene } from './BaseScene.js';
import Phaser from 'phaser';

export class World2 extends BaseScene {
    constructor() {
        super('World2'); // Unique key for this scene
    }

    preload() {console.log('Loading World2...');}

    create() {
        super.create(); // Call shared create logic from BaseScene

        // Add a background
       // this.add.image(550, 250, 'background');

        // Add NPCs or other world-specific logic
        this.add.text(50, 50, 'Welcome to World 2! lololool', { fontSize: '24px', fill: '#fff' });
    }

    update(time, delta) {
        // Add world-specific update logic here
    }
}