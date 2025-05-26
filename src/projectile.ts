import { Container, Sprite, Texture } from "pixi.js";
import type { Enemy } from "./enemy";

export class Projectile extends Container {
  elapsedFrames = 0;
  maxFramesAlive = 200;
  moveSpeed = 5;
  radius = 10;
  target: Enemy | null;
  texture!: Texture;

  constructor(target: Enemy | null, texture: Texture) {
    super();

    this.target = target;
    this.texture = texture;
    this.setup();
  }

  setup() {
    const view = new Sprite(this.texture);
    view.position.set(0, 0);

    this.addChild(view);
  }

  handleUpdate() {
    // затемнять не удаленные пули
    if (this.target?.isDead()) {
      if (this.alpha > 0) {
        this.alpha -= 0.05;
      }
    }
    this.elapsedFrames++;

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

  isAlive() {
    // если пуля остается на экране 200 фреймов, то помечаем ее на удаление
    return this.elapsedFrames <= this.maxFramesAlive;
  }
}
