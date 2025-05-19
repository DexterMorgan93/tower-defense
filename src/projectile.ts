import { Container, Graphics } from "pixi.js";

export class Projectile extends Container {
  color = "orange";
  view!: Graphics;
  radius = 10;

  constructor() {
    super();
    this.setup();
  }

  setup() {
    this.view = new Graphics();
    this.view
      .arc(0, 0, this.radius, 0, Math.PI * 2)
      .fill({ color: this.color });
    this.addChild(this.view);
  }
}
