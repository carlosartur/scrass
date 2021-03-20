import {
    MasterScene
} from "./MasterScene.js";
import {
    EnviromentSprites
} from "../EnviromentSprites.js";
import {
    Player
} from "../Player.js";
import {
    Ninja
} from "../Enemies/Ninja.js";

export class Scene2 extends MasterScene {
    /** @type {Number} */
    size = 10500;

    /** @type {Boolean} */
    masterNinja = null;

    /**
     * @param {EnviromentSprites} enviromentSprites 
     * @param {Player} player 
     */
    constructor(enviromentSprites, player) {
        super(enviromentSprites, player, "Scene2");
        this.masterNinja = new Ninja();
    }

    /**
     * @method
     */
    preload() {
        super.preload();
        this.masterNinja.setGame(this);
    }

    /**
     * @method
     */
    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        Object.entries(this.sceneData.platforms).forEach(([key, value]) => {
            value.forEach(value2 => this.platforms.create(value2.x, value2.y, key))
        });
        this.platforms.setDepth(2);
    }

    /**
     * @returns {Sprite[]}
     */
    createEnemies() {
        let ninjas = this.sceneData.enemies.ninja.map(item =>
            this.masterNinja.clone(item).configureSprites()
        );
        return [this.masterNinja.configureSprites(), ...ninjas];
    }

    /**
     * @method
     */
    createDecoratives() {
        this.decoratives = this.physics.add.staticGroup();
        Object.entries(this.sceneData.decoratives).forEach(([key, value]) => {
            value.forEach(value2 => this.decoratives.create(value2.x, value2.y, key))
        });
    }

    /**
     * @method
     */
    crateFluidGround() {
        this.fluidGround = this.physics.add.staticGroup();
        Object.entries(this.sceneData.fluid_ground).forEach(([key, value]) => {
            value.forEach(value2 => this.fluidGround.create(value2.x, value2.y, key));
        });

        this.fluidGround.setDepth(1);
    }

    /**
     * @method
     */
    createCheckpoint() {
        this.checkpoint = this.physics.add.staticGroup();
        this.checkpoint.create(5000, 445, 'checkpoint');
    }

    /**
     * @method
     */
    createEndStage() {
        this.endOfStage = this.physics.add.staticGroup();
        this.endOfStage.create(10100, 445, 'end_of_stage');
        let invisibleSprites = [380, 315, 250, 185, 120, 55, -10];
        invisibleSprites.forEach(item => {
            let invisibleSprite = this.endOfStage.create(10100, item, 'end_of_stage');
            invisibleSprite.setVisible(false);
        }, this);
    }

    /**
     * @method
     */
    callNextStage() {
        this.scene.start("Scene3");
    }
}