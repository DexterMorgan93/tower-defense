import { AnimatedSprite, type Texture } from "pixi.js";

export class Explosion extends AnimatedSprite {
  constructor(textures: Texture[]) {
    super(textures);
    this.anchor.set(0.5, 0.5);
    this.animationSpeed = 0.5;
    this.loop = false;
    this.play();
  }
}
