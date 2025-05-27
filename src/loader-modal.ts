import {
  Assets,
  Graphics,
  Spritesheet,
  Texture,
  type AssetsManifest,
} from "pixi.js";
import { DefaultScene } from "./scene-manager";

export const manifest: AssetsManifest = {
  bundles: [
    {
      name: "bundle-1",
      assets: {
        spritesheet: "spritesheets/spritesheet.json",
        background: "images/map.png",
      },
    },
  ],
};

export class LoaderModal extends DefaultScene {
  loaderBarFill!: Graphics;
  loaderBarBorder!: Graphics;

  barOptions = {
    width: 350,
    height: 40,
    fillColor: 0x183dd0,
    borderRadius: 5,
    borderThick: 5,
    borderColor: "red",
  };

  constructor() {
    super();

    this.setup();

    this.draw();
  }

  setup() {
    const loaderBarBorder = new Graphics();
    this.addChild(loaderBarBorder);
    this.loaderBarBorder = loaderBarBorder;

    const loaderBarFill = new Graphics();
    this.addChild(loaderBarFill);
    this.loaderBarFill = loaderBarFill;
  }

  draw() {
    this.loaderBarBorder
      .roundRect(
        0,
        0,
        this.barOptions.width,
        this.barOptions.height,
        this.barOptions.borderRadius
      )
      .fill({ color: this.barOptions.borderColor });

    this.loaderBarFill
      .roundRect(
        this.barOptions.borderThick,
        this.barOptions.borderThick,
        0,
        0,
        this.barOptions.borderRadius
      )
      .fill({ color: this.barOptions.fillColor });
  }

  async initializeLoader(): Promise<void> {
    await Assets.init({ manifest });

    await Assets.loadBundle(
      manifest.bundles.map((bundle) => bundle.name),
      this.downloadProgress
    );
  }

  downloadProgress = (progressRatio: number): void => {
    this.loaderBarFill
      .roundRect(
        this.barOptions.borderThick,
        this.barOptions.borderThick,
        (this.barOptions.width - this.barOptions.borderThick * 2) *
          progressRatio,
        this.barOptions.height - this.barOptions.borderThick * 2,
        this.barOptions.borderRadius
      )
      .fill({ color: this.barOptions.fillColor });
  };

  getAssets(): {
    spritesheet: Spritesheet;
    backgroundTexture: Texture;
  } {
    return {
      spritesheet: Assets.get("spritesheet"),
      backgroundTexture: Assets.get("background"),
    };
  }
}
