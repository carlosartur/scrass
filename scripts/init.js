import {
    EnviromentSprites,
} from './EnviromentSprites.js';

import {
    Player
} from './Player.js';

import {
    Scene1
} from './Scenes/Scene1.js';

import {
    StartScreenScene
} from './Scenes/StartScreenScene.js';

var enviromentSprites = new EnviromentSprites(),
    player = new Player(),
    startScreenScene = new StartScreenScene(),
    scene1 = new Scene1(enviromentSprites, player);

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 500,
                default: false
            }
        }
    },
    scene: [startScreenScene, scene1]
};

var game = new Phaser.Game(config);

window.myDebug = {
    startScreenScene,
    scene1,
    config,
    game,
    enviromentSprites,
    player
};