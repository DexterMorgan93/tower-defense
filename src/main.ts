import { LoaderModal } from "./loader-modal";
import { SceneManager } from "./scene-manager";

async function run(): Promise<void> {
  await SceneManager.initialize();

  const loaderModal = new LoaderModal();
  await SceneManager.changeScene(loaderModal);
  await loaderModal.initializeLoader();
}

run();
