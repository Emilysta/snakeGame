import { MoveDirection } from "Utils/GameUtils";
import { Point } from "Utils/Point";
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
    gameStatus: GameStatus;
    gameStatusChanged: (currentGameStatus: GameStatus) => void;

    constructor(context: CanvasRenderingContext2D, gameStatusChanged: (currentGameStatus: GameStatus) => void) {
        this.apple = new Apple(context);
        this.bombs = new Bombs(context);
        this.snake = new Snake(context);
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
            this.apple.start();
            this.snake.start();
            this.bombs.start();
            this.timer = setInterval(this.updateGameLoop.bind(this), 1000 / 60);
            this.gameStatus.isPlaying = true;
            this.gameStatus.isPaused = false;
            if (withCallbackOfResume) {
                this.gameStatusChanged(this.gameStatus);
            }
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
        clearInterval(this.timer);
        this.timer = undefined;
        this.apple.reset();
        this.snake.reset();
        this.bombs.reset();
        this.context.clearRect(0, 0, 1024, 1024)
        this.startGame();
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

    checkColision() {
        if (this.checkCollisionWithApple()) return;
        if (this.checkCollisionWithBomb()) return;
        if (this.checkCollisionWithSelf()) return;
        if (this.checkCollisionWithBoardEnd()) return;
    }

    checkCollisionWithApple() {
        const snakeHead = this.snake.position[0];
        const applePosiion = this.apple.position;
        if (this.checkTwoPointsCollision(snakeHead, applePosiion)) {
            this.snake.makeLonger();
            this.apple.setIsChangePositionExpected(true);
            this.gameStatus.score += 1;
            this.gameStatusChanged(this.gameStatus);
            return true;
        }
        return false;
    }

    checkCollisionWithBomb() {
        const snakeHead = this.snake.position[0];
        return !this.bombs.positions.every(bombPosition => {
            if (this.checkTwoPointsCollision(snakeHead, bombPosition)) {
                this.endGame();
                return false;
            }
            return true;
        });
    }

    checkCollisionWithSelf() {
        const snakeHead = this.snake.position[0];
        const sliced = this.snake.position.slice(2);
        return !sliced.every(point => {
            if (this.checkTwoPointsCollision(snakeHead, point)) {
                this.endGame();
                return false;
            }
            return true;
        });
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

    checkTwoPointsCollision(point1: Point, point2: Point) {
        if (point1.x !== point2.x)
            return false;
        if (point1.y !== point2.y)
            return false;
        return true;
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