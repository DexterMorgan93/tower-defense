import { Assets, Spritesheet, Texture } from "pixi.js";

export const manifest = {
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

export class AssetsLoader {
  async initializeLoader(): Promise<void> {
    await Assets.init({ manifest });

    await Assets.loadBundle(manifest.bundles.map((bundle) => bundle.name));
  }

  public getAssets(): {
    spritesheet: Spritesheet;
    backgroundTexture: Texture;
  } {
    return {
      spritesheet: Assets.get("spritesheet"),
      backgroundTexture: Assets.get("background"),
    };
  }
}
