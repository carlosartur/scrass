import {
    Enemy
} from "./Enemy.js";
import {
    range
} from "../Helpers.js";
import {
    states
} from "../Player.js";

export class Ninja extends Enemy {

    /**
     * @type {String[]}
     */
    statusNotUsed = [states.WALK];

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
    constructor(config, game = null) {
        super(config);
        Object.assign(this.exclusiveStates, this.enemyStates);
        if (game) {
            this.setGame(game);
        }
        this.init();
    }

    /**
     * @method
     */
    getGame() {
        return this.game;
    }

    /**
     * @method
     */
    generateTiles() {
        if (!this.imagesLoaded) {
            let imagesArray = range(0, 9);
            for (let state in this.exclusiveStates) {
                const imageFrames = this.exclusiveStates[state];
                if (this.statusNotUsed.includes(imageFrames)) {
                    continue;
                }
                imagesArray.map(item => {
                    this.tiles[imageFrames] = this.tiles[imageFrames] || {};
                    this.tiles[imageFrames][`${imageFrames.toLowerCase()}${item}`] = `${this.enemiesImagesPath}${this.imagesPath}/${imageFrames}_00${item}.png`;
                }, this);
            }
            this.imagesLoaded = true;
        }
        this.configureSprites();
    }

    /**
     * @method
     */
    configureSprites() {
        this.enemySprite = this.game.physics.add.sprite(300, 0, 'ninja_idle0');

        this.sprite.displayWidth = 60;
        this.sprite.displayHeight = 110;

        this.sprite.setBounce(0.2);
        for (let state in this.tiles) {
            const imageFrames = this.tiles[state];
            let repeat = -1;
            if ([states.DEAD, states.JUMP].includes(state)) {
                repeat = 0;
            }
            this.game.anims.create({
                key: state,
                frames: Object.keys(imageFrames).map(key => ({
                    key
                })),
                frameRate: 10,
                repeat
            });
        }

        this.sprite.anims.play(states.IDLE);
        this.sprite.setSize(this.width, this.heigth);
    }

    get sprite() {
        return this.enemySprite;
    }
}