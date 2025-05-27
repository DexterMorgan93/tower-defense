import { Container, Graphics, Text } from "pixi.js";
import { SceneManager } from "./scene-manager";

export class EndGameModal extends Container {
  textOptions = {
    text: "Game over",
    top: 95,
    textColor: "yellow",
    textSize: 80,
    textStroke: 2,
  };

  constructor() {
    super();

    this.setup();
  }

  setup(): void {
    const { textOptions } = this;

    const background = new Graphics();
    background
      .rect(0, 0, SceneManager.app.canvas.width, SceneManager.app.canvas.height)
      .fill({ color: 0x000000 });
    background.alpha = 0.5;
    this.addChild(background);

    const text = new Text({
      text: textOptions.text,
      style: {
        fill: textOptions.textColor,
        fontSize: textOptions.textSize,
        stroke: textOptions.textStroke,
      },
    });
    text.position.set(
      SceneManager.app.canvas.width / 2,
      SceneManager.app.canvas.height / 2
    );
    text.anchor.set(0.5, 0.5);
    this.addChild(text);
  }
}
