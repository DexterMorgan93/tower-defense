import { SceneManager } from "./scene-manager";
import { StartModal } from "./start-modal";

async function run(): Promise<void> {
  await SceneManager.initialize();

  const startModal = new StartModal();
  await startModal.initializeLoader();

  const {
    backgroundTexture,
    spritesheet: { textures, animations },
  } = startModal.getAssets();

  console.log(textures, animations, backgroundTexture);

  await SceneManager.changeScene(startModal);
}

run();
