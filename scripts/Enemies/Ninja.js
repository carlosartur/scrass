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

import {
    Kunai
} from './Kunai.js';
export class Ninja extends Enemy {

    /** @type {String[]} */
    statusNotUsed = [states.WALK];

    /** @type {String} */
    imagesPath = "/ninjaadventurenew/png";

    /** @type {Object} */
    exclusiveStates = {
        ATTACK: 'Attack',
        CLIMB: 'Climb',
        GLIDE: 'Glide',
        JUMP_ATTACK: 'Jump_Attack',
        SLIDE: 'Slide',
        THROW: 'Throw',
    }

    /** @type {MasterScene} */
    game = null;

    /** @type {Number} */
    horizontalVelocity = 120;

    /** @type {Number} */
    currentHorizontalVelocity = 120;

    /** @type {Number} */
    width = 250;

    /** @type {Number} */
    initialX = 300;
    
    /** @type {String} */
    currentAnimation = null;

    /** @type {Number} */
    deadDestroyCountdown = Enemy.INIT_DEAD_DESTROY_COUNTDOWN;
    
    /** @type {Kunai} */
    kunai = null;

    /** @type {String} */
    currentDirection = DIRECTIONS.LEFT;
    
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
     * @method
     */
    init() {
        super.init();
        this.randomCurrentMovimentSize;
        this.generateTiles();
    }

    /**
     * @method
     */
    getGame() {
        return this.game;
    }

    setGame(game) {
        super.setGame(game);
        this.kunai = (new Kunai())
            .setGame(this.game);
        return this;
    }

