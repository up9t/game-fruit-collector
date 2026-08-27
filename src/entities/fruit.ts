import type { IDrawable, IMoveGravity } from "../types.ts";
import fruitSrc from "../assets/images/fruit.png";
import Settings from "../settings.ts";

export const FruitStatus = {
  LIVE: 1,
  COLLECTED: 2,
  OUT: 3,
};

export interface IFruit extends IDrawable, IMoveGravity {
  columnIndex: number;
  positionY: number;
  width: number;
  height: number;
  status: (typeof FruitStatus)[keyof typeof FruitStatus];
}

export default class Fruit implements IFruit {
  public readonly imageId: string = fruitSrc;
  public elapsedTime: number = 0;
  public status: (typeof FruitStatus)[keyof typeof FruitStatus] = FruitStatus.LIVE;

  public constructor(
    public columnIndex: number = 0,
    public positionY: number = 0,
    public width: number = 60,
    public height: number = 60,
  ) {}

  public get x() {
    return this.columnIndex * Settings.COLUMN_WIDTH + Settings.COLUMN_WIDTH / 2 - this.width / 2;
  }
  public get y() {
    return this.positionY;
  }
}
