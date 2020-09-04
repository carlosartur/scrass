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
                'ground_left': "/Tiles/1.png",
                'ground_right': "/Tiles/3.png",
                'ground_mid_left': "/Tiles/4.png",
                'ground_mid': "/Tiles/5.png",
                'ground_mid_right': "/Tiles/6.png",
                'ground_ramp_up_right': "/Tiles/7.png",
                'ground_ramp_up_right_bottom': "/Tiles/8.png",
                'ground_bottom': "/Tiles/9.png",
                'ground_ramp_up_left_bottom': "/Tiles/10.png",
                'ground_ramp_up_left': "/Tiles/11.png",
                'ground_bottom_left': "/Tiles/12.png",
                'ground_small_left': "/Tiles/13.png",
                'ground_small': "/Tiles/14.png",
                'ground_small_right': "/Tiles/15.png",
                'ground_bottom_right': "/Tiles/16.png",
                'water_top': "/Tiles/17.png",
                'water_bottom': "/Tiles/18.png",
                'decorative_bush_1': "/Object/Bush (1).png",
                'decorative_bush_2': "/Object/Bush (2).png",
                'decorative_bush_3': "/Object/Bush (3).png",
                'decorative_bush_4': "/Object/Bush (4).png",
                'decorative_crate': "/Object/Crate.png",
                'decorative_mushroom_1': "/Object/Mushroom_1.png",
                'decorative_mushroom_2': "/Object/Mushroom_2.png",
                'decorative_stone': "/Object/Stone.png",
                'decorative_tree_1': "/Object/Tree_1.png",
                'decorative_tree_2': "/Object/Tree_2.png",
                'decorative_tree_3': "/Object/Tree_3.png",
                'checkpoint': "/Object/Sign_2.png",
                'end_of_stage': "/Object/Sign_1.png",
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
        this.game.load.spritesheet('crystal', `${this.crystalSpritePrefix}${crystalColour}.png`, {
            frameWidth: 32,
            frameHeight: 32
        });
    }
}