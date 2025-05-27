import { Container, Graphics, Text } from "pixi.js";
import { SceneManager } from "./scene-manager";
import { FancyButton } from "@pixi/ui";
import type { Game } from "./game";

export class EndGameModal extends Container {
  game!: Game;
  button!: FancyButton;
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
    text: "Restart",
    top: 95,
    textColor: "red",
    textSize: 40,
    textStroke: 2,
  };

  textOptions = {
    text: "Game over",
    textColor: "yellow",
    textSize: 80,
    textStroke: 2,
  };

  constructor(game: Game) {
    super();

    this.game = game;

    this.setup();

    this.button.onPress.connect(() => {
      game.restartGame();
    });
  }

  setup(): void {
    const { textOptions, buttonOptions, buttonTextOptions } = this;

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
      SceneManager.app.canvas.height / 4
    );
    text.anchor.set(0.5, 0.5);
    this.addChild(text);

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
