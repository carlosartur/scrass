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
     * @attr {Array}
     */
    tiles = [];

    /**
     * @attr {Object}
     */
    playerSprite = null;

    constructor() {
        this.tiles = [...Array(15).keys()].map(item => `${this.imagesPath}/${this.state}%20(${item + 1}).png`, this);
    }

    static get SPRITE_NAME() {
        return 'playerSprite';
    }

    /**
     * @param {Scene} value 
     */
    setGame(value) {
        this.game = value;
        this.game.load.spritesheet(Player.SPRITE_NAME, this.tiles, {
            frameWidth: 300,
            frameHeight: 500
        });
        return this;
    }

    /**
     * 
     */
    configureSprites() {
        this.playerSprite = this.game.physics.add.sprite(100, 0, Player.SPRITE_NAME);
        this.playerSprite.displayWidth = 60;
        this.playerSprite.displayHeight = 120;
        this.playerSprite.setBounce(0.2);
        this.playerSprite.setCollideWorldBounds(true);

        this.game.anims.create({
            key: 'left',
            frames: this.game.anims.generateFrameNumbers(Player.SPRITE_NAME, {
                start: 0,
                end: 14
            }),
            frameRate: 10,
            repeat: -1
        });

        this.game.anims.create({
            key: 'turn',
            frames: this.game.anims.generateFrameNumbers(Player.SPRITE_NAME, {
                start: 0,
                end: 14
            }),
            frameRate: 20
        });

        this.game.anims.create({
            key: 'right',
            frames: this.game.anims.generateFrameNumbers(Player.SPRITE_NAME, {
                start: 0,
                end: 14
            }),
            frameRate: 10,
            repeat: -1
        });

        return this.playerSprite;
    }

    /**
     * 
     * @param {*} cursors 
     */
    move(cursors) {
        console.log(cursors);
        if (cursors.left.isDown) {
            this.playerSprite.setVelocityX(-160);

            this.playerSprite.anims.play('left', true);
        } else if (cursors.right.isDown) {
            this.playerSprite.setVelocityX(160);

            this.playerSprite.anims.play('right', true);
        } else {
            this.playerSprite.setVelocityX(0);

            this.playerSprite.anims.play('turn');
        }

        if (cursors.up.isDown && this.playerSprite.body.touching.down) {
            this.playerSprite.setVelocityY(-330);
        }
    }
}