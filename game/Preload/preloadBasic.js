export function preloadBasic(scene) {
    // Load the sprite sheet for "idle"
    scene.load.spritesheet('bunny_idle', 'assets/playerSprites/Idle.png', {
        frameWidth: 32, // Replace with the width of each frame
        frameHeight: 32, // Replace with the height of each frame
    });

    // Load the sprite sheet for "run"
    scene.load.spritesheet('bunny_run', 'assets/playerSprites/Running.png', {
        frameWidth: 32, // Replace with the width of each frame
        frameHeight: 32, // Replace with the height of each frame
    });

    // Load the sprite sheet for "jump"
    scene.load.spritesheet('bunny_jump', 'assets/playerSprites/Jumping.png', {
        frameWidth: 32, // Replace with the width of each frame
        frameHeight: 32, // Replace with the height of each frame
    });

    // Load the sprite sheet for "lie down"
    scene.load.spritesheet('bunny_lieDown', 'assets/playerSprites/LieDown.png', {
        frameWidth: 32,
        frameHeight: 32
    });

    // Load the sprite sheet for 'AttackScratch'
    scene.load.spritesheet('bunny_attackScratch', 'assets/playerSprites/AttackScratch.png', {
        frameWidth: 32,
        frameHeight: 32
    });

    // Load the ground image
    scene.load.image('ta1', 'assets/test/ta1.png'); // Replace with the path to your ground image




    //===========================================================================================

    // Apply texture filtering after loading is complete
    scene.load.on('complete', () => {
        // Set texture filtering mode to NEAREST for bunny animations
        scene.textures.get('bunny_idle').setFilter(Phaser.Textures.FilterMode.NEAREST);
        scene.textures.get('bunny_lieDown').setFilter(Phaser.Textures.FilterMode.NEAREST);
        scene.textures.get('bunny_run').setFilter(Phaser.Textures.FilterMode.NEAREST);
        scene.textures.get('bunny_jump').setFilter(Phaser.Textures.FilterMode.NEAREST);
        scene.textures.get('bunny_attackScratch').setFilter(Phaser.Textures.FilterMode.NEAREST);
    });
}