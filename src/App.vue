<script setup lang="ts">
import { onMounted, ref, render } from "vue";
import CanvasRenderer from "./renderer.ts";
import Game from "./game";
import Settings from "./settings";
import { GameOverEvent } from "./events/game.ts";
import Basket from "./entities/basket.ts";
import { InitKeyboardInput } from "./input/keyboard.ts";
import playerSrc from "./assets/images/cart.png";
import fruitSrc from "./assets/images/fruit.png";

const canvasElementRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const canvasElement = canvasElementRef.value;
  if (!canvasElement) throw new Error("failed to get canvas element");

  const context = canvasElement.getContext("2d");
  if (!context) throw new Error("failed to retrieve rendering context");

  const playerImage = new Image();
  const fruitImage = new Image();

  playerImage.src = playerSrc;
  fruitImage.src = fruitSrc;

  canvasElement.width = Settings.CANVAS_WIDTH;
  canvasElement.height = Settings.CANVAS_HEIGHT;

  const player = new Basket(
    Math.floor(Settings.COLUMN / 2),
    canvasElement.clientHeight - canvasElement.clientHeight / 10,
    Settings.COLUMN_WIDTH - 30,
    30,
  );

  const assetManager = new Map<string, HTMLImageElement>();
  const renderer = new CanvasRenderer(canvasElement, assetManager);

  assetManager.set(playerSrc, playerImage);
  assetManager.set(fruitSrc, fruitImage);

  const game = new Game(player, Settings.COLUMN, Settings.CANVAS_HEIGHT);

  InitKeyboardInput(game);

  // start only when the image was loaded
  let hasStarted = false;
  let readyCount = 0;
  const start = () => {
    ++readyCount;
    if (!hasStarted && readyCount >= assetManager.size) {
      hasStarted = true;
      console.log("asdasd");
      // game.Ready then 3 seconds countdown game.onStart()
      const countdown = 3;
      let intervalID: number | undefined;

      setTimeout(() => {
        renderer.hasStarted = true;
        game.start();
        clearInterval(intervalID);
      }, countdown * 1000);

      let j = countdown;

      renderer.countdown = j--;
      intervalID = setInterval(() => {
        renderer.countdown = j--;
      }, 1000);
    }
  };

  let startId: number | undefined;
  let lastTime: number = 0;
  let gameOver = false;

  game.addEventListener(GameOverEvent.EVENT_NAME, (event) => {
    // play sound or something
    gameOver = true;
    return;
  });

  const loop = (currentTime: number) => {
    if (gameOver && typeof startId === "number") {
      cancelAnimationFrame(startId);
      return;
    }

    if (lastTime === 0) {
      lastTime = performance.now();
    }

    game.update((currentTime - lastTime) / 1000);
    renderer.render(game.getState());

    lastTime = currentTime;

    startId = requestAnimationFrame(loop);
  };

  startId = requestAnimationFrame(loop);

  assetManager.forEach((img) => {
    if (img.complete) {
      start();
    } else {
      img.addEventListener("load", start);
    }
  });
});
</script>

<template>
  <canvas ref="canvasElementRef"></canvas>
</template>

<style scoped>
canvas {
  background-color: #242424;
}
</style>
