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
    Scene2
} from './Scenes/Scene2.js';

import {
    StartScreenScene
} from './Scenes/StartScreenScene.js';

var enviromentSpritesDefault = new EnviromentSprites(),
    player = new Player(),
    startScreenScene = new StartScreenScene(),
    scene1 = new Scene1(enviromentSpritesDefault, player),
    scene2 = new Scene2(enviromentSpritesDefault, player);

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
    input: {
        gamepad: true
    },
    scene: [startScreenScene, scene1, scene2]
};

var game = new Phaser.Game(config);

window.myDebug = {
    startScreenScene,
    scene1,
    scene2,
    config,
    game,
    enviromentSpritesDefault,
    player
};