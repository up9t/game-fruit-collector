import { GameResult } from "./events/game.ts";
import type { GameState } from "./game.ts";
import type { TTextOptions } from "./types";

export default class CanvasRenderer {
  public context: CanvasRenderingContext2D;
  public countdown = 3;
  public hasStarted = false;

  public constructor(
    public canvasElement: HTMLCanvasElement,
    private assetManager: Map<string, HTMLImageElement>,
  ) {
    this.context = canvasElement.getContext("2d") as CanvasRenderingContext2D;
  }

  public clear(): void {
    this.context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  public render(state: GameState) {
    this.clear();

    this.insertText(`Scores : ${state.score}`, { y: 0, textBaseline: "top", size: 20 });

    if (state.result !== GameResult.NONE) {
      let message = "Game Over!"; // lose by default

      if (state.result === GameResult.WIN) {
        message = "You Win!";
      }

      if (state.result === GameResult.PERFECT) {
        message = "Amazing Win!";
      }

      this.insertText(message, { size: 40 });
    } else if (!this.hasStarted) {
      this.insertText(this.countdown.toString(), { size: 200 });
    } else {
      this.insertText(`Lives : ${state.lives}`, { size: 20 });
    }

    state.entities.forEach((entity) => {
      if (this.assetManager.has(entity.imageId)) {
        this.context.drawImage(
          this.assetManager.get(entity.imageId)!,
          entity.x,
          entity.y,
          entity.width,
          entity.height,
        );
      }
    });
  }

  public insertText(text: string, options: TTextOptions = {}): TextMetrics {
    const opts: Required<TTextOptions> = Object.assign(
      {
        color: "white",
        size: 20,
        textAlign: "center",
        textBaseline: "middle",
        x: this.canvasElement.width / 2,
        y: this.canvasElement.height / 2,
      },
      options,
    );

    this.context.save();
    this.context.font = `${options.size}px Arial`;

    this.context.textAlign = opts.textAlign;
    this.context.textBaseline = opts.textBaseline;

    const textMeasure = this.context.measureText(text);

    this.context.fillStyle = opts.color;
    this.context.fillText(text, opts.x, opts.y, textMeasure.width);
    this.context.restore();

    return textMeasure;
  }
}
