import {
  Application,
  Container,
  Sprite,
  Texture,
  TextureSource,
  Ticker,
} from "pixi.js";
import { Enemy } from "./enemy";
import { waypoints } from "./shared/waypoints";
import { placementTilesdata2D } from "./shared/placement-tiles-data";
import { PlacementTile } from "./placement-tile";
import { Building } from "./building";
import type { Projectile } from "./projectile";
import { Statusbar } from "./status-bar";
import { Explosion } from "./explosion";
import { DefaultScene } from "./scene-manager";
import { LoaderModal } from "./loader-modal";
import { EndGameModal } from "./end-game-modal";

const mouse = {
  x: 0,
  y: 0,
};

export class Game extends DefaultScene {
  app: Application;
  background: Sprite;
  enemiesContainer: Container;
  explosionsContainer: Container;
  placementTilesContainer: Container;
  buildingsContainer: Container;
  activeHoveringTile!: PlacementTile | null;
  spawnEnemiesCount = 2;
  statusBar!: Statusbar;
  endGameModal!: EndGameModal;
  gameEnded = false;
  textures!: Record<string | number, Texture<TextureSource<any>>>;
  animations!: Record<string | number, Texture<TextureSource<any>>[]>;

  constructor(app: Application) {
    super();

    this.eventMode = "dynamic";
    this.handleHover();
    this.handlePointerDown();

    const loaderModal = new LoaderModal();

    this.app = app;

    const {
      backgroundTexture,
      spritesheet: { textures, animations },
    } = loaderModal.getAssets();
    this.textures = textures;
    this.animations = animations;

    this.background = new Sprite(backgroundTexture);
    this.addChild(this.background);

    this.statusBar = new Statusbar(
      textures["heart.png"],
      textures["coins.png"]
    );
    this.addChild(this.statusBar);

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

    this.explosionsContainer = new Container();
    this.addChild(this.explosionsContainer);

    this.endGameModal = new EndGameModal(this);
    this.endGameModal.visible = false;
    this.addChild(this.endGameModal);
  }

  handlePointerDown() {
    this.addEventListener("pointerdown", (e) => {
      if (
        this.activeHoveringTile &&
        !this.activeHoveringTile.occupied &&
        !this.gameEnded
      ) {
        if (this.statusBar.coins >= Building.cost) {
          const newBuilding = new Building(
            this.textures,
            this.animations["tower"]
          );
          this.statusBar.subtractCoins(Building.cost);

          newBuilding.position.set(
            this.activeHoveringTile.position.x,
            this.activeHoveringTile.position.y
          );

          this.buildingsContainer.addChild(newBuilding);
          this.activeHoveringTile.occupied = true;
        }
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
      const enemy = new Enemy(this.animations["orc"]);
      enemy.position.set(waypoints[0].x - xOffset, waypoints[0].y);
      this.enemiesContainer.addChild(enemy);
    }
  }

  handleUpdate(deltaMS: Ticker) {
    if (!this.gameEnded) {
      for (let p = 0; p < this.enemiesContainer.children.length; p++) {
        const enemy = this.enemiesContainer.children[p] as Enemy;
        // const enemyPosition = this.toLocal(enemy.getGlobalPosition());
        enemy.handleUpdate();

        if (enemy.position.x > 1280) {
          enemy.removeFromParent();
          this.statusBar.subtractHearts(1);
        }
      }

      for (
        let i = 0;
        i < this.placementTilesContainer.children.length - 1;
        i++
      ) {
        const newTile = this.placementTilesContainer.children[
          i
        ] as PlacementTile;
        newTile.handleUpdate(mouse);
      }

      // удаление взрывов, когда их полная аним заканчивается
      for (let i = 0; i < this.explosionsContainer.children.length; i++) {
        const explosion = this.explosionsContainer.children[i] as Explosion;

        if (explosion.currentFrame >= explosion.totalFrames - 1) {
          explosion.removeFromParent();
        }
      }

      for (let i = 0; i < this.buildingsContainer.children.length; i++) {
        const building = this.buildingsContainer.children[i] as Building;

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

        for (
          let j = 0;
          j < building.projectilesContainer.children.length;
          j++
        ) {
          const projectile = building.projectilesContainer.children[
            j
          ] as Projectile;
          projectile.handleUpdate();

          if (projectile.target) {
            if (!projectile.isAlive()) {
              projectile.removeFromParent();
            } else {
              const projectilePosition = this.toLocal(
                projectile.getGlobalPosition()
              );
              const targetPosition = this.toLocal(
                projectile.target.getGlobalPosition()
              );

              const xDifference = projectilePosition.x - targetPosition.x;
              const yDifference = projectilePosition.y - targetPosition.y;
              const distance = Math.hypot(xDifference, yDifference);

              if (
                distance < Enemy.radius + projectile.radius &&
                !projectile.target.isDead()
              ) {
                const explosion = new Explosion(this.animations["explosion"]);
                explosion.position.set(
                  projectilePosition.x,
                  projectilePosition.y
                );
                this.explosionsContainer.addChild(explosion);

                projectile.target.subtractHealth(20);
                projectile.removeFromParent();

                if (projectile.target.isDead()) {
                  projectile.target.removeFromParent();
                  this.statusBar.addCoins(Building.winCoins);
                }
              }
            }
          }
        }
      }

      // tracking total amount of enemies
      if (this.enemiesContainer.children.length === 0) {
        this.spawnEnemiesCount += 1;
        this.spawnEnemies();
      }
    }

    if (this.statusBar.hearts === 0) {
      this.endGame();
    }
  }

  startGame() {
    this.gameEnded = false;
  }

  restartGame() {
    this.endGameModal.visible = false;

    for (let p = 0; p < this.enemiesContainer.children.length - 1; p++) {
      const enemy = this.enemiesContainer.children[p] as Enemy;
      enemy.removeFromParent();
    }

    for (let p = 0; p < this.buildingsContainer.children.length; p++) {
      const building = this.buildingsContainer.children[p] as Building;
      building.removeFromParent();
    }

    this.spawnEnemiesCount = 2;

    this.statusBar.setCoins();
    this.statusBar.setHearts();

    this.gameEnded = false;
  }

  endGame() {
    this.gameEnded = true;
    this.endGameModal.visible = true;
  }
}
