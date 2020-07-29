import {
    states
} from "../Player.js";
import {
    Clonable
} from "../Clonable.js";
import {
    Scene1
} from "../Scenes/Scene1.js";

export class Enemy extends Clonable {
    /**
     * @type {Number}
     */
    life = 10;

    /**
     * @type {Number}
     */
    width = 100;

    /**
     * @type {Number}
     */
    heigth = 400;

    /**
     * @type {String}
     */
    enemiesImagesPath = "assets/images/sprites";

    /**
     * @type {String}
     */
    imagesPath = "";

    /**
     * @type {Object}
     */
    enemyStates = states;

    /**
     * @type {Object}
     */
    exclusiveStates = {};

    /**
     * @type {Object}
     */
    enemySprite = null

    /**
     * @type {Object}
     */
    tiles = {};

    /**
     * @type {Boolean}
     */
    imagesLoaded = false;

    /**
     * @type {Boolean}
     */
    animsCreated = false;

    /**
     * @type {Boolean}
     */
    deadAnimationPlayed = false;

    /**
     * @type {Number}
     */
    movimentSize = 500;

    /**
     * @type {Number}
     */
    currentMovimentSize = 500;

    /**
     * @type {Number}
     */
    horizontalVelocity = 80;

    /**
     * @type {Number}
     */
    currentHorizontalVelocity = 80;

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
        for (let state in this.tiles) {
            const imageFrames = this.tiles[state];
            for (let key in imageFrames) {
                const imagePath = imageFrames[key];
                this.game.load.image(key, imagePath);
            }
        }
        this.generateTiles();
        return this;
    }

    /**
     * @abstract
     */
    configureSprites() {
        throw new TypeError('Must implement "configureSprites" on child class.');
    }

    /**
     * @returns {String}
     */
    get enemySpriteNamePrefix() {
        return `${this.constructor.name.toLowerCase()}_`;
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
    move() {
        throw new TypeError('Must implement "move" on child class.');
    }

    /**
     * @abstract
     */
    touchPlayer() {
        throw new TypeError('Must implement "move" on child class.');
    }

    get isDead() {
        return this.life <= 0;
    }

    /**
     * @type {Boolean}
     */
    get isMovimentOver() {
        if (this.currentMovimentSize <= 0) {
            this.currentMovimentSize = this.movimentSize;
            return true;
        }
        return false;
    }
}