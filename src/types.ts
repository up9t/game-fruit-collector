export type TReady = {
  player: boolean;
  fruit: boolean;
};

export type TTextOptions = {
  color?: string;
  size?: number;
  x?: number;
  y?: number;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
};

export interface IDrawable {
  imageId: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface IMoveGravity {
  elapsedTime: number;
}

export interface IPlayer extends IDrawable {
  positionY: number;
  width: number;
  height: number;
  columnIndex: number;
}
