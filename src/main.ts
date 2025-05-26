import { SceneManager } from "./scene-manager";
import { StartModal } from "./start-modal";

async function run(): Promise<void> {
  await SceneManager.initialize();

  const startModal = new StartModal();
  await startModal.initializeLoader();

  await SceneManager.changeScene(startModal);
}

run();
