import {
    range
} from "./Helpers.js";
import {
    MasterScene
} from "./Scenes/MasterScene.js";

export const states = {
    DEAD: "Dead",
    IDLE: "Idle",
    JUMP: "Jump",
    RUN: "Run",
    WALK: "Walk",
};

export const DIRECTIONS = {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down',
};

/** Use "self" variable as a alias for "this", to use on functions called using "bind" */
let self;

export class Player {

    /**
     * @type {Array}
     */
    lifeColours = [{
        max: 120,
        min: 100,
        colour: 0x83c682
    }, {
        max: 100,
        min: 80,
        colour: 0xaadc5c
    }, {
        max: 80,
        min: 60,
        colour: 0xebeb12
    }, {
        max: 60,
        min: 40,
        colour: 0xff9a2e
    }, {
        max: 40,
        min: 20,
        colour: 0xf37644
    }, {
        max: 20,
        min: -1,
        colour: 0xdb5855
    }];

    /**
     * @type {String} 
     */
    state = states.IDLE;

    /**
     * @type {Boolean}
     */
    deadAnimationPlayed = false;

    /**
     * @type {MasterScene}
     */
    game = null;

    /**
     * @type {String}
     */
    imagesPath = "assets/images/sprites/flatboy/png";

    /**
     * @type {Object}
     */
    tiles = {};

    /**
     * @type {Object}
     */
    playerSprite = null;

    /**
     * @type {Number}
     */
    score = 0;

    /**
     * @type {Any}
     */
    display = null;

    /**
     * @type {Number}
     */
    life = 120;

    /**
     * @type {Number}
     */
    displayLife = 0;

    /**
     * @type {Number}
     */
    width = 100;

    /**
     * @type {Number}
     */
    heigth = 400;

    /**
     * @type {Object}
     */
    lifeBar = null;

    /**
     * @type {Number}
     */
    invincibility = 0;

    /**
     * 
     */
    constructor() {
        for (let key in states) {
            const value = states[key];
            let imagesArray = range(0, 15, 2);

            imagesArray.map(item => {
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
                this.game.load.image(key, imagePath);
            }
        }
        return this;
    }

    /**
     * Configure the sprites of the player
     */
    configureSprites() {
        this.playerSprite = this.game.physics.add.sprite(100, 0, 'idle0');

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
        this.configureLifeBar();
        return this.sprite;
    }

    /**
     * @param {*} cursors 
     */
    move(cursors) {
        this.updateLifeBar();
        this.decreaseInvencibility();

        if (this.isDead) {
            if (!this.deadAnimationPlayed) {
                this.sprite.anims.play(states.DEAD, true);
                this.deadAnimationPlayed = true;
            }
            this.sprite.setVelocityX(0);
            this.updateDisplay('GAME OVER!');
            return;
        }
        this.updateDisplay();
        let horizontalVelocity = 80;
        let run = false;
        let jumping = !this.sprite.body.touching.down;

        if (cursors.shift.isDown) {
            run = true;
        }

        if (cursors.up.isDown || cursors.space.isDown) {
            this.jump(jumping);
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
     * @param {Boolean} jumping To force a jump, pass 'false'
     */
    jump(jumping) {
        if (jumping) {
            return;
        }
        this.sprite.setVelocityY(-400);
        this.sprite.anims.play(states.JUMP, true);
    }

    /**
     * @param {Number} horizontalVelocity 
     * @param {Boolean} run 
     * @param {Boolean} jumping 
     */
    walkLeft(horizontalVelocity, run, jumping) {
        horizontalVelocity *= -1;
        if (this.sprite.x <= 0) {
            horizontalVelocity = 0;
        }
        this.sprite.setFlipX(true);
        this.walk(horizontalVelocity, run, jumping);
    }

    /**
     * @param {Number} horizontalVelocity 
     * @param {Boolean} run 
     * @param {Boolean} jumping 
     */
    walkRight(horizontalVelocity, run, jumping) {
        this.sprite.setFlipX(false);
        this.sprite.setVelocityX(horizontalVelocity);
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
        this.sprite.setVelocityX(horizontalVelocity);

        let anim = run ? states.RUN : states.WALK;
        if (jumping) {
            anim = states.JUMP;
        }
        this.sprite.anims.play(anim, true);
    }

    /**
     * @param {boolean} jumping 
     */
    idle(jumping) {
        this.sprite.setVelocityX(0);

        this.sprite.anims.play(jumping ? states.JUMP : states.IDLE, true);
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
        if (self.invincibility || self.idDead) {
            return;
        }
        self.life -= 10;
        self.sprite.setTint(0xff8800);
        self.invincibility = 250;
    }

    /**
     * 
     */
    decreaseInvencibility() {
        if (this.invincibility > 0) {
            this.invincibility--;
            return;
        }
        if (this.invincibility < 0) {
            this.invincibility = 0;
        }
        this.sprite.setTint(0xffffff);
    }

    /**
     * Updates the life/score display
     */
    updateDisplay(text) {
        let spriteTextDistance = 386,
            minTextBorderDistance = 16,
            currentPosition = this.sprite.x - spriteTextDistance;
        text = text || `Score: ${this.score}`;
        this.display.setText(text);
        this.display.x = (currentPosition > minTextBorderDistance) ?
            currentPosition :
            minTextBorderDistance;
    }

    /**
     * @param {*} value 
     */
    setDisplay(value) {
        this.display = value;
        return this;
    }

    /**
     * 
     */
    configureLifeBar() {
        //draw the bar
        this.lifeBar = this.game.add.graphics();

        //fill the bar with a rectangle
        this.lifeBar.fillRect(0, 0, 200, 30);
        this.lifeBar.setAlpha(0.7);
    }

    /**
     * 
     */
    updateLifeBar() {
        let spriteTextDistance = 100,
            minTextBorderDistance = 300,
            currentPosition = this.sprite.x - spriteTextDistance;

        this.lifeBar.fillStyle(this.lifeBarColour, 1);
        this.lifeBar.x = (currentPosition > minTextBorderDistance) ?
            currentPosition :
            minTextBorderDistance;
        this.lifeBar.y = 16;

        if (this.life > this.displayLife) {
            this.displayLife += 0.5;
        } else if (this.life < this.displayLife) {
            this.displayLife -= 0.5;
        }

        this.lifeBar.scaleX = this.displayLife / 120;
    }

    get isDead() {
        return this.life <= 0;
    }

    get sprite() {
        return this.playerSprite;
    }

    get lifeBarColour() {
        return this.lifeColours.filter(item => this.life > item.min && this.life <= item.max)
            .pop()
            .colour
    }
}