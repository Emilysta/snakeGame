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
        console.log("Reset Game invoked")
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
        //this.checkColision();
        this.context.clearRect(0, 0, 1024, 1024);
        this.apple.update();
        this.snake.update();
        this.bombs.update();
    }

    endGame() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
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
        if (this.checkColision(snakeHead)) {
            return;
        }
        const snakeHeadFloor = new Point(Math.floor(snakeHead.x), Math.floor(snakeHead.y))
        this.board[snakeHeadFloor.y][snakeHeadFloor.x] = BoardTile.Snake;
        delete this.freeSpace[snakeHeadFloor.toString()];

        this.board[previous.y][previous.x] = BoardTile.Empty;

        this.freeSpace[previous.toString()] = previous;
    }

    checkColision(snakeHead: Point) {
        if (this.checkCollisionWithBoardEnd(snakeHead))
            return true;
        const boardTile = this.board[Math.floor(snakeHead.y)][Math.floor(snakeHead.x)];

        if (boardTile !== BoardTile.Empty) {
            console.log(boardTile);
            if (boardTile === BoardTile.Apple) {
                console.log(boardTile)
                this.apple.setIsChangePositionExpected(true);
                this.gameStatus.score += 1;
                this.gameStatusChanged(this.gameStatus);
                this.snake.makeLonger();
                return false;
            }

            if (boardTile === BoardTile.Bomb || boardTile === BoardTile.Snake) {
                console.log(JSON.stringify(this.board));
                console.log("End")
                this.endGame();
                return true;
            }
        }
        return false;
    }

    checkCollisionWithBoardEnd(snakeHead: Point) {

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