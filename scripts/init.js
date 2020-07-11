import {
    EnviromentSprites,
    enviroments
} from './EnviromentSprites.js';

import {
    Player
} from './Player.js';

var enviromentSprites = new EnviromentSprites(),
    player = new Player(),
    cursors, platforms, playerSprite;

const scene = {
    preload: function () {
        enviromentSprites.setGame(this)
            .setEnviroment();

        player.setGame(this);
    },
    create: function () {
        this.add.image(400, 350, 'sky');

        platforms = this.physics.add.staticGroup();


        for (var i = 60; i <= 1000; i += 128) {
            platforms.create(i, 540, 'ground');
        }

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        playerSprite = player.configureSprites();

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(playerSprite, platforms);

    },
    update: function () {
        player.move(cursors);
    },
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 500,
                default: false
            }
        }
    },
    scene
};

var game = new Phaser.Game(config);

console.log({
    scene,
    config,
    game,
    enviromentSprites,
    player,
    platforms
})