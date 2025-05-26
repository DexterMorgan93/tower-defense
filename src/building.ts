import {
  AnimatedSprite,
  Container,
  Graphics,
  Texture,
  TextureSource,
} from "pixi.js";
import { Projectile } from "./projectile";
import type { Enemy } from "./enemy";

export class Building extends AnimatedSprite {
  color = "blue";
  elapsedFrames = 0;
  framesHold = 3;
  shootFrame = 6;

  view!: Graphics;
  buildingWidth = 64 * 2;
  buildingHeight = 64;
  projectilesContainer!: Container;
  attackRadius = 250;
  target?: Enemy | null;

  texturesProjectile!: Record<string | number, Texture<TextureSource<any>>>;
  texturesTower!: Texture[];

  static cost = 50;
  static winCoins = 25;

  constructor(
    texturesProjectile: Record<string | number, Texture<TextureSource<any>>>,
    texturesTower: Texture[]
  ) {
    super(texturesTower);
    this.anchor.set(0, 0.5);
    this.setup();

    this.projectilesContainer = new Container();
    this.addChild(this.projectilesContainer);

    this.texturesProjectile = texturesProjectile;
    this.texturesTower = texturesTower;
  }

  setup() {
    const arcview = new Graphics();
    arcview
      .arc(
        this.position.x + this.width / 2,
        this.position.y,
        this.attackRadius,
        0,
        Math.PI * 2
      )
      .fill({ color: "rgba(0,0,250,0.2)" });
    this.addChild(arcview);
  }

  setTarget(target?: Enemy): void {
    this.target = target;
  }

  handleUpdate() {
    this.elapsedFrames++;
    const newFrame = this.elapsedFrames % this.framesHold === 0;

    if ((!this.target && this.currentFrame !== 0) || this.target) {
      if (newFrame) {
        if (this.currentFrame >= this.totalFrames - 1) {
          this.currentFrame = 0;
        } else {
          this.currentFrame++;
        }
      }
    }

    if (this.target && this.currentFrame === this.shootFrame && newFrame) {
      this.shoot();
    }
  }

  shoot() {
    const projectile = new Projectile(
      this.target || null,
      this.texturesProjectile["projectile.png"]
    );
    projectile.position.set(60, -60);
    this.projectilesContainer.addChild(projectile);
  }
}
