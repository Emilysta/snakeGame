export const BOARD_SIZE = 1024;
export const TILE_SIZE = BOARD_SIZE / 20;
export const SNAKE_STEP = 0.1;

export enum MoveDirection {
    Up,
    Down,
    Left,
    Right,
}

export enum BoardTile {
    Empty,
    Snake,
    Apple,
    Bomb
}