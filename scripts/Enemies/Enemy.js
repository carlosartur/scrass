import {
    states
} from "../Player.js";
import {
    Clonable
} from "../Clonable.js";
import {
    Scene1
} from "../Scenes/Scene1.js";
import { intRandom } from "../Helpers.js";

export class Enemy extends Clonable {
    /** @type {Number} */
    life = 10;

    /** @type {Number} */
    width = 100;

    /** @type {Number} */
    heigth = 400;

    /** @type {String} */
    enemiesImagesPath = "assets/images/sprites";

    /** @type {String} */
    imagesPath = "";

    /** @type {Object} */
    enemyStates = states;

    /** @type {Object} */
    exclusiveStates = {};

    /** @type {Object} */
    enemySprite = null

    /** @type {Object} */
    tiles = {};

    /** @type {Boolean} */
    imagesLoaded = false;

    /** @type {Boolean} */
    animsCreated = false;

    /** @type {Boolean} */
    deadAnimationPlayed = false;

    /** @type {Number} */
    maxMovimentSize = 500;

    /** @type {Number} */
    currentMovimentSize = 500;

    /** @type {Number} */
    minMovimentSize = 200;

    /** @type {Number} */
    horizontalVelocity = 80;

    /** @type {Number} */
    currentHorizontalVelocity = 80;

    /** @type {Number} */
    initialX = 0;

    /** @type {Number} */
    initialY = 0;

    /** @type {Boolean} */
    alreadyTouchGround = false;


    /** @type {Boolean} */
    isAttacking = false;

    /** @type {Boolean} */
    destroyed = false;

    /**
     * @method
     */
    generateTiles() {
        return this.tiles;
    }

    /**
     * @param {Scene1} value 
     */
    setGame(value) {
        this.game = value;
        this.generateTiles();
        for (let state in this.tiles) {
            const imageFrames = this.tiles[state];
            for (let key in imageFrames) {
                const imagePath = imageFrames[key];
                this.game.load.image(key, imagePath);
            }
        }
        
        return this;
    }

    /**
     * @returns {String}
     */
    getAnimationKey(state) {
        let regex = new RegExp(`/(${this.enemySpriteNamePrefix}){1,}/g`);
        return `${this.enemySpriteNamePrefix}${state}`.replace(regex, this.enemySpriteNamePrefix).toLowerCase();
    }

    /**
     * @abstract
     */
    configureSprites() {
        throw new TypeError('Must implement "configureSprites" on child class.');
    }

    /**
     * @abstract
     */
    move() {
        throw new TypeError('Must implement "move" on child class.');
    }

    /**
     * @abstract
     */
    touchPlayer() {
        throw new TypeError('Must implement "touchPlayer" on child class.');
    }

    /**
     * @returns {String}
     */
    get enemySpriteNamePrefix() {
        return `${this.constructor.name.toLowerCase()}_`;
    }

    /**
     * @method
     * Randomize moviment size
     */
    get randomCurrentMovimentSize() {
        this.currentMovimentSize = intRandom(this.minMovimentSize, this.maxMovimentSize);
        return this.currentMovimentSize;
    }

    get isDead() {
        return this.life <= 0;
    }

    /** @type {Boolean} */
    get isMovimentOver() {
        if (this.currentMovimentSize <= 0) {
            this.currentMovimentSize = this.randomCurrentMovimentSize;
            return true;
        }
        return false;
    }

    static get INIT_DEAD_DESTROY_COUNTDOWN() {
        return 500;
    }
}