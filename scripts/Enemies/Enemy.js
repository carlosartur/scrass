import { states } from "../Player.js";
import { Clonable } from "../Clonable.js";

export class Enemy extends Clonable {
    /**
     * @type {Number}
     */
    life = 10;

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
     * @type {Array}
     */
    tiles = {};

    /**
     * @method
     */
    generateTiles() {
        return this.tiles;
    }
}
