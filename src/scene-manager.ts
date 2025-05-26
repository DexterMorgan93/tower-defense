import { initDevtools } from "@pixi/devtools";
import { Application, Container, Ticker } from "pixi.js";

export class DefaultScene extends Container {
  handleUpdate(deltaMS: Ticker): void {}
}

export class SceneManager {
  constructor() {}

  static app: Application;

  static currentScene = new DefaultScene();

  static async initialize(): Promise<void> {
    const app = new Application();
    await app.init({
      width: 1280,
      height: 768,
    });
    document.body.appendChild(app.canvas);

    SceneManager.app = app;
    SceneManager.app.ticker.add(SceneManager.updateHandler);

    initDevtools({
      app,
    });
  }

  static async changeScene(newScene: DefaultScene): Promise<void> {
    SceneManager.app.stage.removeChild(SceneManager.currentScene);
    SceneManager.currentScene.destroy();

    if (SceneManager.currentScene !== newScene) {
      SceneManager.currentScene = newScene;
    }
    SceneManager.app.stage.addChild(SceneManager.currentScene);
  }

  static updateHandler() {
    SceneManager.currentScene.handleUpdate(SceneManager.app.ticker);
  }
}
