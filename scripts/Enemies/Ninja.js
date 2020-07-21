import { Enemy } from "./Enemy.js";
import { range } from "../Helpers.js";

export class Ninja extends Enemy {
    
    /**
     * @attr {String}
     */
    imagesPath = "/ninjaadventurenew/png";
    
    /**
     * @attr {Object}
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
     * @attr {Phaser.Scene}
     */
    game = null;

    getGame() {
        return this.game;
    }

    setGame(value) {
        this.game = value;
    }

    generateTiles() {
        this.enemyStates
        let imagesArray = range(0, 9);

        imagesArray.map(item => {
            this.tiles[value] = this.tiles[value] || {};
            this.tiles[value][`${value.toLowerCase()}${item}`] = `${this.imagesPath}/${value}%20(${item + 1}).png`;
        }, this);
        for (let state in this.enemyStates) {
            const imageFrames = this.tiles[state];
        }
    }
}