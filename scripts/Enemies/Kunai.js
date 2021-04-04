import {
    Enemy
} from "./Enemy.js";

export class Kunai extends Enemy {
    /** @type {String} */
    imagesPath = "/ninjaadventurenew/png";

    /** @type {Array} */
    tiles = {
        kunai: {
            kunai: `${this.enemiesImagesPath}${this.imagesPath}/Kunai.png`
        }
    };

    init() {
        return this;
    }

    /**
     * @abstract
     */
    configureSprites() {
        if (!this.game) {
            throw new Error('Must have game object to load image.');
        }

        this.enemySprite = this.game.physics.add.sprite(this.initialX, this.initialY);
        this.enemySprite.body.setAllowGravity(false);
        
        this.enemySprite.x = this.enemySprite.y = 100;
        return this;
    }

    /**
     * @abstract
     */
    move() {
        this.enemySprite.setTexture('kunai');
    }

    /**
     * @abstract
     */
    touchPlayer() {
        throw new TypeError('Must implement "touchPlayer" on child class.');
    }
}