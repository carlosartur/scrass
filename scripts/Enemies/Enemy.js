import { states } from "../Player";

export class Enemy {
    /**
     * @attr {Number}
     */
    life = 10;

    /**
     * @attr {String}
     */
    enemiesImagesPath = "assets/images/sprites";

    /**
     * @attr {String}
     */
    imagesPath = "";

    /**
     * @attr {Object}
     */
    enemyStates = states;

    /**
     * @attr {Object}
     */
    exclusiveStates = {};

    constructor (config) {
        Object.assign(this, config);
        Object.assign(this.enemyStates, this.exclusiveStates);
    }
}
