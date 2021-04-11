import {
    Enemy
} from "./Enemy.js";

import {
    DIRECTIONS
} from "../Player.js";

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
    horizontalVelocity = 30;

    /** @type {Number} */
    width = 15;

    /** @type {Number} */
    heigth = 75;

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
     * @abstract
     */
    move() {
        if (!this.isReady) {
            this.configureSprites();
            this.isReady = true;
        }
        // this.enemySprite.setSize(this.width, this.heigth);
        // this.enemySprite.setDisplaySize(this.width, this.heigth);
        
        this.enemySprite.setVelocityX(this.currentHorizontalVelocity);
    }

    /**
     * @abstract
     */
    touchPlayer() {
        throw new TypeError('Must implement "touchPlayer" on child class.');
    }

    /**
     * @param {Ninja} ninja 
     */
    throwKunai(ninja) {
        if (!this.isReady) {
            this.configureSprites();
            this.isReady = true;
        }
        let velocityMultiplier = ninja.currentDirection === DIRECTIONS.RIGHT
            ? 1
            : -1;
        this.enemySprite.x = ninja.sprite.x;
        this.enemySprite.y = ninja.sprite.y;
        this.enemySprite.setAlpha(1);
        this.currentHorizontalVelocity = this.horizontalVelocity * velocityMultiplier;
        this.enemySprite.angle = 90 * velocityMultiplier;
        this.enemySprite.setSize(this.heigth * 2, this.width * 2);

    }
}