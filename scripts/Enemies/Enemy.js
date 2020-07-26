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

    configureSprites() {}

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
}