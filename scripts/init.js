import {
    EnviromentSprites,
    enviroments
} from './EnviromentSprites.js';

import {
    Player
} from './Player.js';

var enviromentSprites = new EnviromentSprites();
var player = new Player();

const init = {
    preload: function () {
        enviromentSprites.setGame(this)
            .setEnviroment();

        player.setGame(this);
    },
    create: function () {
        this.add.image(400, 350, 'sky');

        let platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground')
            .setScale(2)
            .refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        let playerSprite = player.configureSprites();

    },
    update: function () {},
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
    scene: {
        preload: init.preload,
        create: init.create
    }
};

var game = new Phaser.Game(config);