import { Container, Graphics } from "pixi.js";
import { waypoints } from "./shared/waypoints";
import { HealthBar } from "./health-bar";

export class Enemy extends Container {
  center!: { x: number; y: number };
  waypointIndex: number = 0;
  enemyWidth = 100;
  enemyHeight = 100;
  radius = 50;

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
      .arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
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

    this.position.x += Math.cos(angle);
    this.position.y += Math.sin(angle);
    this.center = {
      x: this.position.x + this.enemyWidth / 2,
      y: this.position.y + this.enemyHeight / 2,
    };

    if (
      Math.round(this.center.x) === Math.round(waypoint.x) &&
      Math.round(this.center.y) === Math.round(waypoint.y) &&
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
