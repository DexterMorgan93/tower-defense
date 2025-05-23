import { Container, Graphics, Sprite, Texture } from "pixi.js";
import type { Enemy } from "./enemy";

export class Projectile extends Container {
  color = "orange";
  view!: Graphics;
  radius = 10;
  moveSpeed = 5;
  target: Enemy | null;
  texture!: Texture;

  constructor(target: Enemy | null, texture: Texture) {
    super();

    this.target = target;
    this.texture = texture;
    this.setup();

    console.log(this.texture);
  }

  setup() {
    const view = new Sprite(this.texture);
    view.position.set(0, 0);

    this.addChild(view);
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
