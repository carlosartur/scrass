import { Enemy } from "./Enemy.js";
import { range } from "../Helpers.js";

export class Ninja extends Enemy {
    
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
     * @type {Phaser.Scene}
     */
    game = null;

    /**
     * @param {Object} config 
     */
    constructor(config) {
        super(config);
        Object.assign(this.exclusiveStates, this.enemyStates);
        this.init();
    }

    /**
     * @method
     */
    init() {
        this.generateTiles();
    }

    getGame() {
        return this.game;
    }

    setGame(value) {
        this.game = value;
    }

    /**
     * @method
     */
    generateTiles() {
        let imagesArray = range(0, 9);
        
        for (let state in this.exclusiveStates) {
            const imageFrames = this.exclusiveStates[state];
            imagesArray.map(item => {
                this.tiles[imageFrames] = this.tiles[imageFrames] || {};
                this.tiles[imageFrames][`${imageFrames.toLowerCase()}${item}`] = `${this.enemiesImagesPath}${this.imagesPath}/${imageFrames}_00${item}.png`;
            }, this);            
        }
        console.log(this.tiles);
    }
}