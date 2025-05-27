import { AnimatedSprite, Texture } from "pixi.js";
import { waypoints } from "./shared/waypoints";
import { HealthBar } from "./health-bar";

export class Enemy extends AnimatedSprite {
  waypointIndex: number = 0;
  enemyWidth = 100;
  enemyHeight = 100;
  static radius = 50;
  velocity = {
    vx: 0,
    vy: 0,
  };
  moveSpeed = 30;

  health = 100;
  healthBar!: HealthBar;

  texturesOrc: Texture[];

  constructor(textures: Texture[]) {
    super(textures);
    this.texturesOrc = textures;
    this.anchor.set(0.5, 0.5);
    this.setup();
  }

  setup() {
    this.animationSpeed = 0.5;
    this.play();

    this.healthBar = new HealthBar();
    this.healthBar.position.set(-this.healthBar.width / 2, -55);
    this.addChild(this.healthBar);
  }

  handleUpdate() {
    const waypoint = waypoints[this.waypointIndex];
    const yDistance = waypoint.y - this.y;
    const xDistance = waypoint.x - this.x;
    const angle = Math.atan2(yDistance, xDistance);

    this.velocity.vx = Math.cos(angle) * this.moveSpeed;
    this.velocity.vy = Math.sin(angle) * this.moveSpeed;

    this.position.x += this.velocity.vx;
    this.position.y += this.velocity.vy;

    const distance = Math.hypot(waypoint.y - this.y, waypoint.x - this.x);
    if (
      distance < this.moveSpeed &&
      this.waypointIndex < waypoints.length - 1
    ) {
      this.waypointIndex++;
    }
  }

  subtractHealth(damage: number) {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
    }
    this.healthBar.setHealth(this.health / 100);
  }

  isDead(): boolean {
    return this.health <= 0;
  }
}
