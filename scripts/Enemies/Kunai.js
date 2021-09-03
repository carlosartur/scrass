import {
    Enemy
} from "./Enemy.js";

import {
    DIRECTIONS
} from "../Player.js";

import {
    intRandom
} from "../Helpers.js";

export class Kunai extends Enemy {

    /** @type {Boolean} */
    isReady = false;

    /** @type {String} */
    imagesPath = "/ninjaadventurenew/png";

    /** @type {Array} */
    tiles = {
        kunai: {
            kunai: `${this.enemiesImagesPath}${this.imagesPath}/Kunai.png`
        }
    };

    /** @type {Number} */
    horizontalVelocity = 200;

    /** @type {Number} */
    width = 12;

    /** @type {Number} */
    heigth = 60;

    currentGravity = 0;

    init() {
        return this;
    }

    /**
     * @abstract
     */
    configureSprites() {
        if (!this.game) {
            throw new Error('Must have game object to load image.');
        }

        this.enemySprite = this.game.physics.add.sprite(this.initialX, this.initialY, 'kunai');
        this.enemySprite.body.setAllowGravity(false);
        this.enemySprite.setAlpha(0);
        this.enemySprite.x = this.enemySprite.y = 100;
        this.enemySprite.setDisplaySize(this.width, this.heigth);
        return this;
    }

    /**
     * @method
     */
    move() {
        if (!this.isReady) {
            this.configureSprites();
            this.isReady = true;
        }
        
        this.enemySprite.setVelocityX(this.currentHorizontalVelocity);
        
        if (this.isOutOfStage) {
            this.disable();
        }
        this.slowDown();
    }

    /**
     * @method
     */
    slowDown() {
        let absVelocity = Math.abs(this.currentHorizontalVelocity),
            multiplier = this.currentHorizontalVelocity > 0 ? 1 : -1;
        
        absVelocity -= 0.2;
        
        this.currentHorizontalVelocity = absVelocity * multiplier;
        if (this.enemySprite?.body && absVelocity < 100) {
            if (absVelocity < 150) {
                this.currentGravity += 0.3;
            }

            this.enemySprite.setVelocityY(this.currentGravity);
        }
    }

    get isOutOfStage() {
        return this.enemySprite.x + this.heigth < 0
            || this.enemySprite.x - this.heigth > this.game.size;
    }

    /**
     * @abstract
     */
    touchPlayer() {
        let player = this.game.player;
        player.hurt();
        this.disable();
    }

    /**
     * @param {Ninja} ninja 
     */
    throwKunai(ninja) {
        if (!this.isReady) {
            this.configureSprites();
            this.isReady = true;
        }
        let multiplier = ninja.currentDirection === DIRECTIONS.RIGHT
            ? 1
            : -1;
        this.enemySprite.x = ninja.sprite.x + (50 * multiplier);
        this.enemySprite.y = ninja.sprite.y + 75;
        this.enemySprite.setAlpha(1);
        this.currentHorizontalVelocity = intRandom(this.horizontalVelocity, this.horizontalVelocity * 2) * multiplier;
        this.enemySprite.angle = 90 * multiplier;

        // Height and width is reversed due to angle of sprite.
        this.enemySprite.setSize(this.heigth * 2, this.width * 2);
        this.game.enemiesWithoutCollider.push(this);
    }

    disable() {
        this.enemySprite.destroy();
        this.destroyed = true;
    }
}