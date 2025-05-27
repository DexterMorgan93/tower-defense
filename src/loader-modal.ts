import {
  Assets,
  Graphics,
  Spritesheet,
  Texture,
  type AssetsManifest,
} from "pixi.js";
import { DefaultScene } from "./scene-manager";
import { List, ProgressBar } from "@pixi/ui";

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
  progressBar!: ProgressBar;
  isFilling = true;

  barOptions = {
    value: 0,
    width: 450,
    height: 35,
    fillColor: "#00b1dd",
    borderRadius: 25,
    borderColor: "#FFFFFF",
    backgroundColor: "#fe6048",
    border: 3,
  };

  constructor() {
    super();

    this.draw();
  }

  draw() {
    const list = new List({ type: "vertical", elementsMargin: 10 });

    const loaderBarBorder = new Graphics();
    loaderBarBorder
      .roundRect(
        0,
        0,
        this.barOptions.width,
        this.barOptions.height,
        this.barOptions.borderRadius
      )
      .fill({ color: this.barOptions.borderColor })
      .roundRect(
        this.barOptions.border,
        this.barOptions.border,
        this.barOptions.width - this.barOptions.border * 2,
        this.barOptions.height - this.barOptions.border * 2,
        this.barOptions.borderRadius
      )
      .fill(this.barOptions.backgroundColor);

    const loaderBarFill = new Graphics();
    loaderBarFill
      .roundRect(
        0,
        0,
        this.barOptions.width,
        this.barOptions.height,
        this.barOptions.borderRadius
      )
      .fill({ color: this.barOptions.borderColor })
      .roundRect(
        this.barOptions.border,
        this.barOptions.border,
        this.barOptions.width - this.barOptions.border * 2,
        this.barOptions.height - this.barOptions.border * 2,
        this.barOptions.borderRadius
      )
      .fill(this.barOptions.fillColor);

    this.progressBar = new ProgressBar({
      bg: loaderBarBorder,
      fill: loaderBarFill,
      progress: this.barOptions.value,
    });

    list.addChild(this.progressBar);
    this.addChild(list);
  }

  async initializeLoader(): Promise<void> {
    await Assets.init({ manifest });

    await Assets.loadBundle(
      manifest.bundles.map((bundle) => bundle.name),
      this.downloadProgress
    );
  }

  downloadProgress = (progressRatio: number): void => {
    this.isFilling ? progressRatio++ : progressRatio--;
    if (progressRatio > 15) {
      this.isFilling = false;
    } else if (progressRatio < -50) {
      this.isFilling = true;
    }
    this.progressBar.progress = progressRatio * 100;
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
