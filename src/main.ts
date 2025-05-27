import { LoaderModal } from "./loader-modal";
import { SceneManager } from "./scene-manager";
import { delay } from "./shared/lib/delay";
import { StartModal } from "./start-modal";

async function run(): Promise<void> {
  await SceneManager.initialize();

  const loaderModal = new LoaderModal();
  await SceneManager.changeScene(loaderModal);
  await loaderModal.initializeLoader();

  await delay(1000);
  await SceneManager.changeScene(new StartModal());
}

run();
