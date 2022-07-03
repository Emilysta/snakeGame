import { BoardTile, MoveDirection } from "Utils/GameUtils";
import { Point } from "Utils/Point";
import { RandomInt } from "Utils/RandomInt";
import { Apple } from "./Apple";
import { Bombs } from "./Bombs";
import { Snake } from "./Snake";

export type GameStatus = {
    isPlaying: boolean,
    isPaused: boolean,
    isEnd: boolean,
    score: number,
}

export class Game {
    apple: Apple;
    bombs: Bombs;
    snake: Snake;
    timer: NodeJS.Timer | undefined;
    context: CanvasRenderingContext2D;
    board: BoardTile[][] = [];
    freeSpace: { [name: string]: Point } = {};
    gameStatus: GameStatus;

    gameStatusChanged: (currentGameStatus: GameStatus) => void;

    constructor(context: CanvasRenderingContext2D, gameStatusChanged: (currentGameStatus: GameStatus) => void) {
        this.apple = new Apple(context, this.getFreeRandomPosition.bind(this));
        this.bombs = new Bombs(context, this.getFreeRandomPosition.bind(this));
        this.snake = new Snake(context, this.snakeOnFullTile.bind(this));
        this.context = context;
        this.gameStatusChanged = gameStatusChanged;
        this.gameStatus = {
            isPlaying: false,
            isPaused: false,
            isEnd: false,
            score: 0,
        }

    }

    startGame(isAsContinue: boolean = false) {
        if (this.timer === undefined) {
            this.gameStatus.isPlaying = true;
            this.gameStatus.isPaused = false;
            this.gameStatusChanged(this.gameStatus);
            if (!isAsContinue) {
                this.setupBoard();
            }
            this.apple.draw();
            this.snake.draw();
            this.bombs.draw();
            this.timer = setInterval(this.updateGameLoop.bind(this), 1000 / 60);
        }
    }

    pauseGame() {
        if (this.timer !== undefined) {
            this.gameStatus.isPaused = true;
            this.gameStatusChanged(this.gameStatus);
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    resetGame() {
        this.apple = new Apple(this.context, this.getFreeRandomPosition.bind(this));
        this.bombs = new Bombs(this.context, this.getFreeRandomPosition.bind(this));
        this.snake = new Snake(this.context, this.snakeOnFullTile.bind(this));
        this.gameStatus = {
            isPlaying: false,
            isPaused: false,
            isEnd: false,
            score: 0,
        }
        this.board = [];
        this.freeSpace = {};
        this.context.clearRect(0, 0, 1024, 1024);
        this.startGame();
    }

    updateGameLoop() {
        this.context.clearRect(0, 0, 1024, 1024);
        this.apple.update();
        this.snake.update();
        this.bombs.update();
    }

    endGame() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
            this.gameStatus.isPlaying = false;
            this.gameStatus.isPaused = false;
            this.gameStatus.isEnd = true;
            this.gameStatusChanged(this.gameStatus);
        }
    }

    setupBoard() {
        this.board = Array.from(new Array(20), () => new Array(20).fill(BoardTile.Empty))

        const apple = this.apple.position;
        this.board[apple.y][apple.x] = BoardTile.Apple;

        this.snake.position.forEach(pos => {
            this.board[pos.y][pos.x] = BoardTile.Snake;
        });

        const space: { [name: string]: Point } = {};
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < 20; j++)
                if (this.board[i][j] === BoardTile.Empty) {
                    const point = new Point(i, j);
                    space[point.toString()] = point;
                }
        }
        this.freeSpace = space;
    }

    getFreeRandomPosition(type: BoardTile, previous?: Point, deletePrevious?: boolean) {
        if (deletePrevious && previous) {
            this.board[previous.y][previous.x] = BoardTile.Empty;
            this.freeSpace[previous.toString()] = previous;
        }
        const keys = Object.keys(this.freeSpace);
        const index = RandomInt.getRandomIntOnInterval(0, keys.length - 1);

        const newPos = this.freeSpace[keys[index]];
        this.board[newPos.y][newPos.x] = type;
        delete this.freeSpace[newPos.toString()];
        return newPos;
    }

    snakeOnFullTile(previous: Point) {
        const snakeHead = this.snake.position[0];
        if (this.checkColision(snakeHead))
            return;
        const snakeHeadFloor = new Point(Math.floor(snakeHead.x), Math.floor(snakeHead.y))
        this.board[snakeHeadFloor.y][snakeHeadFloor.x] = BoardTile.Snake;
        delete this.freeSpace[snakeHeadFloor.toString()];

        this.board[previous.y][previous.x] = BoardTile.Empty;

        this.freeSpace[previous.toString()] = previous;
    }

    checkColision(snakeHead: Point) {
        if (this.checkCollisionWithBoardEnd(snakeHead) || this.checkCollisionWithSelf(snakeHead)) {
            this.endGame();
            return true;
        }
        const boardTile = this.board[Math.floor(snakeHead.y)][Math.floor(snakeHead.x)];

        if (boardTile !== BoardTile.Empty && boardTile !== BoardTile.Snake) {
            if (boardTile === BoardTile.Apple) {
                this.apple.setIsChangePositionExpected();
                this.gameStatus.score += 1;
                this.gameStatusChanged(this.gameStatus);
                this.snake.makeLonger();
                return false;
            }
            if (boardTile === BoardTile.Bomb) {
                this.endGame();
                return true;
            }
        }
        return false;
    }

    checkCollisionWithBoardEnd(snakeHead: Point) {

        if (snakeHead.x < 0 || snakeHead.y < 0) {
            return true;
        }
        if (snakeHead.x > 19 || snakeHead.y > 19) {
            return true;
        }
        return false;
    }

    checkCollisionWithSelf(snakeHead: Point) {
        const snakeTail = this.snake.position.slice(2);
        return !snakeTail.every(snakeElement => {
            if (this.checkTwoPointsCollision(snakeHead, snakeElement))
                return false;
            return true
        });
    }

    checkTwoPointsCollision(point1: Point, point2: Point) {
        if (point1.x !== point2.x)
            return false;
        if (point1.y !== point2.y)
            return false;
        return true;
    }

    reactToUserInput(key: string) {
        if (this.gameStatus.isPlaying) {
            switch (key) {
                case "ArrowDown": {
                    this.snake.changeMoveDirection(MoveDirection.Down);
                    break;
                }
                case "ArrowUp": {
                    this.snake.changeMoveDirection(MoveDirection.Up);
                    break;
                }
                case "ArrowLeft": {
                    this.snake.changeMoveDirection(MoveDirection.Left);
                    break;
                }
                case "ArrowRight": {
                    this.snake.changeMoveDirection(MoveDirection.Right);
                    break;
                }
                case "p": {
                    if (this.gameStatus.isPaused)
                        this.startGame(true);
                    else
                        this.pauseGame();
                    break;
                }
            }
        }
    }
}