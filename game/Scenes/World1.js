import { BaseScene } from './BaseScene.js';
import { Bunny } from '../Controllers/bunny.js';
import Phaser from 'phaser';

const worldBounds = 150000;

export class World1 extends BaseScene {
    constructor() {
        super('World1');
        this.bunny = null;
        this.sky = null;
        this.fireflies = [];
        this.stillTimer = 0;
        this.previousBunnyX = 0;
    }

    preload() {
        console.log('Loading World1 scene...');
        this.load.image('mountainsBackground', 'assets/test/World1/MountainsBackground.png');
        this.load.image('background', 'assets/test/World1/Background.png');
        this.load.image('ground', 'assets/test/World1/Ground.png');
        this.load.image('sky', 'assets/test/World1/Sky.png');
        this.load.image('boulders', 'assets/objects/Boulder.png');
    }

    create() {
        this.dustGroup = this.add.group();
        super.create();

        this.textures.get('bunny_run').setFilter(Phaser.Textures.FilterMode.NEAREST);

        const gameWidth = this.game.config.width;
        const gameHeight = this.game.config.height;

        this.physics.world.setBounds(0, 0, worldBounds, gameHeight);
        this.cameras.main.setBounds(0, 0, worldBounds, gameHeight);

        this.sky = this.add.tileSprite(0, 0, worldBounds, this.scale.height, 'sky')
            .setOrigin(0, 0)
            .setScrollFactor(0.20);
        this.sky.tilePositionY = 300;

        this.mountainsBackground = this.add.tileSprite(0, 0, worldBounds, this.scale.height, 'mountainsBackground')
            .setOrigin(0, 0)
            .setScrollFactor(0.15);
        this.mountainsBackground.tilePositionY = 280;

        this.background = this.add.tileSprite(0, 0, worldBounds, this.scale.height, 'background')
            .setOrigin(0, 0)
            .setScrollFactor(0.35);
        this.background.tilePositionY = 300;

        this.tweens.add({
            targets: this.background,
            scaleY: { from: 1, to: 1.002 },
            duration: 1555,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.ground = this.add.tileSprite(0, 0, worldBounds, this.scale.height, 'ground')
            .setOrigin(0, 0)
            .setScrollFactor(0.70);
        this.ground.tilePositionY = 300;

        this.bunny = new Bunny(this, 100, 435, 'bunny_idle');
        this.bunny.sprite.setTint(0xDFC8E6);
        this.cameras.main.startFollow(this.bunny.sprite);

        const ground = this.add.rectangle(0, this.scale.height - 10, worldBounds, 40, 0xff0000)
            .setOrigin(0, 0);
        this.physics.add.existing(ground, true);
        ground.visible = false;
        this.physics.add.collider(this.bunny.sprite, ground);

        this.spawnFireflies();
    }

    weightedCenterRandom(min, max, center, power = 2) {
        const r = Math.random();
        const biased = Math.pow(r, power);
        const direction = Math.random() < 0.5 ? -1 : 1;
        const offset = (max - center) * biased * direction;
        return Phaser.Math.Clamp(center + offset, min, max);
    }

    spawnFireflies() {
        const minX = 500;
        const maxX = 30000;
        const centerX = (minX + maxX) / 2;

        for (let i = 0; i < 350; i++) {
            const x = this.weightedCenterRandom(minX, maxX, centerX, 2.5);
            const y = Phaser.Math.Between(100, this.scale.height - 100);

            const size = Phaser.Math.FloatBetween(2.0, 5.0);
            const alpha = Phaser.Math.FloatBetween(0.5, 0.8);
            const color = Phaser.Display.Color.GetColor(
                255,
                Phaser.Math.Between(230, 255),
                Phaser.Math.Between(100, 180)
            );

            const firefly = this.add.ellipse(x, y, size, size, color, alpha)
                .setBlendMode(Phaser.BlendModes.ADD)
                .setDepth(1000);

            this.fireflies.push({
                sprite: firefly,
                size,
                vx: Phaser.Math.FloatBetween(-0.3, 0.3),
                vy: Phaser.Math.FloatBetween(-0.3, 0.3),
                targetVX: Phaser.Math.FloatBetween(-0.5, 0.5),
                targetVY: Phaser.Math.FloatBetween(-0.5, 0.5),
                timer: Phaser.Math.Between(1000, 3000),
                lastChange: 0,
                pulseSpeed: Phaser.Math.FloatBetween(0.002, 0.008),
                scatterDistance: Phaser.Math.Between(80, 120),
                scatterStrength: Phaser.Math.FloatBetween(0.4, 1.6)
            });
        }
    }

    update(time, delta) {
        if (
            this.bunny.sprite.body.onFloor() &&
            Math.abs(this.bunny.sprite.body.velocity.x) > 100 &&
            Phaser.Math.Between(0, 6) === 0
        ) {
            const dust = this.add.graphics({
                x: this.bunny.sprite.x + 5,
                y: this.bunny.sprite.y + 55
            });
            dust.fillStyle(0x9d7b6f, 0.35);
            dust.fillEllipse(0, 0, 10, 6);
            this.dustGroup.add(dust);
            this.tweens.add({
                targets: dust,
                alpha: 0,
                y: '-+9',
                scaleX: 2.1,
                scaleY: 1.1,
                onComplete: () => dust.destroy()
            });
        }
        
        this.ground.setScrollFactor(0.60 + this.bunny.speed / 1000);
        this.bunny.update(time, delta);

        this.sky.tilePositionX += 0.25;

        const bx = this.bunny.sprite.x;
        const by = this.bunny.sprite.y;

        this.stillTimer = Math.abs(bx - this.previousBunnyX) > 1 ? 0 : this.stillTimer + delta;
        this.previousBunnyX = bx;

        this.fireflies.forEach(f => {
            const s = f.sprite;
            const dx = s.x - bx;
            const dy = s.y - by;
            const distance = Math.sqrt(dx * dx + dy * dy);

            f.vx = Phaser.Math.Linear(f.vx, f.targetVX, 0.01);
            f.vy = Phaser.Math.Linear(f.vy, f.targetVY, 0.01);

            const jitter = Phaser.Math.FloatBetween(-0.03, 0.03) * (4 - f.size);
            s.x += f.vx + jitter;
            s.y += f.vy + jitter;
            s.y = Phaser.Math.Clamp(s.y, -5, this.scale.height - 75);

            f.lastChange += delta;
            if (f.lastChange >= f.timer) {
                f.targetVX = Phaser.Math.FloatBetween(-0.5, 0.5);
                f.targetVY = Phaser.Math.FloatBetween(-0.5, 0.5);
                f.timer = Phaser.Math.Between(1000, 3000);
                f.lastChange = 0;
            }

            if (distance < f.scatterDistance) {
                const strength = (f.scatterDistance - distance) / f.scatterDistance;
                f.vx += (dx / distance) * f.scatterStrength * strength;
                f.vy += (dy / distance) * f.scatterStrength * strength;

                s.scaleX = 1.6;
                s.scaleY = 1.6;
                this.tweens.add({
                    targets: s,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 250,
                    ease: 'Quad.easeOut'
                });
            }

            if (distance < 200) {
                s.alpha = Phaser.Math.Clamp(s.alpha + 0.05, 0.6, 2.5);
                s.fillColor = Phaser.Display.Color.GetColor(255, 255, 100);
            } else {
                s.alpha = Phaser.Math.Clamp(s.alpha - 0.003, 0.5, 1);
                s.fillColor = Phaser.Display.Color.GetColor(255, 200, 100);
            }

            s.alpha += f.pulseSpeed * Phaser.Math.FloatBetween(0.2, 1.2);
            if (s.alpha > 1.2 || s.alpha < 0.5) f.pulseSpeed *= -1;
        });
    }
}
