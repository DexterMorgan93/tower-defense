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
    const targetPosition = this.target.getGlobalPosition();
    const projectilePosition = this.getGlobalPosition();
    const angle = Math.atan2(
      targetPosition.y - projectilePosition.y,
      targetPosition.x - projectilePosition.x
    );

    const velocityX = Math.cos(angle);
    const velocityY = Math.sin(angle);

    this.position.x += velocityX;
    this.position.y += velocityY;
  }
}
