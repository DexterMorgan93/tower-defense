import { Container, Graphics } from "pixi.js";

export class PlacementTile extends Container {
  color = "0x964b00";
  view!: Graphics;
  buildingWidth = 64;
  buildingHeight = 64;
  occupied = false;

  constructor() {
    super();
    this.setup();
  }

  setup() {
    this.view = new Graphics();
    this.view
      .rect(0, 0, this.buildingWidth, this.buildingHeight)
      .fill({ color: this.color }).alpha = 0.3;

    this.addChild(this.view);
  }

  drawTile() {
    this.view.clear();
    this.view
      .rect(0, 0, this.buildingWidth, this.buildingHeight)
      .fill({ color: this.color });
  }

  handleUpdate(pos: { x: number; y: number }) {
    if (
      pos.x > this.position.x &&
      pos.x < this.position.x + this.width &&
      pos.y > this.position.y &&
      pos.y < this.position.y + this.height
    ) {
      this.color = "rgba(255,255,255,1)";
    } else {
      this.color = "0x964b00";
    }
    this.drawTile();
  }
}
