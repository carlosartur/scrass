import { states } from "../Player";
import { Clonable } from "../Clonable";

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
    tiles = [];

    constructor (config) {
        super(config);
        this.tiles = this.generateTiles();
    }

    generateTiles() {
        return [];
    }
}
