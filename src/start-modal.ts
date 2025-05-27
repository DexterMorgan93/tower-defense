import { Graphics, Text } from "pixi.js";
import { DefaultScene, SceneManager } from "./scene-manager";
import { FancyButton } from "@pixi/ui";
import { Game } from "./game";

export class StartModal extends DefaultScene {
  modalBox!: Graphics;
  button!: FancyButton;
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
    animationDuration: 100,
  };

  buttonTextOptions = {
    text: "Launch",
    top: 95,
    textColor: "red",
    textSize: 40,
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
    const { boxOptions, buttonOptions, buttonTextOptions } = this;

    this.modalBox = new Graphics();
    this.modalBox
      .roundRect(
        0,
        0,
        boxOptions.width,
        boxOptions.height,
        boxOptions.borderRadius
      )
      .fill({ color: boxOptions.fill });
    this.modalBox.pivot.set(boxOptions.width / 2, boxOptions.height / 2);
    this.modalBox.position.set(
      SceneManager.app.canvas.width / 2,
      SceneManager.app.canvas.height / 2
    );
    this.addChild(this.modalBox);

    this.button = new FancyButton({
      text: new Text({
        text: buttonTextOptions.text,
        style: {
          fill: buttonTextOptions.textColor,
          fontSize: buttonTextOptions.textSize,
          stroke: buttonTextOptions.textStroke,
        },
      }),
      animations: {
        hover: {
          props: {
            scale: { x: 1.03, y: 1.03 },
            y: 0,
          },
          duration: buttonOptions.animationDuration,
        },
        pressed: {
          props: {
            scale: { x: 0.9, y: 0.9 },
            y: 10,
          },
          duration: buttonOptions.animationDuration,
        },
      },
    });
    this.button.position.set(
      SceneManager.app.canvas.width / 2,
      SceneManager.app.canvas.height / 2
    );
    this.button.anchor.set(0.5, 0.5);
    this.addChild(this.button);
  }
}
