export const states = {
    DEAD: "Dead",
    IDLE: "Idle",
    JUMP: "Jump",
    RUN: "Run",
    WALK: "Walk",
};

export class Player {
    /**
     * @attr String 
     */
    state = states.IDLE;

    /**
     * @attr String
     */
    game = null;

    /**
     * @attr String
     */
    imagesPath = "assets/images/sprites/flatboy";

    /**
     * @param {Phaser.Game} value 
     */
    setGame(value) {
        this.game = value;
        return this;
    }

    /**
     * 
     */
    configureSprites() {
        let sprites = [...Array(15).keys()].map(item => `${this.state} (${item + 1}).png`, this);
        this.game.load.spritesheet('player', sprites, {
            frameWidth: 32,
            frameHeight: 48
        });
        return this.game.physics.add.sprite(100, 450, 'player');
    }
}