import { BaseScene } from './BaseScene.js';
import Phaser from 'phaser';

export class MainMenu extends BaseScene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        console.log('Loading MainMenu...');
        super.preload();

        this.load.spritesheet('mm1', '../assets/test/s21-Sheet.png', {
            frameWidth: 1152,
            frameHeight: 648
        });

        this.load.bitmapFont('minecraft', 'assets/fonts/Pixel.png', 'assets/fonts/Pixel.fnt');

        this.cameras.main.setBackgroundColor('#000000'); // Dark base
        this.cameras.main.fadeIn(5000, 0, 0, 0);
    }

    create() {
        const { width, height } = this.sys.game.config;

        // Animated background
        const bg = this.add.sprite(width / 2, height / 2, 'mm1')
            .setDisplaySize(width * 1.05, height * 1.2);

        this.anims.create({
            key: 'mm1_loop',
            frames: this.anims.generateFrameNumbers('mm1', { start: 0, end: 57 }),
            frameRate: 22,
            repeat: -1
        });

        bg.play('mm1_loop');

        // Adjusted cinematic movement (medium zoom + pan loop)
        this.tweens.add({
            targets: bg,
            scaleX: "+=0.07",
            scaleY: "+=0.07",
            x: width / 2 + 10,
            y: height / 2 - 10,
            duration: 10000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Gradually darkening overlay with gentle flicker
        const overlay = this.add.rectangle(0, 0, width, height, 0x000011, 0.3)
            .setOrigin(0)
            .setDepth(10);

        this.tweens.add({
            targets: overlay,
            alpha: { from: 0.3, to: 0.5 },
            duration: 10000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.time.addEvent({
            delay: 400, // gentler flicker
            loop: true,
            callback: () => {
                overlay.setAlpha(0.35 + Math.random() * 0.08);
            }
        });
            // Title
            this.add.bitmapText(width / 2, height * 0.15, 'minecraft', 'BUNNY ADVENTURE', 32)
                .setOrigin(0.5)
                .setTint(0xffffff)
                .setDepth(11);

            // Buttons
            const buttonLabels = ['Begin Story', 'Options', 'Exit'];
            const buttonCallbacks = [
                () => this.startGame(),
                () => console.log('Options clicked'),
                () => window.close() // Or this.game.destroy(true)
            ];

            buttonLabels.forEach((label, i) => {
                const btnY = height * 0.35 + i * 80;
                const button = this.add.rectangle(width / 2, btnY, 240, 60, 0x222255)
                    .setStrokeStyle(2, 0xffffff)
                    .setInteractive({ useHandCursor: true })
                    .setDepth(11);

                const buttonText = this.add.bitmapText(width / 2, btnY, 'minecraft', label, 20)
                    .setOrigin(0.5)
                    .setTint(0xffffff)
                    .setDepth(11);

                button.on('pointerover', () => button.setFillStyle(0x4444aa));
                button.on('pointerout', () => button.setFillStyle(0x222255));
                button.on('pointerdown', buttonCallbacks[i]);
            });
    }

    startGame() {
        this.scale.startFullscreen();
        this.input.setDefaultCursor('none');
        this.scene.start('World1');
    }
}
