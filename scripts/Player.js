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

    constructor() {
        this.tiles = [...Array(15).keys()].map(item => `${this.imagesPath}/${this.state}%20(${item + 1}).png`, this);
    }

    static get SPRITE_NAME() {
        return 'player';
    }

    /**
     * @param {Scene} value 
     */
    setGame(value) {
        console.log(this.tiles[0]);
        this.game = value;
        this.game.load.spritesheet(Player.SPRITE_NAME, this.tiles, {
            frameWidth: 400,
            frameHeight: 400
        });
        return this;
    }

    /**
     * 
     */
    configureSprites() {
        let player = this.game.physics.add.sprite(100, 450, Player.SPRITE_NAME);
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.game.anims.create({
            key: 'left',
            frames: this.game.anims.generateFrameNumbers(Player.SPRITE_NAME, {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        this.game.anims.create({
            key: 'turn',
            frames: [{
                key: Player.SPRITE_NAME,
                frame: 4
            }],
            frameRate: 20
        });

        this.game.anims.create({
            key: 'right',
            frames: this.game.anims.generateFrameNumbers(Player.SPRITE_NAME, {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });
    }
}