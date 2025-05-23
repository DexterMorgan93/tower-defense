import { Container, Graphics } from "pixi.js";
import { waypoints } from "./shared/waypoints";
import { HealthBar } from "./health-bar";

export class Enemy extends Container {
  center!: { x: number; y: number };
  waypointIndex: number = 0;
  enemyWidth = 100;
  enemyHeight = 100;
  static radius = 50;
  velocity = {
    vx: 0,
    vy: 0,
  };
  moveSpeed = 10;

  health = 100;
  healthBar!: HealthBar;

  constructor() {
    super();
    this.setup();
  }

  setup() {
    const view = new Graphics();
    this.center = {
      x: this.position.x + this.enemyWidth / 2,
      y: this.position.y + this.enemyHeight / 2,
    };
    view
      .arc(this.center.x, this.center.y, Enemy.radius, 0, Math.PI * 2)
      .fill({ color: "red" });
    this.addChild(view);

    this.healthBar = new HealthBar();
    this.healthBar.position.set(0, -15);
    this.addChild(this.healthBar);
  }

  handleUpdate() {
    const waypoint = waypoints[this.waypointIndex];
    const yDistance = waypoint.y - this.center.y;
    const xDistance = waypoint.x - this.center.x;
    const angle = Math.atan2(yDistance, xDistance);

    this.velocity.vx = Math.cos(angle) * this.moveSpeed;
    this.velocity.vy = Math.sin(angle) * this.moveSpeed;

    this.position.x += this.velocity.vx;
    this.position.y += this.velocity.vy;

    this.center = {
      x: this.position.x + this.enemyWidth / 2,
      y: this.position.y + this.enemyHeight / 2,
    };

    const distance = Math.hypot(
      waypoint.y - this.center.y,
      waypoint.x - this.center.x
    );
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
