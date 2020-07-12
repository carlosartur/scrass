import {
    EnviromentSprites,
    enviroments
} from './EnviromentSprites.js';

import {
    Player
} from './Player.js';

import {
    intRandom
} from './Helpers.js'

var enviromentSprites = new EnviromentSprites(),
    player = new Player(),
    cursors, platforms, crystals, scoreText;

const scene = {
    preload: function () {
        enviromentSprites.setGame(this)
            .setEnviroment(enviroments.DESERT);

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
        platforms.create(750, 300, 'ground');

        player.configureSprites();

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(player.sprite, platforms);

        crystals = this.physics.add.group({
            key: 'crystal',
            repeat: intRandom(10, 60),
            setXY: {
                x: 12,
                y: 0,
                stepX: 70
            }
        });

        //camera
        this.cameras.main.setBounds(0, 0, 14400, 480);
        this.cameraDolly = new Phaser.Geom.Point(player.sprite.x, player.sprite.y);
        this.cameras.main.startFollow(this.cameraDolly);

        crystals.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(crystals, platforms);

        scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000'
        });

        player.setDisplay(scoreText);

        this.physics.add.overlap(player.sprite, crystals, player.collectCrystal, null, this);
    },
    update: function () {
        //camera
        this.cameraDolly.x = Math.floor(player.sprite.x);
        this.cameraDolly.y = Math.floor(player.sprite.y);

        player.move(cursors);
    }
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