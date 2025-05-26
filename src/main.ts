import { AssetsLoader } from "./shared/assets-loader";
import { Game } from "./game";
import { SceneManager } from "./scene-manager";

async function initAssets() {
  const assetsLoader = new AssetsLoader();
  await assetsLoader.initializeLoader();
}

async function run(): Promise<void> {
  await SceneManager.initialize();
  await initAssets();

  await SceneManager.changeScene(new Game(SceneManager.app));
}

run();

// initDevtools({
//   app,
// });
