import { Container, Graphics, Texture, TextureSource } from "pixi.js";
import { Projectile } from "./projectile";
import type { Enemy } from "./enemy";

export class Building extends Container {
  center!: { x: number; y: number };
  color = "blue";
  elapsedFrames = 60;
  view!: Graphics;
  buildingWidth = 64 * 2;
  buildingHeight = 64;
  projectilesContainer!: Container;
  attackRadius = 250;
  target?: Enemy | null;
  textures!: Record<string | number, Texture<TextureSource<any>>>;
  static cost = 50;
  static winCoins = 25;

  constructor(texture: Record<string | number, Texture<TextureSource<any>>>) {
    super();
    this.center = {
      x: this.position.x + this.buildingWidth / 2,
      y: this.position.y + this.buildingHeight / 2,
    };
    this.setup();

    this.projectilesContainer = new Container();
    this.addChild(this.projectilesContainer);

    this.textures = texture;
  }

  setTarget(target?: Enemy): void {
    this.target = target;
  }

  handleUpdate() {
    if (this.elapsedFrames % 60 === 0 && this.target) {
      this.shoot();
    }
    this.elapsedFrames++;
  }

  setup() {
    this.view = new Graphics();
    this.view
      .rect(0, 0, this.buildingWidth, this.buildingHeight)
      .fill({ color: this.color });
    this.addChild(this.view);

    const arcview = new Graphics();
    arcview
      .arc(this.center.x, this.center.y, this.attackRadius, 0, Math.PI * 2)
      .fill({ color: "rgba(0,0,250,0.2)" });
    this.addChild(arcview);
  }

  shoot() {
    const projectile = new Projectile(
      this.target || null,
      this.textures["projectile.png"]
    );
    projectile.position.set(this.buildingWidth / 2, this.buildingHeight / 2);
    this.projectilesContainer.addChild(projectile);
  }
}
