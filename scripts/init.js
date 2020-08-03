import {
    EnviromentSprites,
} from './EnviromentSprites.js';

import {
    Player
} from './Player.js';

import {
    Scene1
} from './Scenes/Scene1.js';

var enviromentSprites = new EnviromentSprites(),
    player = new Player();

var scene = new Scene1(enviromentSprites, player);

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            gravity: {
                y: 500,
                default: false
            }
        }
    },
    scene
};

var game = new Phaser.Game(config);

window.myDebug = {
    scene,
    config,
    game,
    enviromentSprites,
    player
};