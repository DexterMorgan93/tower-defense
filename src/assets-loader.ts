import { Assets, Spritesheet, Texture } from "pixi.js";

export const manifest = {
  bundles: [
    {
      name: "bundle-1",
      assets: {
        spritesheet: "/sprite/spritesheet.json",
        background: "images/background.png",
        hills: "images/hills.png",
      },
    },
  ],
};

export class AssetsLoader {
  async initializeLoader(): Promise<void> {
    await Assets.init({ manifest });

    await Assets.loadBundle(manifest.bundles.map((bundle) => bundle.name));
  }

  public getAssets(): {
    spritesheet: Spritesheet;
    backgroundTexture: Texture;
    hillsTexture: Texture;
  } {
    return {
      spritesheet: Assets.get("spritesheet"),
      backgroundTexture: Assets.get("background"),
      hillsTexture: Assets.get("hills"),
    };
  }
}
