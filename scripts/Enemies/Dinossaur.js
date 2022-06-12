import { Enemy } from "./Enemy";

import { MasterScene } from "../Scenes/MasterScene.js";

import { states } from "../Player.js";

import {
    range,
    intRandom
} from "../Helpers.js";

export class Dinossaur extends Enemy {

    /** @type {String} */
    imagesPath = "/freedinosprite/png";

    /**
     * @method
     */
    init() {
        super.init();
        this.generateTiles();
    }

    /**
     * @method
     */
    getGame() {
        return this.game;
    }

    setGame(game) {
        super.setGame(game);
        this.kunai = (new Kunai())
            .setGame(this.game);
        return this;
    }

    /**
     * @method
     */
    generateTiles() {
        if (this.imagesLoaded) {
            return this;
        }
        
        let frames = {
            [states.DEAD]: range(1, 8),
            [states.IDLE]: range(1, 10),
            [states.JUMP]: range(1, 12),
            [states.RUN]: range(1, 8),
            [states.WALK]: range(1, 10),
        };

        for (let state in frames) {
            const imagesArray = frames[state];

            imagesArray.map(item => {
                const imageAnimationKey = this.getAnimationKey(state);
                this.tiles[imageAnimationKey] = this.tiles[imageAnimationKey] || {};
                this.tiles[imageAnimationKey][`${imageAnimationKey}${item}`] = `${this.enemiesImagesPath}${this.imagesPath}/${imageFrames} (${item}).png`;
            }, this);
        }
        this.imagesLoaded = true;
    }

    /**
     * @method
     */
    configureSprites() {
        this.enemySprite = this.game.physics.add.sprite(this.initialX, this.initialY, 'ninja_idle0');

        this.sprite.displayWidth = 60;
        this.sprite.displayHeight = 110;

        this.sprite.setBounce(0.2);
        this.createAnims();
        this.playAnimation();
        this.sprite.setSize(this.width, this.heigth);
        return this;
    }

    /**
     * @abstract
     */
    move() {
        
    }

    /**
     * @abstract
     */
    touchPlayer() {
        
    }
}