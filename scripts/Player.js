export const states = {
    DEAD: "Dead",
    IDLE: "Idle",
    JUMP: "Jump",
    RUN: "Run",
    WALK: "Walk",
};

export class Player {

    /**
     * @attr {String} 
     */
    state = states.IDLE;

    /**
     * @attr {Phaser.}
     */
    game = null;

    /**
     * @attr String
     */
    imagesPath = "assets/images/sprites/flatboy/png";

    /**
     * @attr {Object}
     */
    tiles = {};

    /**
     * @attr {Object}
     */
    playerSprite = null;

    constructor() {
        for (let key in states) {
            const value = states[key];
            [...Array(15).keys()].map(item => {
                this.tiles[value] = this.tiles[value] || {};
                this.tiles[value][`${value.toLowerCase()}${item}`] = `${this.imagesPath}/${value}%20(${item + 1}).png`;
            }, this);
        }
    }

    static get SPRITE_NAME() {
        return 'player';
    }

    /**
     * @param {Scene} value 
     */
    setGame(value) {
        this.game = value;
        for (let state in this.tiles) {
            const imageFrames = this.tiles[state];
            for (let key in imageFrames) {
                const imagePath = imageFrames[key];
                this.game.load.image(key, imagePath, {
                    frameWidth: 100,
                    frameHeight: 100
                });
            }
        }
        return this;
    }

    /**
     * 
     */
    configureSprites() {
        this.playerSprite = this.game.physics.add.sprite(100, 0, 'idle0');

        this.playerSprite.displayWidth = 60;
        this.playerSprite.displayHeight = 110;
        this.playerSprite.setBounce(0.2);
        this.playerSprite.setCollideWorldBounds(true);
        for (let state in this.tiles) {
            const imageFrames = this.tiles[state];
            this.game.anims.create({
                key: state,
                frames: Object.keys(imageFrames).map(key => ({
                    key
                })),
                frameRate: 10,
                repeat: -1
            });
        }

        this.playerSprite.anims.play(states.IDLE);

        return this.playerSprite;
    }

    /**
     * @param {*} cursors 
     */
    move(cursors) {
        let horizontalVelocity = 160;
        let run = false;
        if (cursors.shift.isDown) {
            horizontalVelocity *= 2;
            run = true;
        }
        // jump
        if ((cursors.up.isDown || cursors.space.isDown) && this.playerSprite.body.touching.down) {
            this.playerSprite.setVelocityY(-330);
            this.playerSprite.anims.play(states.JUMP);
        }

        if (cursors.left.isDown) {
            return this.walkLeft(horizontalVelocity, run);
        }

        if (cursors.right.isDown) {
            return this.walkRight(horizontalVelocity, run);
        }
        this.idle();
    }

    /**
     * @param {Number} horizontalVelocity 
     * @param {Boolean} run 
     */
    walkLeft(horizontalVelocity, run) {
        horizontalVelocity *= -1;
        this.playerSprite.setVelocityX(horizontalVelocity);
        this.playerSprite.setFlipX(true);
        this.playerSprite.anims.play(run ? states.RUN : states.WALK, true);
    }

    /**
     * @param {Number} horizontalVelocity 
     * @param {Boolean} run 
     */
    walkRight(horizontalVelocity, run) {
        this.playerSprite.setVelocityX(horizontalVelocity);
        this.playerSprite.setFlipX(false);
        this.playerSprite.anims.play(run ? states.RUN : states.WALK, true);
    }

    /**
     * 
     */
    idle() {
        this.playerSprite.setVelocityX(0);

        this.playerSprite.anims.play(states.IDLE);
    }
}