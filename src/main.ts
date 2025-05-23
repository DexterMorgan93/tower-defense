import * as Pixi from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { AssetsLoader } from "./shared/assets-loader";
import { Game } from "./game";

const app = new Pixi.Application();

async function setup() {
  await app.init({
    width: 1280,
    height: 768,
  });
  document.body.appendChild(app.canvas);
}

async function initAssets() {
  const assetsLoader = new AssetsLoader();
  await assetsLoader.initializeLoader();
}

(async () => {
  await setup();
  await initAssets();

  const game = new Game(app);
  app.stage.addChild(game);
  app.ticker.add((delta) => {
    game.handleUpdate(delta);
  });
})();

initDevtools({
  app,
});
