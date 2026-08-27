export const GameResult = {
  NONE: 0,
  LOSE: 1,
  WIN: 2,
  PERFECT: 3,
};

export class GameOverEvent extends CustomEvent<(typeof GameResult)[keyof typeof GameResult]> {
  public static EVENT_NAME = "game:over" as const;

  public constructor(result: (typeof GameResult)[keyof typeof GameResult]) {
    super(GameOverEvent.EVENT_NAME, {
      detail: result,
    });
  }
}
