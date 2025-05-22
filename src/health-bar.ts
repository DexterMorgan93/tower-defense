import { Container, Graphics } from "pixi.js";

export class HealthBar extends Container {
  static boxOptions = {
    border: 0xffffff,
    borderThick: 1,
    width: 100,
    height: 10,
    fill: 0x15803d,
    empty: 0xff0000,
  };

  borderBox!: Graphics;
  fillBar!: Graphics;
  emptyBar!: Graphics;

  constructor() {
    super();
    this.setup();
    this.draw();
  }

  setup(): void {
    const bars = new Container();

    this.borderBox = new Graphics();
    this.addChild(this.borderBox);

    this.emptyBar = new Graphics();
    bars.addChild(this.emptyBar);

    this.fillBar = new Graphics();
    bars.addChild(this.fillBar);

    this.addChild(bars);
  }

  draw(): void {
    const { borderBox, fillBar, emptyBar } = this;
    const { boxOptions } = HealthBar;

    borderBox.rect(0, 0, boxOptions.width, boxOptions.height);
    borderBox.fill(boxOptions.border);

    emptyBar.position.set(boxOptions.borderThick, boxOptions.borderThick);
    emptyBar.rect(
      0,
      0,
      boxOptions.width - boxOptions.borderThick * 2,
      boxOptions.height - 2 * boxOptions.borderThick
    );
    emptyBar.fill(boxOptions.empty);

    fillBar.position.set(boxOptions.borderThick, boxOptions.borderThick);
    fillBar.rect(
      0,
      0,
      boxOptions.width - boxOptions.borderThick * 2,
      boxOptions.height - 2 * boxOptions.borderThick
    );
    fillBar.fill(boxOptions.fill);
  }

  setHealth(health: number): void {
    const { boxOptions } = HealthBar;
    this.fillBar.width = (boxOptions.width - boxOptions.borderThick) * health;
  }
}
