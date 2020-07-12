export const states = {
    DEAD: "Dead",
    IDLE: "Idle",
    JUMP: "Jump",
    RUN: "Run",
    WALK: "Walk",
};

/** Use "self" variable as a alias for "this", to use on functions called using "bind" */
let self;

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

    /**
     * @attr {Number}
     */
    score = 0;

    /**
     * @attr {Any}
     */
    display = null;

    /**
     * @attr {Number}
     */
    live = 100;

    constructor() {
        for (let key in states) {
            const value = states[key];
            [...Array(15).keys()].map(item => {
                this.tiles[value] = this.tiles[value] || {};
                this.tiles[value][`${value.toLowerCase()}${item}`] = `${this.imagesPath}/${value}%20(${item + 1}).png`;
            }, this);
        }
        self = this;
    }

    /**
     * @param {Phaser.Scene} value 
     */
    setGame(value) {
        this.game = value;
        for (let state in this.tiles) {
            const imageFrames = this.tiles[state];
            for (let key in imageFrames) {
                const imagePath = imageFrames[key];
                let image = this.game.load.image(key, imagePath);
                console.log(image);
            }
        }
        return this;
    }

    /**
     * Configure the sprites of the player
     */
    configureSprites() {
        this.playerSprite = this.game.physics.add.sprite(100, 0, 'idle0');

        this.playerSprite.displayWidth = 60;
        this.playerSprite.displayHeight = 110;

        this.playerSprite.setBounce(0.2);
        this.playerSprite.setCollideWorldBounds(true);
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
        /** 
         * bottom: 600
         *   centerX: 400
         *   centerY: 300
         *   height: 600
         *   left: 0
         *   right: 800
         *   top: 0
         *   type: 5
         *   width: 800
         *   x: 0
         *   y: 0
         */

        Object.assign(
            this.playerSprite.body.customBoundsRectangle, {
                // bottom: 100,
                // centerX: 0,
                // centerY: 400,
                // height: 100,
                // left: 100,
                // right: 100,
                // top: 100,
                // width: 100,
            }
        );

        this.playerSprite.anims.play(states.IDLE);

        return this.playerSprite;
    }

    /**
     * @param {*} cursors 
     */
    move(cursors) {
        if (this.isDead) {
            this.playerSprite.anims.play(states.DEAD, true);
            this.playerSprite.setVelocityX(0);
            this.updateDisplay('GAME OVER!');
            return;
        }
        this.updateDisplay();

        let horizontalVelocity = 40;
        let run = false;
        let jumping = !this.playerSprite.body.touching.down;

        if (cursors.shift.isDown) {
            run = true;
        }
        // jump
        if ((cursors.up.isDown || cursors.space.isDown) && !jumping) {
            this.playerSprite.setVelocityY(-400);
            this.playerSprite.anims.play(states.JUMP, true);
        }

        if (cursors.left.isDown) {
            return this.walkLeft(horizontalVelocity, run, jumping);
        }

        if (cursors.right.isDown) {
            return this.walkRight(horizontalVelocity, run, jumping);
        }
        this.idle(jumping);
    }

    /**
     * @param {Number} horizontalVelocity 
     * @param {Boolean} run 
     * @param {Boolean} jumping 
     */
    walkLeft(horizontalVelocity, run, jumping) {
        horizontalVelocity *= -1;
        this.playerSprite.setFlipX(true);
        this.walk(horizontalVelocity, run, jumping);
    }

    /**
     * @param {Number} horizontalVelocity 
     * @param {Boolean} run 
     * @param {Boolean} jumping 
     */
    walkRight(horizontalVelocity, run, jumping) {
        this.playerSprite.setFlipX(false);
        this.playerSprite.setVelocityX(horizontalVelocity);
        this.walk(horizontalVelocity, run, jumping);
    }

    /**
     * @param {Number} horizontalVelocity 
     * @param {Boolean} run 
     * @param {Boolean} jumping 
     */
    walk(horizontalVelocity, run, jumping) {
        if (run) {
            horizontalVelocity *= 2;
        }
        this.playerSprite.setVelocityX(horizontalVelocity);

        let anim = run ? states.RUN : states.WALK;
        if (jumping) {
            anim = states.JUMP;
        }
        this.playerSprite.anims.play(anim, true);
    }

    /**
     * @param {boolean} jumping 
     */
    idle(jumping) {
        this.playerSprite.setVelocityX(0);

        this.playerSprite.anims.play(jumping ? states.JUMP : states.IDLE, true);
    }

    /**
     * @param {*} playerSprite 
     * @param {*} crystal 
     */
    collectCrystal(playerSprite, crystal) {
        crystal.disableBody(true, true);
        self.score += 10;
    }

    /**
     * 
     */
    hurt() {
        self.live -= 10;
    }

    /**
     * Updates the live/score display
     */
    updateDisplay(text) {
        text = text || `Score: ${this.score}. Live: ${this.live}`;
        this.display.setText(text);
        this.display.x = (this.playerSprite.x - 224 > 0) ?
            (this.playerSprite.x - 224) :
            16;
    }

    /**
     * @param {*} value 
     */
    setDisplay(value) {
        this.display = value;
        return this;
    }

    get isDead() {
        return this.live <= 0;
    }

    get sprite() {
        return this.playerSprite;
    }
}