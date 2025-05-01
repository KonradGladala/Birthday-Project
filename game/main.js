
import { textureKeys } from './Animations/textureKeys.js';
import { handlePlayerMovement, resetJumpState, getJumpCount, setJumpCount, getStamina } from './playerMovement.js';
import { defineAnimations } from './Animations/animations.js';
import { MainMenu } from './Scenes/MainMenu.js';
import { World1 } from './Scenes/World1.js';
import { World2 } from './Scenes/World2.js';
import { LoadingScene } from './Scenes/LoadingScene.js';
import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

const config = {
    type: Phaser.AUTO,
    width: 1580,   // 16:9 aspect ratio (HD standard) 
    height: 500,   // 720p height
    parent: 'game-container',
    plugins: {
        scene: [
          {
            key: 'rexUI',
            plugin: RexUIPlugin,
            mapping: 'rexUI'
          }
        ]
      },
    backgroundColor: '#000000', // Black background
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2500 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,        // Important: fit inside container
        autoCenter: Phaser.Scale.CENTER_BOTH // Center horizontally and vertically
    },
    scene: [MainMenu, World1, World2]
};

console.log([MainMenu, World1, World2]);
const game = new Phaser.Game(config);

//LoadingScene