import { Container, Graphics } from "pixi.js";
import type { Enemy } from "./enemy";

export class Projectile extends Container {
  color = "orange";
  view!: Graphics;
  radius = 10;
  target: Enemy;

  constructor(target: Enemy) {
    super();
    this.setup();

    this.target = target;
  }

  setup() {
    this.view = new Graphics();
    this.view
      .arc(0, 0, this.radius, 0, Math.PI * 2)
      .fill({ color: this.color });
    this.addChild(this.view);
  }

  handleUpdate() {
    const angle = Math.atan2(
      this.target.position.y - this.position.y,
      this.target.position.x - this.position.x
    );

    const velocityX = Math.cos(angle);
    const velocityY = Math.sin(angle);

    this.position.x += velocityX;
    this.position.y += velocityY;
  }
}
