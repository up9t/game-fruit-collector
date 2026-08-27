import Fruit, { FruitStatus, type IFruit } from "./entities/fruit";
import { GameOverEvent, GameResult } from "./events/game.ts";
import Settings from "./settings";
import type { IDrawable, IMoveGravity, IPlayer } from "./types.ts";
import { getRandIntN } from "./utils.ts";

export interface GameEventMap {
  [GameOverEvent.EVENT_NAME]: GameOverEvent;
}

export interface GameState {
  entities: IDrawable[];
  lives: number;
  score: number;
  result: (typeof GameResult)[keyof typeof GameResult];
}

export default class Game extends EventTarget {
  // private lives: number = Settings.START_LIVES_DEFAULT;
  private lives = new Proxy(
    { value: Settings.START_LIVES_DEFAULT },
    {
      set: (target, p, newValue, receiver) => {
        const numericValue = newValue as number;
        const clampedValue = Math.max(0, numericValue);

        const ok = Reflect.set(target, p, clampedValue, receiver);

        if (numericValue <= 0) {
          this.gameOver(GameResult.LOSE);
        }

        return ok;
      },
    },
  );

  private score: number = Settings.START_SCORE_DEFAULT;
  private readonly fruits: IFruit[] = [];
  private spawnerId?: number;
  private result: (typeof GameResult)[keyof typeof GameResult] = GameResult.NONE;

  public constructor(
    private readonly player: IPlayer,
    private readonly column: number,
    private readonly height: number,
  ) {
    super();
  }

  override addEventListener<K extends keyof GameEventMap>(
    type: K,
    callback: (event: GameEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;
  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ): void;

  override addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void {
    super.addEventListener(type, callback, options);
  }

  public update(deltaTime: number): void {
    if (this.isWin()) {
      const isPerfect: boolean = this.isPerfectWin();

      this.gameOver(isPerfect ? GameResult.PERFECT : GameResult.WIN);
      return;
    }

    this.fruits.forEach((fruit) => {
      fruit.positionY += this.moveByGravity(fruit, deltaTime);

      const inAreaX = fruit.columnIndex === this.player.columnIndex;

      const inAreaY =
        fruit.positionY + fruit.height / 2 >= this.player.positionY &&
        fruit.positionY < this.player.positionY + fruit.height / 2;

      const insideCart = inAreaX && inAreaY;
      const insideVoid = fruit.positionY >= this.height;

      console.log(insideCart, insideVoid, this.height);
      if (insideCart && fruit.status === FruitStatus.LIVE) {
        fruit.status = FruitStatus.COLLECTED;
        this.score += Settings.SCORE_INCREMENT;
      }

      if (insideVoid && fruit.status === FruitStatus.LIVE) {
        fruit.status = FruitStatus.OUT;
        this.lives.value--;
      }
    });
  }

  public start() {
    this.spawnerId = setInterval(() => {
      if (this.fruits.length >= Settings.MAX_FRUIT_SPAWN) {
        clearInterval(this.spawnerId);
        return;
      }

      this.fruits.push(this.createFruit());
    }, Settings.FRUIT_SPAWN_TIME);
  }

  public isWin(): boolean {
    return (
      this.fruits.length === Settings.MAX_FRUIT_SPAWN &&
      (this.fruits[this.fruits.length - 1]!.positionY > this.height ||
        this.fruits[this.fruits.length - 1]!.status === FruitStatus.COLLECTED)
    );
  }

  public isPerfectWin(): boolean {
    return this.isWin() && this.fruits.every((fruit) => fruit.status === FruitStatus.COLLECTED);
  }

  private moveByGravity(entitiy: IMoveGravity, deltaTime: number): number {
    entitiy.elapsedTime += deltaTime;

    return Settings.GRAVITY * entitiy.elapsedTime ** 2;
  }

  public moveLeft(): void {
    this.player.columnIndex = Math.max(this.player.columnIndex - 1, 0);
  }

  public moveRight(): void {
    this.player.columnIndex = Math.min(this.player.columnIndex + 1, this.column - 1);
  }

  public createFruit(): IFruit {
    const fruit = new Fruit(
      getRandIntN(0, this.column),
      0,
      //  * (this.player.positionX - this.player.width / (Settings.COLUMN - 1)),
    );

    return fruit;
  }

  private gameOver(result: (typeof GameResult)[keyof typeof GameResult]) {
    this.result = result;
    this.dispatchEvent(new GameOverEvent(result));
  }

  public getState(): GameState {
    return {
      lives: this.lives.value,
      score: this.score,
      result: this.result,
      entities: [...this.fruits.filter((fruit) => fruit.status === FruitStatus.LIVE), this.player],
    };
  }
}
