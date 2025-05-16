import { Container, Graphics } from "pixi.js";
import { waypoints } from "./shared/waypoints";

export class Enemy extends Container {
  center!: { x: number; y: number };
  waypointIndex: number = 0;

  constructor() {
    super();
    this.setup();
  }

  setup() {
    const view = new Graphics();
    view.rect(0, 0, 100, 100).fill({ color: "red" });
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.addChild(view);
  }

  handleUpdate() {
    const waypoint = waypoints[this.waypointIndex];
    const yDistance = waypoint.y - this.center.y;
    const xDistance = waypoint.x - this.center.x;
    const angle = Math.atan2(yDistance, xDistance);

    this.position.x += Math.cos(angle);
    this.position.y += Math.sin(angle);
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };

    if (
      Math.round(this.center.x) === Math.round(waypoint.x) &&
      Math.round(this.center.y) === Math.round(waypoint.y) &&
      this.waypointIndex < waypoints.length - 1
    ) {
      this.waypointIndex++;
    }
  }
}
