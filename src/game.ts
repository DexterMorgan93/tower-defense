import { Application, Container, Sprite } from "pixi.js";
import { AssetsLoader } from "./assets-loader";
import { Enemy } from "./enemy";
import { waypoints } from "./shared/waypoints";
import { placementTilesdata2D } from "./shared/placement-tiles-data";
import { PlacementTile } from "./placement-tile";

export class Game extends Container {
  app: Application;
  assetsLoader!: AssetsLoader;
  background: Sprite;
  enemiesContainer: Container;
  placementTilesContainer: Container;

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

    this.placementTilesContainer = new Container();
    this.addChild(this.placementTilesContainer);
    placementTilesdata2D.forEach((row, y) => {
      row.forEach((symbol, x) => {
        const placementTile = new PlacementTile();
        placementTile.position.set(x * 64, y * 64);

        if (symbol === 14) {
          this.placementTilesContainer.addChild(placementTile);
        }
      });
    });

    console.log(this.placementTilesContainer.children);
  }

  handleUpdate() {
    this.enemiesContainer.children.forEach((enemyItem) => {
      const enemy = enemyItem as Enemy;
      enemy.handleUpdate();
    });

    this.placementTilesContainer.children.forEach((tile) => {
      const newTile = tile as PlacementTile;
      newTile.setup();
    });
  }
}
