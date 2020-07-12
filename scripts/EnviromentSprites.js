export const enviroments = {
    DEFAULT: "default",
    DESERT: "desert",
    SCI_FI: "sci_fi",
    GRAVEYARD: "graveyard",
    WINTER: "winter"
};

export class EnviromentSprites {
    /**
     * String
     */
    imagesPath = "assets/images/enviroment";

    /**
     * String
     */
    crystalSpritePrefix = "assets/images/crystals/crystal-qubodup-ccby3-32-";

    enviromentImages = {
        default: {
            enviromentPath: '/freetileset/png',
            images: {
                'sky': "/BG/BG.png",
                'ground': "/Tiles/2.png",
            },
            crystalColour: "blue"
        },
        desert: {
            enviromentPath: '/deserttileset/png',
            images: {
                'sky': "/BG.png",
                'ground': "/Tile/2.png",
            },
            crystalColour: "grey"
        },
        sci_fi: {
            enviromentPath: '/freescifiplatform/png',
            images: {
                'sky': "/Tiles/BGTile (3).png",
                'ground': "/Tiles/Tile (2).png",
            },
            crystalColour: "pink"
        },
        graveyard: {
            enviromentPath: '/graveyardtilesetnew/png',
            images: {
                'sky': "/BG.png",
                'ground': "/Tiles/Tile (2).png",
            },
            crystalColour: "green"
        },
        winter: {
            enviromentPath: '/wintertileset/png',
            images: {
                'sky': "/BG/BG.png",
                'ground': "/Tiles/2.png",
            },
            crystalColour: "blue"
        },
    };

    /**
     * @param {Phaser.game} game 
     * @param {String} enviroment 
     */
    constructor(game = null, enviroment = enviroments.DEFAULT) {
        this.game = game;
        this.enviroment = enviroment;
        if (this.game) {
            this.configureEnviroment();
        }
    }

    setGame(game) {
        this.game = game;
        return this;
    }

    /**
     * 
     * @param {enviroments} value
     */
    setEnviroment(value = enviroments.DEFAULT) {
        this.enviroment = value;
        this.configureEnviroment();
        return this;
    }

    /**
     * 
     */
    configureEnviroment() {
        let selectedEnviroment = this.enviromentImages[this.enviroment] || this.enviromentImages[enviroments.DEFAULT];
        this.loadImages(
            selectedEnviroment.enviromentPath,
            selectedEnviroment.images,
            selectedEnviroment.crystalColour
        );
    }

    /**
     * Load enviroments objects to game data
     * @param {String} enviromentPath 
     * @param {Object} images 
     * @param {String} crystalColour 
     */
    loadImages(enviromentPath, images, crystalColour = 'blue') {
        if (!this.game.load) {
            throw new TypeError("You must initilize the game variable before calling this method. Call it on 'preload' function.");
        }
        for (var i in images) {
            this.game.load.image(i, `${this.imagesPath}${enviromentPath}${images[i]}`);
        }
        console.log(`${this.crystalSpritePrefix}${crystalColour}.png`);
        this.game.load.spritesheet('crystal', `${this.crystalSpritePrefix}${crystalColour}.png`, {
            frameWidth: 32,
            frameHeight: 32
        });
    }
}