import { Assets, Graphics, Spritesheet, Text, Texture } from "pixi.js";
import { DefaultScene, SceneManager } from "./scene-manager";
import { Button } from "@pixi/ui";
import { Game } from "./game";

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

export class StartModal extends DefaultScene {
  modalBox!: Graphics;
  loaderBarFill!: Graphics;
  loaderBarBorder!: Graphics;
  button!: Button;
  boxOptions = {
    top: 500,
    left: 300,
    fill: 0xffffff,
    width: 300,
    height: 200,
    borderRadius: 5,
  };

  buttonOptions = {
    top: 550,
    left: 370,
    width: 200,
    height: 50,
    fill: 0x0ea5e9,
    borderRadius: 10,
  };

  buttonTextOptions = {
    top: 95,
    textColor: 0xffffff,
    textSize: 20,
    textStroke: 2,
  };

  barOptions = {
    width: 350,
    height: 40,
    fillColor: 0x183dd0,
    borderRadius: 5,
    borderThick: 5,
    borderColor: 0x000000,
  };

  constructor() {
    super();

    this.setup();

    this.button.onPress.connect(() => {
      SceneManager.changeScene(new Game(SceneManager.app));
    });
  }

  setup(): void {
    const { boxOptions, buttonOptions } = this;

    this.modalBox = new Graphics();
    this.modalBox
      .roundRect(
        boxOptions.top,
        boxOptions.left,
        boxOptions.width,
        boxOptions.height,
        boxOptions.borderRadius
      )
      .fill({ color: boxOptions.fill });
    this.addChild(this.modalBox);

    this.loaderBarBorder = new Graphics();
    this.loaderBarBorder
      .roundRect(
        300,
        200,
        this.barOptions.width,
        this.barOptions.height,
        this.barOptions.borderRadius
      )
      .fill({ color: this.barOptions.borderColor });
    this.addChild(this.loaderBarBorder);

    this.loaderBarFill = new Graphics();
    this.loaderBarFill
      .roundRect(
        480,
        320,
        this.barOptions.width - this.barOptions.borderThick * 2,
        this.barOptions.height - this.barOptions.borderThick * 2,
        this.barOptions.borderRadius
      )
      .fill({ color: this.barOptions.fillColor });
    this.addChild(this.loaderBarFill);

    const buttonView = new Graphics();
    buttonView
      .roundRect(
        buttonOptions.top,
        buttonOptions.left,
        buttonOptions.width,
        buttonOptions.height,
        buttonOptions.borderRadius
      )
      .fill({ color: 0x0ea5e9 });
    this.button = new Button(buttonView);
    this.addChild(this.button.view);

    const buttonText = new Text({
      text: "Launch Game",
      style: {
        fontSize: this.buttonTextOptions.textSize,
        fill: this.buttonTextOptions.textColor,
        stroke: this.buttonTextOptions.textStroke,
      },
    });
    buttonText.position.set(buttonOptions.top + 40, buttonOptions.left + 10);
    this.addChild(buttonText);
  }

  async initializeLoader(): Promise<void> {
    await Assets.init({ manifest });

    await Assets.loadBundle(
      manifest.bundles.map((bundle) => bundle.name),
      this.downloadProgress
    );
  }

  downloadProgress = (progressRatio: number): void => {
    console.log(`Progress: ${progressRatio * 100}%`);

    this.loaderBarFill.width =
      (this.barOptions.width - this.barOptions.borderThick * 2) * progressRatio;
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
