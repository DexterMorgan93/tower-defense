import { Container, Graphics } from "pixi.js";
import { Projectile } from "./projectile";

export class Building extends Container {
  color = "blue";
  view!: Graphics;
  buildingWidth = 64 * 2;
  buildingHeight = 64;
  projectilesContainer!: Container;

  constructor() {
    super();
    this.setup();

    this.projectilesContainer = new Container();
    this.addChild(this.projectilesContainer);
  }

  setup() {
    this.view = new Graphics();
    this.view
      .rect(0, 0, this.buildingWidth, this.buildingHeight)
      .fill({ color: this.color });
    this.addChild(this.view);
  }

  renderProjectiles() {
    const projectile = new Projectile();
    projectile.position.set(this.width / 2, this.height / 2);
    this.projectilesContainer.addChild(projectile);
  }
}
