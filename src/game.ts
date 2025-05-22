import { Application, Container, Sprite } from "pixi.js";
import { AssetsLoader } from "./shared/assets-loader";
import { Enemy } from "./enemy";
import { waypoints } from "./shared/waypoints";
import { placementTilesdata2D } from "./shared/placement-tiles-data";
import { PlacementTile } from "./placement-tile";
import { Building } from "./building";
import type { Projectile } from "./projectile";

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
  spawnEnemiesCount = 1;

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

  spawnEnemies() {
    for (let i = 1; i < this.spawnEnemiesCount; i++) {
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

      if (enemy.position.x > 1280) {
        enemy.removeFromParent();
      }
    });

    for (let i = 0; i < this.placementTilesContainer.children.length - 1; i++) {
      const newTile = this.placementTilesContainer.children[i] as PlacementTile;
      newTile.handleUpdate(mouse);
    }

    this.buildingsContainer.children.forEach((item) => {
      const building = item as Building;

      const validEnemies = this.enemiesContainer.children.filter((item) => {
        const enemy = item as Enemy;
        const enemyPosition = this.toLocal(enemy.getGlobalPosition());

        const xDifference = enemyPosition.x - building.position.x;
        const yDifference = enemyPosition.y - building.position.y;
        const distance = Math.hypot(xDifference, yDifference);
        return distance < Enemy.radius + building.attackRadius;
      });
      building.handleUpdate();
      building.setTarget(validEnemies[0] as Enemy);

      building.projectilesContainer.children.forEach((subItem) => {
        const projectile = subItem as Projectile;
        projectile.handleUpdate();

        if (projectile.target) {
          const projectilePosition = this.toLocal(
            projectile.getGlobalPosition()
          );
          const targetPosition = this.toLocal(
            projectile.target.getGlobalPosition()
          );

          const xDifference = projectilePosition.x - targetPosition.x;
          const yDifference = projectilePosition.y - targetPosition.y;
          const distance = Math.hypot(xDifference, yDifference);

          if (distance < Enemy.radius + projectile.radius) {
            projectile.target.subtractHealth(20);
            projectile.removeFromParent();
            if (projectile.target.isDead()) {
              projectile.target.removeFromParent();
            }
          }
        }
      });
    });

    // tracking total amount of enemies
    if (this.enemiesContainer.children.length === 0) {
      this.spawnEnemiesCount += 1;
      this.spawnEnemies();
    }
  }
}
