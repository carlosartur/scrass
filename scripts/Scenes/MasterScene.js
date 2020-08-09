import {
    enviroments,
    EnviromentSprites
} from "../EnviromentSprites.js";

import {
    Player
} from "../Player.js";

export class MasterScene extends Phaser.Scene {
    /**
     * @type {EnviromentSprites} enviromentSprites
     */
    enviromentSprites = null;

    /**
     * @type {Player} player
     */
    player = null;
    cursors = null;
    platforms = null;
    decoratives = null;
    crystals = null;
    scoreText = null;

    /**
     * @type {Object} 
     */
    sceneData = null;

    /**
     * @type {String}
     */
    enviroment = enviroments.DEFAULT;

    /**
     * @type {Number}
     */
    size = 0;

    /**
     * @type {Array}
     */
    enemiesSprites = [];

    /**
     * @type {Object}
     */
    checkpoint = null;

    /**
     * @param {EnviromentSprites} enviromentSprites 
     * @param {Player} player
     */
    constructor(enviromentSprites, player) {
        super('SceneMain');
        this.enviromentSprites = enviromentSprites;
        this.player = player;
    }

    /**
     * 
     */
    preload() {
        this.enviromentSprites.setGame(this)
            .setEnviroment(this.enviroment);

        this.player.setGame(this);
        let className = this.constructor.name.toLowerCase();
        this.load.json(className, `assets/json/${className}.json`);
    }

    /**
     * @method
     */
    create() {
        this.sceneData = this.cache.json.get(this.constructor.name.toLowerCase());
        this.createScene();
    }

    /**
     * @method
     */
    createScene() {
        let background = this.add.image(400, 350, 'sky');
        background.setScrollFactor(0.01);

        this.createPlatforms();
        this.createDecoratives();
        this.createCheckpoint();

        this.player.configureSprites();
        this.enemiesSprites = this.createEnemies();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.crystals = this.physics.add.group(this.sceneData.crystal);

        //camera
        this.cameras.main.setBounds(0, 0, this.size, 480);
        this.cameraDolly = new Phaser.Geom.Point(this.player.sprite.x, this.player.sprite.y);
        this.cameras.main.startFollow(this.cameraDolly);

        this.crystals.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.crystals, this.platforms);
        this.physics.add.collider(this.player.sprite, this.platforms);
        this.physics.add.overlap(this.checkpoint, this.player.sprite, this.player.checkpoint, null, this);

        this.enemiesSprites.forEach(enemySprite => {
            let sprite = enemySprite.sprite;
            this.physics.add.collider(sprite, this.platforms);
            this.physics.add.collider(sprite, this.player.sprite, enemySprite.touchPlayer);
            this.physics.add.overlap(this.player.sprite, sprite, enemySprite.touchPlayer, null, this);
        }, this);

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        this.player.setDisplay(this.scoreText);
        this.physics.add.overlap(this.player.sprite, this.crystals, this.player.collectCrystal, null, this);
    }

    /**
     * @method
     */
    createPlatforms() {
        throw new TypeError('Must implement "createPlatforms" on child class.');
    }

    /**
     * @method
     */
    createEnemies() {
        throw new TypeError('Must implement "createEnemies" on child class.');
    }

    /**
     * @method
     */
    createDecoratives() {
        throw new TypeError('Must implement "createDecoratives" on child class.');
    }

    /**
     * @method
     */
    createCheckpoint() {
        throw new TypeError('Must implement "crateCheckpoint" on child class.');
    }

    /**
     * @method
     */
    update() {
        //camera
        // this.cameraDolly.x = Math.floor(this.player.sprite.x);
        this.cameraDolly.x = this.player.cameraPositionX;
        this.cameraDolly.y = Math.floor(this.player.sprite.y);

        this.enemiesSprites.forEach(enemy => enemy.move());

        this.player.move(this.cursors);
    }
}