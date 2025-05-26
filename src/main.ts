import { AssetsLoader } from "./shared/assets-loader";
import { SceneManager } from "./scene-manager";
import { StartModal } from "./start-modal";

async function initAssets() {
  const assetsLoader = new AssetsLoader();
  await assetsLoader.initializeLoader();
}

async function run(): Promise<void> {
  await SceneManager.initialize();
  await initAssets();

  await SceneManager.changeScene(new StartModal());
}

run();
