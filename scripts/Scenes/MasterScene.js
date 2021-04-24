import {
    enviroments,
    EnviromentSprites
} from "../EnviromentSprites.js";

import {
    Player
} from "../Player.js";

export class MasterScene extends Phaser.Scene {
    /** @type {EnviromentSprites} */
    enviromentSprites = null;

    /** @type {Player} */
    player = null;

    /** @type {Object} */
    cursors = null;

    /** @type {StaticPhysicsGroup} */
    platforms = null;

    /** @type {StaticPhysicsGroup} */
    decoratives = null;

    /** @type {StaticPhysicsGroup} */
    fluidGround = null;

    /** @type {PhysicsGroup} */
    crystals = null;

    /** @type {Text} */
    scoreText = null;

    /** @type {Text} */
    pausedText = null;

    /** @type {Number} */
    pausedDelay = 0;

    /** @type {Boolean} */
    paused = false;

    /** @type {Object} */
    sceneData = null;

    /** @type {String} */
    enviroment = enviroments.DEFAULT;

    /** @type {Number} */
    size = 0;

    /** @type {Array} */
    enemiesSprites = [];

    /** @type {Object} */
    checkpoint = null;

    /** @type {Object} */
    endOfStage = null;

    /** @type {Boolean} */
    created = false;

    /** @type {Boolean} */
    gamepadAlreadyDetected = false;

    /** @type {Gamepad} */
    gamePad = null;

    /** @type {Enemy[]} */
    enemiesWithoutCollider = [];

    /**
     * @param {EnviromentSprites} enviromentSprites 
     * @param {Player} player
     */
    constructor(enviromentSprites, player, sceneName) {
        super(sceneName);
        this.enviromentSprites = enviromentSprites;
        this.player = player;
    }

    /**
     * @method
     */
    preload() {
        let className = this.constructor.name.toLowerCase();
        this.enviromentSprites.setGame(this)
            .setEnviroment(this.enviroment);
        this.player.setGame(this);
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
        if (this.created) {
            return;
        }
        this.created = true;

        let background = this.add.tileSprite(0, 250, this.size, 600, 'sky');
        background.setScrollFactor(0.05);

        this.createPlatforms();
        this.createDecoratives();
        this.createCheckpoint();
        this.crateFluidGround();
        this.createEndStage();

        this.player.configureSprites();
        this.enemiesSprites = this.createEnemies();

        this.cursors = this.input.keyboard.addKeys({
            up: 'up',
            down: 'down',
            left: 'left',
            right: 'right',
            shift: 'shift',
            space: 'space',
            z: 'z',
            x: 'x',
            p: 'p',
        });

        //camera
        this.cameras.main.setBounds(0, 0, this.size, 480);
        this.cameraDolly = new Phaser.Geom.Point(this.player.sprite.x, this.player.sprite.y);
        this.cameras.main.startFollow(this.cameraDolly);

        this.crystals = this.physics.add.group(this.sceneData.crystal);
        this.game.anims.create({
            key: 'crystal',
            frames: this.game.anims.generateFrameNumbers('crystal', {
                start: 0,
                end: 9
            }),
            frameRate: 10,
            repeat: -1
        });

        this.crystals.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.5));
            child.anims.play('crystal', true);
        });

        this.physics.add.collider(this.crystals, this.platforms);
        this.physics.add.collider(this.player.sprite, this.platforms);
        this.physics.add.overlap(this.checkpoint, this.player.sprite, this.player.checkpoint, null, this);
        this.physics.add.overlap(this.fluidGround, this.player.sprite, this.player.instantDie, null, this);
        this.physics.add.overlap(this.endOfStage, this.player.sprite, (() => {
            this.callNextStage();
        }).bind(this), null, this);

        this.enemiesSprites.forEach(enemySprite => {
            let sprite = enemySprite.sprite,
                colliderCallback = () => {
                    try {
                        enemySprite.touchPlayer();
                    } catch (error) {
                        console.error();
                    }
                };
            this.physics.add.collider(sprite, this.platforms);
            this.physics.add.collider(sprite, this.player.sprite, colliderCallback);
            this.physics.add.overlap(sprite, this.player.sprite, colliderCallback);
        }, this);

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        this.player.setDisplay(this.scoreText);
        this.physics.add.overlap(this.player.sprite, this.crystals, this.player.collectCrystal, null, this);

        this.pausedText = this.add.text(160, 80, 'Paused', {
            fontSize: '100px',
            fill: '#000'
        });
        this.pausedText.setVisible(false);
    }

    /**
     * @method
     */
    update() {
        if (
            !this.gamepadAlreadyDetected &&
            this.input.gamepad &&
            this.input.gamepad.pad1
        ) {
            this.gamePad = this.input.gamepad.pad1;
        }

        //camera
        this.cameraDolly.x = this.player.cameraPositionX;
        this.cameraDolly.y = Math.floor(this.player.sprite.y);
        this.updatePauseDelay();

        if (this.cursors.p.isDown) {
            this.togglePause();
        }

        if (this.gamepadAlreadyDetected) {
            let buttons = this.gamePad.buttons,
                startButton = buttons[9];

            if (startButton && startButton.value) {
                this.togglePause();
            }
        }


        /** @type {Enemy} */
        let enemyWithoutCollider = null;
        while (enemyWithoutCollider = this.enemiesWithoutCollider.pop()) {
            let sprite = enemyWithoutCollider.enemySprite;
            
            this.physics.add.collider(sprite, this.player.sprite, enemyWithoutCollider.touchPlayer.bind(enemyWithoutCollider));
            this.physics.add.overlap(sprite, this.player.sprite, enemyWithoutCollider.touchPlayer.bind(enemyWithoutCollider));
        }

        this.enemiesSprites.forEach((enemy, index) => {
            if (enemy.destroyed) {
                delete this.enemiesSprites[index];
            }
        });

        this.enemiesSprites = this.enemiesSprites.filter(item => !!item);
        this.enemiesSprites.forEach(enemy => enemy.move());
        this.player.move(this.cursors);
    }

    /**
     * @method
     */
    updatePauseDelay() {
        if (this.pausedDelay < 0) {
            this.pausedDelay = 0;
            return;
        }

        if (this.pausedDelay == 0) {
            return;
        }

        this.pausedDelay--;
    }

    /**
     * @method
     */
    togglePause() {
        if (this.pausedDelay > 0) {
            return;
        }
        let pausedTextX = this.cameraDolly.x - 240 < 0 ? 240 : this.cameraDolly.x - 240;
        this.paused = !this.paused;
        this.pausedText.setVisible(this.paused);
        this.pausedText.setX(pausedTextX);
        this.pausedText.setZ(0);
        this.pausedDelay = 25;
        this.pauseAction();
    }

    /**
     * @method
     */
    pauseAction() {
        if (this.paused) {
            this.physics.pause();
            this.enemiesSprites.forEach(enemy => enemy.sprite.anims.stop(null, false));
            this.player.sprite.anims.stop(null, false);
            return;
        }
        this.enemiesSprites.forEach(enemy => enemy.move());
        this.physics.resume();
        this.player.sprite.anims.resume();
        return;
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
    crateFluidGround() {
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
    createEndStage() {
        throw new TypeError('Must implement "createEndStage" on child class.');
    }

    /**
     * @method
     */
    callNextStage() {
        throw new TypeError('Must implement "callNextStage" on child class.');
    }
}