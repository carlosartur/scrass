export class StartScreenScene extends Phaser.Scene {

    /**
     * @type {Object}
     */
    texts = [{
            posX: 100,
            posY: 100,
            text: "SCRASS!",
            style: {
                fontSize: '64px',
                fill: '#000'
            }
        }, {
            posX: 100,
            posY: 260,
            text: "Click anywhere to start...",
            style: {
                fontSize: '44px',
                fill: '#000'
            }
        }, {
            posX: 100,
            posY: 320,
            text: "Controls",
            style: {
                fontSize: '32px',
                fill: '#000'
            }
        },
        {
            posX: 100,
            posY: 350,
            text: "Jump:   X, Up Arrow or Space Key",
            style: {
                fontSize: '32px',
                fill: '#000'
            }
        },
        {
            posX: 100,
            posY: 380,
            text: "Run:    Z or Shift Key",
            style: {
                fontSize: '32px',
                fill: '#000'
            }
        },
        {
            posX: 100,
            posY: 410,
            text: "Left:   Left arrow",
            style: {
                fontSize: '32px',
                fill: '#000'
            }
        },
        {
            posX: 100,
            posY: 440,
            text: "Right:  Right arrow",
            style: {
                fontSize: '32px',
                fill: '#000'
            }
        },
        {
            posX: 100,
            posY: 470,
            text: "Pause:  P Key",
            style: {
                fontSize: '32px',
                fill: '#000'
            }
        },
    ];

    constructor() {
        super('StartScreenScene');
    }

    /**
     * @method
     */
    preload() {
        this.load.image("background", "assets/images/enviroment/freetileset/png/BG/BG.png");
    }

    /**
     * @method
     */
    create() {
        this.add.image(400, 300, 'background');
        this.texts.forEach(item => {
            this.add.text(item.posX, item.posY, item.text, item.style);
        }, this);
        this.input.on('pointerdown', () => this.scene.start("Scene1"));
    }
}