import {
    enviroments,
    EnviromentSprites
} from "../EnviromentSprites.js";

import {
    Player
} from "../Player.js";
import {
    intRandom
} from "../Helpers.js";

export class MasterScene extends Phaser.Scene {
    /**
     * @attr {EnviromentSprites} enviromentSprites
     */
    enviromentSprites = null;

    /**
     * @attr {Player} player
     */
    player = null;
    cursors = null;
    platforms = null;
    crystals = null;
    scoreText = null;
    enviroment = enviroments.DEFAULT;
    size = 0;

    /**
     * @param {EnviromentSprites} enviromentSprites 
     * @param {Player} player
     */
    constructor(enviromentSprites, player) {
        super('SceneMain');
        this.enviromentSprites = enviromentSprites;
        this.player = player;
    }

    preload() {
        this.enviromentSprites.setGame(this)
            .setEnviroment(this.enviroment);

        this.player.setGame(this);
    }

    create() {
        this.createScene();
    }

    createScene() {
        this.size = this.game.config.width * 100;
        let background = this.add.image(400, 350, 'sky');
        background.setScrollFactor(0.01);

        this.createPlatforms();

        this.player.configureSprites();
        this.cursors = this.input.keyboard.createCursorKeys();
        this.crystals = this.physics.add.group({
            key: 'crystal',
            repeat: intRandom(10, 60),
            setXY: {
                x: 12,
                y: 0,
                stepX: 70
            }
        });

        //camera
        this.cameras.main.setBounds(0, 0, this.size, 480);
        this.cameraDolly = new Phaser.Geom.Point(this.player.sprite.x, this.player.sprite.y);
        this.cameras.main.startFollow(this.cameraDolly);

        this.crystals.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.crystals, this.platforms);
        this.physics.add.collider(this.player.sprite, this.platforms)

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        this.player.setDisplay(this.scoreText);
        this.physics.add.overlap(this.player.sprite, this.crystals, this.player.collectCrystal, null, this);
    }

    createPlatforms() {}

    count = 0;

    update() {

        // //camera
        this.cameraDolly.x = Math.floor(this.player.sprite.x);
        this.cameraDolly.y = Math.floor(this.player.sprite.y);

        this.player.move(this.cursors);
    }
}