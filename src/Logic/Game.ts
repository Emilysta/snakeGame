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

    startGame(withCallbackOfResume: boolean = false) {
        if (this.timer === undefined) {
            this.setupBoard();
            this.gameStatus.isPlaying = true;
            this.gameStatus.isPaused = false;
            if (withCallbackOfResume) {
                this.gameStatusChanged(this.gameStatus);
            }
            this.apple.start();
            this.snake.start();
            this.bombs.start();
            this.timer = setInterval(this.updateGameLoop.bind(this), 1000 / 60);
        }
    }

    pauseGame() {
        if (this.timer !== undefined) {
            this.gameStatus.isPaused = true;
            this.gameStatusChanged(this.gameStatus);
            this.apple.pause();
            this.snake.pause();
            this.bombs.pause();
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    resetGame() {
        this.gameStatus.isEnd = false;
        this.gameStatus.isPlaying = false;
        this.gameStatus.isPaused = false;
        this.gameStatus.score = 0;

        clearInterval(this.timer);
        this.timer = undefined;
        this.apple.reset();
        this.snake.reset();
        this.bombs.reset();
        this.context.clearRect(0, 0, 1024, 1024)
        this.startGame(true);
    }

    updateGameLoop() {
        this.context.clearRect(0, 0, 1024, 1024);
        this.apple.update();
        this.snake.update();
        this.bombs.update();

        this.checkColision();
    }

    endGame() {
        if (this.timer !== undefined) {
            this.gameStatus.isEnd = true;
            this.gameStatusChanged(this.gameStatus);
            clearInterval(this.timer);
            this.timer = undefined;
            this.context.clearRect(0, 0, 1024, 1024);
        }
    }

    setupBoard() {
        this.board = Array.from(Array(20), () => new Array(20).fill(BoardTile.Empty))

        const apple = this.apple.position;
        this.board[apple.x][apple.y] = BoardTile.Apple;

        this.snake.position.forEach(pos => {
            this.board[pos.y][pos.x] = BoardTile.Snake;
        });
        console.log(this.board);
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
            this.board[previous.x][previous.y] = BoardTile.Empty;
            this.freeSpace[previous.toString()] = previous;
        }
        const keys = Object.keys(this.freeSpace);
        const index = RandomInt.getRandomIntOnInterval(0, keys.length - 1);

        const newPos = this.freeSpace[keys[index]];
        this.board[newPos.x][newPos.y] = type;
        delete this.freeSpace[newPos.toString()];
        return newPos;
    }

    snakeOnFullTile(previous: Point) {
        const snakeHead = this.snake.position[0];
        this.board[Math.floor(snakeHead.y)][Math.floor(snakeHead.x)] = BoardTile.Snake;
        delete this.freeSpace[snakeHead.toString()];
        // console.log(JSON.stringify(this.snake.position));
        // console.log(previous);
        this.board[previous.x][previous.y] = BoardTile.Empty;
        // console.log(JSON.stringify(this.board));
        this.freeSpace[previous.toString()] = previous;
        //console.log(this.board);
    }

    checkColision() {
        const snakeHead = this.snake.position[0];
        if (this.checkCollisionWithBoardEnd()) return;
        const boardTile = this.board[Math.floor(snakeHead.x)][Math.floor(snakeHead.y)];

        if (boardTile !== BoardTile.Empty) {
            if (boardTile === BoardTile.Apple) {
                console.log(boardTile)
                this.apple.setIsChangePositionExpected(true);
                this.gameStatus.score += 1;
                this.gameStatusChanged(this.gameStatus);
                this.snake.makeLonger();
            }

            if (boardTile === (BoardTile.Bomb || BoardTile.Snake)) {
                this.endGame();
            }
        }
    }

    checkCollisionWithBoardEnd() {
        const snakeHead = this.snake.position[0];
        if (snakeHead.x < 0 || snakeHead.y < 0) {
            this.endGame();
            return true;
        }
        if (snakeHead.x > 19 || snakeHead.y > 19) {
            this.endGame();
            return true;
        }
        return false;
    }

    reactToUserInput(key: string) {
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
            case "Escape": {
                this.gameStatus.isPaused = !this.gameStatus.isPaused;
                if (this.gameStatus.isPaused) this.startGame(true);
                else this.pauseGame();
                break;
            }
        }
    }
}