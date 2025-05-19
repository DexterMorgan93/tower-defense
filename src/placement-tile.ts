import { Container, Graphics } from "pixi.js";

export class PlacementTile extends Container {
  constructor() {
    super();
  }

  setup() {
    const view = new Graphics();
    view.rect(0, 0, 64, 64).fill({ color: "green" });

    this.addChild(view);
  }

  handleUpdate() {}
}
