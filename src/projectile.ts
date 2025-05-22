import { Container, Graphics } from "pixi.js";
import type { Enemy } from "./enemy";

export class Projectile extends Container {
  color = "orange";
  view!: Graphics;
  radius = 10;
  moveSpeed = 5;
  target: Enemy | null;

  constructor(target: Enemy | null) {
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
    if (this.target) {
      const targetPosition = this.target.getGlobalPosition();
      const projectilePosition = this.getGlobalPosition();
      const angle = Math.atan2(
        targetPosition.y - projectilePosition.y,
        targetPosition.x - projectilePosition.x
      );

      const velocityX = Math.cos(angle) * this.moveSpeed;
      const velocityY = Math.sin(angle) * this.moveSpeed;

      this.position.x += velocityX;
      this.position.y += velocityY;
    }
  }
}
