import { Container, Sprite, Texture, Text, Graphics } from "pixi.js";

export class Statusbar extends Container {
  heartTexture: Texture;
  heartIcon!: Sprite;
  coinTexture: Texture;
  coinIcon!: Sprite;

  hearts = 10;
  heartsText!: Text;

  coins = 100;
  coinsText!: Text;

  background!: Graphics;

  constructor(heartTexture: Texture, coinTexture: Texture) {
    super();
    this.heartTexture = heartTexture;
    this.coinTexture = coinTexture;
    this.setup();
    this.drawBackground();
  }

  setup() {
    this.heartIcon = new Sprite(this.heartTexture);
    this.heartIcon.position.set(20, 22);
    this.heartIcon.scale = 0.1;
    this.addChild(this.heartIcon);

    this.heartsText = new Text({
      text: String(this.hearts),
      style: {
        fontSize: 24,
        fill: 0xffffff,
        stroke: 2,
      },
    });
    this.heartsText.position.set(
      this.heartIcon.x + this.heartIcon.width + 5,
      20
    );
    this.addChild(this.heartsText);

    this.coinIcon = new Sprite(this.coinTexture);
    this.coinIcon.position.set(90, 22);
    this.coinIcon.scale = 0.1;
    this.addChild(this.coinIcon);

    this.coinsText = new Text({
      text: String(this.coins),
      style: {
        fontSize: 24,
        fill: 0xffffff,
        stroke: 2,
      },
    });
    this.coinsText.position.set(
      this.heartIcon.width + this.coinIcon.width + 70,
      20
    );
    this.addChild(this.coinsText);
  }

  drawBackground() {
    this.background = new Graphics();
    this.background
      .rect(0, 0, this.width + 40, this.height + 40)
      .fill({ color: 0x001234 });
    this.background.alpha = 0.2;
    this.addChild(this.background);
  }

  subtractHearts(damage: number) {
    this.hearts -= damage;
    this.heartsText.text = this.hearts;
  }

  subtractCoins(damage: number) {
    this.coins -= damage;
    this.coinsText.text = this.coins;
  }

  addCoins(value: number) {
    this.coins += value;
    this.coinsText.text = this.coins;
  }

  restart(): void {
    this.coins = 100;
    this.coinsText.text = this.coins;
    this.hearts = 10;
    this.heartsText.text = this.hearts;
  }
}
