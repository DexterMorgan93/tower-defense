import { Application, Container, Sprite } from "pixi.js";
import { AssetsLoader } from "./assets-loader";

export class Game extends Container {
  app: Application;
  assetsLoader!: AssetsLoader;
  background: Sprite;

  constructor(app: Application) {
    super();

    this.app = app;
    this.assetsLoader = new AssetsLoader();

    const { backgroundTexture } = this.assetsLoader.getAssets();

    this.background = new Sprite(backgroundTexture);
    this.addChild(this.background);
  }

  handleUpdate() {}
}
