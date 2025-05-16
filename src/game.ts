import { Application, Container, Sprite } from "pixi.js";
import { AssetsLoader } from "./assets-loader";
import { Enemy } from "./enemy";
import { waypoints } from "./shared/waypoints";

export class Game extends Container {
  app: Application;
  assetsLoader!: AssetsLoader;
  background: Sprite;
  enemiesContainer: Container;

  constructor(app: Application) {
    super();

    this.app = app;
    this.assetsLoader = new AssetsLoader();

    const { backgroundTexture } = this.assetsLoader.getAssets();

    this.background = new Sprite(backgroundTexture);
    this.addChild(this.background);

    this.enemiesContainer = new Container();
    this.addChild(this.enemiesContainer);
    for (let i = 1; i < 10; i++) {
      const xOffset = i * 150;
      const enemy = new Enemy();
      enemy.position.set(waypoints[0].x - xOffset, waypoints[0].y);
      this.enemiesContainer.addChild(enemy);
    }
  }

  handleUpdate() {
    this.enemiesContainer.children.forEach((enemyItem) => {
      const enemy = enemyItem as Enemy;
      enemy.handleUpdate();
    });
  }
}
