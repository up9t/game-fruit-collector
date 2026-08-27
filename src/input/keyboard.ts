import type Game from "../game.ts";

export function InitKeyboardInput(game: Game) {
  addEventListener("keydown", (event) => {
    switch (event.key) {
      case "a":
      case "A":
      case "ArrowLeft":
        game.moveLeft();
        break;
      case "d":
      case "D":
      case "ArrowRight":
        game.moveRight();
        break;
      default:
        break;
    }
  });
}