    /**
     * @method
     */
    generateTiles() {
        if (this.imagesLoaded) {
            return this;
        }
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

    /**
     * @method
     */
    configureSprites() {
        this.enemySprite = this.game.physics.add.sprite(this.initialX, this.initialY, 'ninja_idle0');

        this.sprite.displayWidth = 60;
        this.sprite.displayHeight = 110;

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
        if (this.currentAnimation === animationState) {
            return;
        }
        let key = this.getAnimationKey(animationState);
        let anims = this.sprite.anims;
        anims.play(key);
        this.currentAnimation = animationState;
    }

    /**
     * @method
     */
    move() {
        if (
            (!this.sprite.body.enable)
            && this.deadDestroyCountdown <= 0
        ) {
            this.destroyed = true;
            this.sprite.destroy();
            return;
        }

        if (this.isDead) {
            this.playDeadAnimation();
            return;
        }
        
        let isFirstGroundTouch = false,
            movimentOver = this.isMovimentOver;
        this.currentMovimentSize--;

        if ((!this.alreadyTouchGround) && this.sprite.body.touching.down) {
            isFirstGroundTouch = true;
            this.alreadyTouchGround = true;
        }

        if (!this.alreadyTouchGround) {
            this.sprite.setVelocityX(0);
            return;
        }

        if ((!movimentOver) && this.isAttacking) {
            return;
        }

        if (movimentOver && this.tryToAttack()) {
            return;
        }
        
        if (this.sprite.body.touching.down) {
            this.playAnimation(this.exclusiveStates.RUN);
        }

        let touchingLeft = (this.sprite.x < 0) || this.sprite.body.touching.left,
            touchingRight = (this.sprite.x > this.game.size) || this.sprite.body.touching.right;

        if (movimentOver || touchingLeft || touchingRight || isFirstGroundTouch) {
            let choosedDirection = this.chooseDirection(touchingLeft, touchingRight);
            this.configureMovimentDirection(choosedDirection);
        }

        this.sprite.setVelocityX(this.currentHorizontalVelocity);
    }

    /** @method */
    playDeadAnimation() {
        if (!this.deadAnimationPlayed) {
            this.playAnimation(states.DEAD);
            this.deadAnimationPlayed = true;
        }
        this.sprite.setVelocityX(0);
        this.sprite.z = false;

        if (this.sprite.body.touching.down) {
            this.sprite.body.enable = false;
        }
        
        this.deadDestroyCountdown--;
        this.sprite.setAlpha(this.deadDestroyCountdown / Enemy.INIT_DEAD_DESTROY_COUNTDOWN);
    }
    
    /**
     * @returns {Boolean} true if ninja will attack, false if not
     */
    tryToAttack() {
        this.isAttacking = false;

        if (!this.sprite.body.touching.down) {
            return false;
        }

        let distanceToPlayer = Phaser.Math.Distance.Between(this.game.player.sprite.x, this.game.player.sprite.y, this.sprite.x, this.sprite.y),
            attackRatio = intRandom();
            
        if (distanceToPlayer < 300 && !(attackRatio % 2)) {
            this.attack();
            return true;
        }

        let attackFrequency = distanceToPlayer < 1000 ? 7 : 3;
        if (!(attackRatio % attackFrequency)) {
            this.throwKunai();
            return true;
        }
        return false;
    }

    attack() {
        this.isAttacking = true;
        this.sprite.setVelocityX(0);
        this.playAnimation(this.exclusiveStates.ATTACK);
        this.currentMovimentSize = 30;
    }
    
    /**
     * @returns {Boolean}
     */
    throwKunai() {
        this.isAttacking = true;
        this.sprite.setVelocityX(0);
        this.playAnimation(this.exclusiveStates.THROW);
        this.currentMovimentSize = 30;
        
        /** @type {Kunai} */
        let newKunai = this.kunai.clone();
        this.game.enemiesSprites.push(newKunai);
        newKunai.throwKunai(this);
    }
    
    /**
     * @method
     * Choose the direction of running or jumping.
     * 
     * @param {Boolean} touchingLeft 
     * @param {Boolean} touchingRight 
     */
    chooseDirection(touchingLeft, touchingRight) {
        if (Phaser.Math.Distance.Between(this.game.player.sprite.x, this.game.player.sprite.y, this.sprite.x, this.sprite.y) < 1000) {
            if (this.sprite.x > this.game.player.sprite.x) {
                if (touchingLeft) {
                    return DIRECTIONS.UP;
                }
                return DIRECTIONS.LEFT;
            }
            
            if (this.sprite.x < this.game.player.sprite.x) {
                if (touchingRight) {
                    return DIRECTIONS.UP;
                }
                return DIRECTIONS.RIGHT;
            }
        }

        let possibleDirections = [DIRECTIONS.LEFT, DIRECTIONS.RIGHT, DIRECTIONS.UP],
            choosedDirection = possibleDirections[intRandom() % possibleDirections.length];

        if (touchingLeft) {
            possibleDirections = [DIRECTIONS.RIGHT, DIRECTIONS.UP],
            choosedDirection = possibleDirections[intRandom() % possibleDirections.length];
        }

        if (touchingRight) {
            possibleDirections = [DIRECTIONS.LEFT, DIRECTIONS.UP],
            choosedDirection = possibleDirections[intRandom() % possibleDirections.length];
        }
        return choosedDirection;
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
        this.playAnimation(this.exclusiveStates.RUN);
        
        if (choosedDirection === DIRECTIONS.UP) {
            this.jump();
        }
    }

    /**
     * @method
     */
    runLeft() {
        this.currentHorizontalVelocity = this.horizontalVelocity * -1;
        this.sprite.setFlipX(true);
        this.sprite.setOffset(50, 50);
        this.currentDirection = DIRECTIONS.LEFT;
    }

    /**
     * @method
     */
    runRight() {
        this.currentHorizontalVelocity = this.horizontalVelocity;
        this.sprite.setFlipX(false);
        this.sprite.setOffset(100, 50);
        this.currentDirection = DIRECTIONS.RIGHT;
    }

    /**
     * @method
     */
    jump() {
        this.sprite.setVelocityY(-400);
        this.playAnimation(this.exclusiveStates.JUMP);
    }

    /**
     * @method
     */
    touchPlayer() {
        if (this.isDead) {
            return false;
        }

        let player = this.game.player,
            jumpOnHead = this.sprite.body.top + 50 >= player.sprite.body.bottom;
        
        if (jumpOnHead && !this.isAttacking) {
            player.jump();
            this.hurt();
            return;
        }
        player.hurt();
    }

    /**
     * @method
     */
    hurt() {
        this.game.player.score += 100;
        this.life -= 10;
    }
}