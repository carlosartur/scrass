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

    /** @type {Object[]} */
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
        min: -1000,
        colour: 0xdb5855
    }];

    /** @type {String} */
    state = states.IDLE;

    /** @type {Boolean} */
    deadAnimationPlayed = false;

    /** @type {MasterScene} */
    game = null;

    /** @type {String} */
    imagesPath = "assets/images/sprites/flatboy/png";

    /** @type {Object} */
    tiles = {};

    /** @type {Object} */
    playerSprite = null;

    /** @type {Number} */
    score = 0;

    /** @type {Any} */
    display = null;

    /** @type {Number} */
    life = 120;

    /** @type {Number} */
    initialLife = 120;

    /** @type {Number} */
    displayLife = 0;

    /** @type {Number} */
    width = 300;

    /** @type {Number} */
    heigth = 400;

    /** @type {Object} */
    lifeBar = null;

    /** @type {Number} */
    invincibility = 0;

    /** @type {String} */
    currentDirection = DIRECTIONS.RIGHT;

    /** @type {Number} */
    cameraDifferenceX = 30;

    /** @type {Number} */
    currentCameraDifferenceX = 0;

    /** @type {Number} */
    checkpointX = 0;

    /** @type {Number} */
    lifes = 3;

    /** @type {Number} */
    timeDied = 0;

    /** @type {Boolean} */
    spritesLoaded = false;

    /** @type {Object} */
    cursors = null;

    /**
     * @constructor
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

        if (!this.spritesLoaded) {
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
        }
        this.spritesLoaded = true;

        this.sprite.anims.play(states.IDLE);
        this.sprite.setSize(this.width, this.heigth);
        this.sprite.setDepth(2);
        this.configureLifeBar();
        this.turnRight();
        return this.sprite;
    }

    /**
     * @param {Object} cursors 
     */
    move(cursors) {
        this.cursors = cursors;
        this.updateLifeBar();
        this.decreaseInvencibility();
        if (!this.lifes) {
            return;
        }

        if (this.timeDied) {
            this.respawn();
            return;
        }

        if (this.isDead) {
            this.die();
            return;
        }

        this.updateDisplay();
        let horizontalVelocity = 80;
        let run = false;
        let jumping = !this.sprite.body.touching.down;

        if (this.runPressed) {
            run = true;
        }

        if (this.jumpPressed) {
            this.jump(jumping);
        }

        if (this.leftPressed) {
            return this.walkLeft(horizontalVelocity, run, jumping);
        }

        if (this.rightPressed) {
            return this.walkRight(horizontalVelocity, run, jumping);
        }
        this.idle(jumping);
    }

    /** 
     * @getter
     * @type {Boolean}
     */
    get runPressed() {
        if (this.game.gamePad && (this.game.gamePad.A || this.game.gamePad.Y)) {
            return true;
        }
        return this.cursors.shift.isDown || this.cursors.z.isDown;
    }

    /** 
     * @getter
     * @type {Boolean}
     */
    get jumpPressed() {
        if (this.game.gamePad && (this.game.gamePad.X || this.game.gamePad.B)) {
            return true;
        }
        return this.cursors.up.isDown || this.cursors.space.isDown || this.cursors.x.isDown;
    }

    /** 
     * @getter
     * @type {Boolean}
     */
    get leftPressed() {
        if (this.game.gamePad && (this.game.gamePad.left || (this.game.gamePad.leftStick.x < 0))) {
            return true;
        }
        return this.cursors.left.isDown;
    }

    /** 
     * @getter
     * @type {Boolean}
     */
    get rightPressed() {
        if (this.game.gamePad && (this.game.gamePad.right || (this.game.gamePad.leftStick.x > 0))) {
            return true;
        }
        return this.cursors.right.isDown;
    }

    /**
     * @method
     */
    die() {
        if (!this.deadAnimationPlayed) {
            this.sprite.anims.play(states.DEAD, true);
            this.deadAnimationPlayed = true;
            this.lifes--;
            this.timeDied = 125;
        }
        this.sprite.setVelocityX(0);
        if (!this.lifes) {
            this.updateDisplay('GAME OVER!');
        }
    }

    /**
     * @method
     */
    instantDie() {
        self.life = 10;
        self.hurt(true, -1);
    }

    /**
     * @method
     */
    respawn() {
        if (this.timeDied > 1) {
            this.timeDied--;
            return;
        }
        this.timeDied = 0;
        this.sprite.x = this.checkpointX || 100;
        this.sprite.y = 0;
        this.life = this.initialLife;
        this.deadAnimationPlayed = false;
        return;
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
        this.turnLeft();
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
        this.turnRight();
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
     * @method
     */
    hurt(forceHurt = false, invincibility = 250) {
        if (!forceHurt && (self.invincibility || self.idDead)) {
            return;
        }
        self.life -= 10;
        self.invincibility = invincibility;
    }

    /**
     * @method
     */
    decreaseInvencibility() {
        if (this.invincibility > 0) {
            this.sprite.setAlpha((this.invincibility / 5) % 2);
            this.invincibility--;
            return;
        }
        if (this.invincibility < 0) {
            this.invincibility = 0;
        }
        this.sprite.setAlpha(1);
    }

    /**
     * @method updateDisplay Updates the life/score display
     */
    updateDisplay(text) {
        let spriteTextDistance = 386,
            minTextBorderDistance = 16,
            currentPosition = this.cameraPositionX - spriteTextDistance,
            spaces = 7 - String(this.score).length,
            lifeSpaces = 2 - String(this.lifes).length;

        text = text || `Score:${' '.repeat(spaces)}${this.score}${' '.repeat(15)}Lifes:${' '.repeat(lifeSpaces)}${this.lifes}`;
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
     * @method
     */
    configureLifeBar() {
        //draw the bar
        this.lifeBar = this.game.add.graphics();

        //fill the bar with a rectangle
        this.lifeBar.fillRect(0, 0, 200, 30);
        this.lifeBar.setAlpha(0.7);
    }

    /**
     * @method
     */
    updateLifeBar() {
        let spriteTextDistance = 100,
            minTextBorderDistance = 300,
            currentPosition = this.cameraPositionX - spriteTextDistance;

        this.lifeBar.fillStyle(this.lifeBarColour, 1);
        this.lifeBar.x = (currentPosition > minTextBorderDistance) ?
            currentPosition :
            minTextBorderDistance;
        this.lifeBar.y = 16;

        let lifeUpdate = 0;
        if (this.life !== this.displayLife) {
            lifeUpdate = this.life > this.displayLife ? 2 : -2;
        }

        this.displayLife += lifeUpdate;
        

        this.lifeBar.scaleX = this.displayLife / this.initialLife;
    }

    /**
     * @method 
     */
    turnLeft() {
        if (this.currentDirection === DIRECTIONS.LEFT) {
            return false;
        }
        this.currentDirection = DIRECTIONS.LEFT;
        this.sprite.setOffset(300, 100);
        this.sprite.x -= 30;
        this.currentCameraDifferenceX = this.cameraDifferenceX;
    }

    /**
     * @method
     */
    turnRight() {
        if (this.currentDirection === DIRECTIONS.RIGHT) {
            return false;
        }
        this.currentDirection = DIRECTIONS.RIGHT;
        this.sprite.setOffset(0, 100);
        this.sprite.x += 30;
        this.currentCameraDifferenceX = this.cameraDifferenceX * -1;
    }

    /**
     * @method 
     */
    checkpoint(playerSprite, checkpointSprite) {
        checkpointSprite.disableBody(true, true);
        self.checkpointX = Math.floor(playerSprite.x);
        self.score += 200;
    }

    /** @type {Number} */
    get cameraPositionX() {
        if (this.currentCameraDifferenceX > 0) {
            this.currentCameraDifferenceX--;
        }
        if (this.currentCameraDifferenceX < 0) {
            this.currentCameraDifferenceX++;
        }
        return Math.floor(this.sprite.x) + this.currentCameraDifferenceX;
    }

    /** @type {Boolean} */
    get isDead() {
        return this.life <= 0;
    }

    /** @type {Sprite} */
    get sprite() {
        return this.playerSprite;
    }

    /** @type {Number} */
    get lifeBarColour() {
        return this.lifeColours.filter(item => this.life > item.min && this.life <= item.max)
            .pop()
            .colour
    }
}