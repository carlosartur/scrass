import {
    Enemy
} from "./Enemy.js";
import {
    range,
    intRandom
} from "../Helpers.js";
import {
    states,
    DIRECTIONS
} from "../Player.js";
import {
    MasterScene
} from "../Scenes/MasterScene.js";

let ninjas = {};

export class Ninja extends Enemy {

    /**
     * @type {String[]}
     */
    statusNotUsed = [states.WALK];

    /**
     * @type {String}
     */
    imagesPath = "/ninjaadventurenew/png";

    /**
     * @type {Object}
     */
    exclusiveStates = {
        ATTACK: 'Attack',
        CLIMB: 'Climb',
        GLIDE: 'Glide',
        JUMP_ATTACK: 'Jump_Attack',
        SLIDE: 'Slide',
        THROW: 'Throw',
    }

    /**
     * @type {MasterScene}
     */
    game = null;

    /**
     * @type {Number}
     */
    horizontalVelocity = 120;

    /**
     * @type {Number}
     */
    currentHorizontalVelocity = 120;

    /**
     * @type {Number}
     */
    width = 250;

    /**
     * @type {Number}
     */
    initialX = 300;

    /**
     * @type {Number}
     */
    id = 0;

    /**
     * @param {Object} config 
     */
    constructor(config, game = null) {
        super(config);
        Object.assign(this.exclusiveStates, this.enemyStates);
        if (game) {
            this.setGame(game);
        }
        this.init();
    }

    /**
     * 
     */
    generateId() {
        while (!this.id || ninjas[this.id]) {
            this.id = intRandom(1, 1000);
        }
        ninjas[this.id] = this;
    }

    /**
     * @method
     */
    init() {
        super.init();
        this.generateTiles();
    }

    /**
     * @method
     */
    getGame() {
        return this.game;
    }

    /**
     * @method
     */
    generateTiles() {
        if (!this.imagesLoaded) {
            let imagesArray = range(0, 9);
            for (let state in this.exclusiveStates) {
                const imageFrames = this.exclusiveStates[state];
                if (this.statusNotUsed.includes(imageFrames)) {
                    continue;
                }
                imagesArray.map(item => {
                    const imageAnimationKey = this.getAnimationKey(imageFrames);
                    this.tiles[imageAnimationKey] = this.tiles[imageAnimationKey] || {};
                    this.tiles[imageAnimationKey][`${imageAnimationKey}${item}`] = `${this.enemiesImagesPath}${this.imagesPath}/${imageFrames}_00${item}.png`;
                }, this);
            }
            this.imagesLoaded = true;
        }
        return this;
    }

    /**
     * @method
     */
    configureSprites() {
        this.enemySprite = this.game.physics.add.sprite(this.initialX, this.initialY, 'ninja_idle0');

        this.sprite.displayWidth = 60;
        this.sprite.displayHeight = 110;

        this.generateId();
        this.sprite.ownerId = this.id;

        this.sprite.setBounce(0.2);
        this.createAnims();
        this.playAnimation();
        this.sprite.setSize(this.width, this.heigth);
        return this;
    }

    /**
     * @returns {Ninja}
     */
    createAnims() {
        if (this.animsCreated) {
            return this;
        }
        for (let state in this.tiles) {
            const imageFrames = this.tiles[state];
            const frames = Object.keys(imageFrames).map(key => ({
                key
            }));
            let repeat = -1;
            if ([this.getAnimationKey(states.DEAD), this.getAnimationKey(states.JUMP)].includes(state)) {
                repeat = 0;
            }
            const animConfig = {
                key: state,
                frames,
                frameRate: 10,
                repeat
            };
            this.game.anims.create(animConfig);
        }
        this.animsCreated = true;
        return this;
    }

    /**
     * @method
     */
    get sprite() {
        return this.enemySprite;
    }

    /**
     * @param {String} animationState 
     */
    playAnimation(animationState = states.IDLE) {
        let key = this.getAnimationKey(animationState);
        let anims = this.sprite.anims;
        anims.play(key);
    }

    /**
     * @method
     */
    move() {
        let isFirstGroundTouch = false;
        if ((!this.alreadyTouchGround) && this.sprite.body.touching.down) {
            isFirstGroundTouch = true;
            this.alreadyTouchGround = true;
        }

        if (!this.alreadyTouchGround) {
            this.sprite.setVelocityX(0);
            return;
        }

        if (this.isDead) {
            if (!this.deadAnimationPlayed) {
                this.playAnimation(states.DEAD);
                this.deadAnimationPlayed = true;
            }
            this.sprite.setVelocityX(0);
            this.sprite.body.enable = false;
            this.sprite.z = false;

            return;
        }

        let touchingLeft = (this.sprite.x < 0) || this.sprite.body.touching.left;
        let touchingRight = (this.sprite.x > this.game.size) || this.sprite.body.touching.right;

        if (this.isMovimentOver || touchingLeft || touchingRight || isFirstGroundTouch) {
            let possibleDirections = [DIRECTIONS.LEFT, DIRECTIONS.RIGHT, DIRECTIONS.UP],
                choosedDirection = possibleDirections[intRandom() % possibleDirections.length];

            if (touchingLeft) {
                choosedDirection = DIRECTIONS.RIGHT;
            }

            if (touchingRight) {
                choosedDirection = DIRECTIONS.LEFT;
            }
            this.configureMovimentDirection(choosedDirection);
        }

        this.sprite.setVelocityX(this.currentHorizontalVelocity);
        this.currentMovimentSize--;
    }

    /**
     * @param {DIRECTIONS} choosedDirection 
     */
    configureMovimentDirection(choosedDirection) {
        if (choosedDirection === DIRECTIONS.LEFT) {
            this.runLeft();
        }

        if (choosedDirection === DIRECTIONS.RIGHT) {
            this.runRight();
        }
        this.playAnimation(this.exclusiveStates.RUN)
    }

    /**
     * @method
     */
    runLeft() {
        this.currentHorizontalVelocity = this.horizontalVelocity * -1;
        this.sprite.setFlipX(true);
        this.sprite.setOffset(50, 50);
    }

    /**
     * @method
     */
    runRight() {
        this.currentHorizontalVelocity = this.horizontalVelocity;
        this.sprite.setFlipX(false);
        this.sprite.setOffset(100, 50);
    }

    /**
     * @method
     */
    touchPlayer(ninja, playerSprite) {
        let selfId = ninja.ownerId,
            self = ninjas[selfId];

        if (self.isDead) {
            return false;
        }

        let player = self.game.player,
            jumpOnHead = self.sprite.body.touching.up && player.sprite.body.touching.down;
        if (jumpOnHead) {
            player.jump();
            self.hurt();
            return;
        }
        player.hurt();
    }

    /**
     * @method
     */
    hurt() {
        this.life -= 10;
    }
}