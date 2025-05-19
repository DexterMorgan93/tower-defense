import { Container, Graphics } from "pixi.js";

export class Building extends Container {
  color = "blue";
  view!: Graphics;
  buildingWidth = 64 * 2;
  buildingHeight = 64;

  constructor() {
    super();
    this.setup();
  }

  setup() {
    this.view = new Graphics();
    this.view
      .rect(0, 0, this.buildingWidth, this.buildingHeight)
      .fill({ color: this.color });

    this.addChild(this.view);
  }
}
