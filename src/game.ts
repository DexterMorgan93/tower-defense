import { Application, Container, Sprite } from "pixi.js";
import { AssetsLoader } from "./assets-loader";
import { Enemy } from "./enemy";
import { waypoints } from "./shared/waypoints";
import { placementTilesdata2D } from "./shared/placement-tiles-data";
import { PlacementTile } from "./placement-tile";
import { Building } from "./building";

const mouse = {
  x: 0,
  y: 0,
};

export class Game extends Container {
  app: Application;
  assetsLoader!: AssetsLoader;
  background: Sprite;
  enemiesContainer: Container;
  placementTilesContainer: Container;
  buildingsContainer: Container;
  activeHoveringTile!: PlacementTile | null;

  constructor(app: Application) {
    super();

    this.eventMode = "dynamic";
    this.handleHover();
    this.handlePointerDown();

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

    this.buildingsContainer = new Container();
    this.addChild(this.buildingsContainer);
  }

  handlePointerDown() {
    this.addEventListener("pointerdown", (e) => {
      if (this.activeHoveringTile && !this.activeHoveringTile.occupied) {
        const newBuilding = new Building();
        newBuilding.position.set(
          this.activeHoveringTile.position.x,
          this.activeHoveringTile.position.y
        );
        this.buildingsContainer.addChild(newBuilding);
        this.activeHoveringTile.occupied = true;
      }
    });
  }

  handleHover() {
    this.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      this.activeHoveringTile = null;
      for (let i = 0; i < this.placementTilesContainer.children.length; i++) {
        const tile = this.placementTilesContainer.children[i] as PlacementTile;

        if (
          mouse.x > tile.position.x &&
          mouse.x < tile.position.x + tile.width &&
          mouse.y > tile.position.y &&
          mouse.y < tile.position.y + tile.height
        ) {
          this.activeHoveringTile = tile;
          break;
        }
      }
    });
  }

  handleUpdate() {
    this.enemiesContainer.children.forEach((enemyItem) => {
      const enemy = enemyItem as Enemy;
      enemy.handleUpdate();
    });

    this.placementTilesContainer.children.forEach((tile) => {
      const newTile = tile as PlacementTile;
      newTile.handleUpdate(mouse);
    });
  }
}
