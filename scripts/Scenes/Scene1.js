import {
    MasterScene
} from "./MasterScene.js";

export class Scene1 extends MasterScene {
    // enviroment = enviroments.DESERT;

    constructor(enviromentSprites, player) {
        super(enviromentSprites, player);
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        for (var i = 60; i <= this.size; i += 128) {
            this.platforms.create(i, 540, 'ground');
        }

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 300, 'ground');
    }
}