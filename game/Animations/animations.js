export function defineAnimations(scene) {
    // Define the "idle" animation
    scene.anims.create({
        key: 'idle',
        frames: scene.anims.generateFrameNumbers('bunny_idle', { start: 0, end: 11 }),
        frameRate: 6,
        repeat: -1 // Looping
    });

    // Define the "run" animation
    scene.anims.create({
        key: 'run',
        frames: scene.anims.generateFrameNumbers('bunny_run', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1 // Looping
    });

    // Define the "jump" animation
    scene.anims.create({
        key: 'jump',
        frames: scene.anims.generateFrameNumbers('bunny_jump', { start: 0, end: 10 }),
        frameRate: 11,
        repeat: 0 // No looping
    });

    // Define the "lieDown" animation
    scene.anims.create({
        key: 'lieDown',
        frames: scene.anims.generateFrameNumbers('bunny_lieDown', { start: 0, end: 5 }),
        frameRate: 6,
        repeat: 0 // Looping
    });

    // Define the "attackScratch" animation
    scene.anims.create({
        key: 'attackScratch',
        frames: scene.anims.generateFrameNumbers('bunny_attackScratch', { start: 0, end: 7 }),
        frameRate: 16,
        repeat: 0 // No looping
    });
}