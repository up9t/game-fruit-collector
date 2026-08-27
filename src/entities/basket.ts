import type { IPlayer } from "../types.ts";
import playerSrc from "../assets/images/cart.png";
import Settings from "../settings.ts";

export default class Basket implements IPlayer {
  public readonly imageId: string = playerSrc;

  public constructor(
    public columnIndex: number = 0,
    public positionY: number,
    public width: number,
    public height: number,
  ) {}

  public get x() {
    return this.columnIndex * Settings.COLUMN_WIDTH + Settings.COLUMN_WIDTH / 2 - this.width / 2;
  }
  public get y() {
    return this.positionY;
  }
}
