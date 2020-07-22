import {
    MasterScene
} from "./MasterScene.js";
import { EnviromentSprites } from "../EnviromentSprites.js";
import { Player } from "../Player.js";
import { Ninja } from "../Enemies/Ninja.js";

export class Scene1 extends MasterScene {
    /**
     * @type {Ninja}
     */
    masterNinja = null;

    /**
     * @param {EnviromentSprites} enviromentSprites 
     * @param {Player} player 
     */
    constructor(enviromentSprites, player) {
        super(enviromentSprites, player);
        this.masterNinja = new Ninja();
    }

    /**
     * 
     */
    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        for (var i = 60; i <= this.size; i += 128) {
            this.platforms.create(i, 540, 'ground');
        }

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 300, 'ground');
    }

    /**
     * 
     */
    createEnemies() {

    }
}