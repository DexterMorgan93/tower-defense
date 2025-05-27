import { Graphics, Text } from "pixi.js";
import { DefaultScene, SceneManager } from "./scene-manager";
import { Button } from "@pixi/ui";
import { Game } from "./game";

export class StartModal extends DefaultScene {
  modalBox!: Graphics;
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
}
