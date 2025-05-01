import Phaser from 'phaser';

export class LoadingScene extends Phaser.Scene {
    constructor() {
        super('LoadingScene');
        this.dotIndex = 0;
    }

    preload() {
        console.log('Loading LoadingScene...');
        this.load.bitmapFont('minecraft', 'assets/fonts/Pixel.png', 'assets/fonts/Pixel.fnt');
    }

    create() {
        this.symbols = [];
        const { width, height } = this.scale;

        this.add.rectangle(0, 0, width, height, 0xffffff).setOrigin(0);

        this.createFloatingDots(80, width, height);
        this.createFloatySymbols(320, width, height);

        const barWidth = 400;
        const barHeight = 30;
        const barX = (width - barWidth) / 2;
        const barY = height / 2 - barHeight / 2;

        this.add.rectangle(barX - 1, barY - 1, barWidth + 2, barHeight + 2, 0x666666).setOrigin(0);
        this.add.rectangle(barX, barY, barWidth, barHeight, 0xbbbbbb).setOrigin(0);

        const loadingText = this.add.bitmapText(width / 2, barY - 18, 'minecraft', 'L O A D I N G', 24)
            .setOrigin(0.5)
            .setTint(0x000000)
            .setAlpha(1);

        const dotsTextShadow = this.add.bitmapText(width / 2 + loadingText.width / 2 + 5, loadingText.y, 'minecraft', '.', 24)
            .setOrigin(0, 0.5)
            .setTintFill(0x666666);

        const dotsText = this.add.bitmapText(width / 2 + loadingText.width / 2 + 5, loadingText.y, 'minecraft', '.', 24)
            .setOrigin(0, 0.5)
            .setTint(0x000000)
            .setAlpha(1);

        this.time.addEvent({
            delay: 400,
            loop: true,
            callback: () => {
                this.dotIndex = (this.dotIndex + 1) % 4;
                const dots = '. '.repeat(this.dotIndex);
                dotsText.setText(dots);
                dotsTextShadow.setText(dots);
            }
        });

        this.tweens.add({
            targets: loadingText,
            alpha: { from: 1, to: 0.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: [dotsText, dotsTextShadow],
            alpha: { from: 1, to: 0.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const segmentCount = 20;
        const spacing = 2;
        const totalSpacing = spacing * (segmentCount - 1);
        const segmentWidth = Math.floor((barWidth - totalSpacing) / segmentCount);
        const extraPixels = (barWidth - totalSpacing) % segmentCount;
        const progressSegments = [];

        let totalDelay = 0;
        const totalTime = 20000; // 20 seconds
        const delayPerSegment = totalTime / segmentCount;

        for (let i = 0; i < segmentCount; i++) {
            const adjustedWidth = segmentWidth + (i < extraPixels ? 1 : 0);
            const xOffset = i * (segmentWidth + spacing) + Math.min(i, extraPixels);
            const x = barX + xOffset;

            const segment = this.add.rectangle(x, barY, adjustedWidth, barHeight, 0x000000).setOrigin(0, 0).setAlpha(0);
            progressSegments.push(segment);

            totalDelay += delayPerSegment;
            this.time.delayedCall(totalDelay, () => segment.setAlpha(1));
        }

        this.time.delayedCall(totalTime + 500, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.time.delayedCall(1050, () => {
                this.scene.start('MainMenu');
                this.symbols.forEach(s => s.destroy());
            });
        });
    }

    createFloatingDots(count, width, height) {
        for (let i = 0; i < count; i++) {
            const dot = this.add.rectangle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(2, 4),
                Phaser.Math.Between(2, 4),
                0x000000
            ).setAlpha(Phaser.Math.FloatBetween(0.3, 0.6));

            this.tweens.add({
                targets: dot,
                y: dot.y + Phaser.Math.Between(-20, 20),
                x: dot.x + Phaser.Math.Between(-20, 20),
                duration: Phaser.Math.Between(3000, 6000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createFloatySymbols(count, width, height) {
        for (let i = 0; i < count; i++) {
            const symbol = this.add.bitmapText(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                'minecraft',
                Phaser.Math.RND.pick(['*', '+', '~', 'x', '#', '@', '%', '^', ':', ';']),
                8
            ).setAlpha(Phaser.Math.FloatBetween(0.1, 0.3)).setTint(0x000000);

            this.symbols.push(symbol);

            this.tweens.add({
                targets: symbol,
                x: symbol.x + Phaser.Math.Between(-30, 30),
                y: symbol.y + Phaser.Math.Between(-20, 20),
                alpha: { from: 0.1, to: 0.6 },
                duration: Phaser.Math.Between(4000, 6000),
                yoyo: true,
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000),
                ease: 'Sine.easeInOut'
            });
        }
    }
}
