import { Point } from "Utils/Point";
import { Apple } from "./Apple";
import { Bombs } from "./Bombs";
import { Snake } from "./Snake";

export class Game {
    apple: Apple;
    bombs: Bombs;
    snake: Snake;
    timer: NodeJS.Timer | undefined;
    context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.apple = new Apple(context);
        this.bombs = new Bombs(context);
        this.snake = new Snake(context);
        this.context = context;
    }

    startGame() {
        if (this.timer === undefined) {
            this.apple.start();
            this.snake.start();
            this.bombs.start();
            this.timer = setInterval(this.updateGameLoop.bind(this), 1000 / 60);
        }
    }

    pauseGame() {
        if (this.timer !== undefined) {
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
    }

    checkColision() {
        this.checkCollisionWithApple();
        this.checkCollisionWithBomb();
        this.checkCollisionWithSelf();
        this.checkCollisionWithBoardEnd();
    }

    checkCollisionWithApple() {
        const snakeHead = this.snake.position[0];
        const applePosiion = this.apple.position;
        if (this.checkTwoPointsCollision(snakeHead, applePosiion))
            this.snake.makeLonger();
    }

    checkCollisionWithBomb() {
        const snakeHead = this.snake.position[0];
        this.bombs.positions.forEach(bombPosition => {
            if (this.checkTwoPointsCollision(snakeHead, bombPosition)) {
                this.endGame();
                return;
            }
        });
    }

    checkCollisionWithSelf() {

    }

    checkCollisionWithBoardEnd() {

    }

    checkTwoPointsCollision(point1: Point, point2: Point) {
        if (point1.x !== point2.x)
            return false;
        if (point1.y !== point2.y)
            return false;
        return true;
    }

    updateGameLoop() {
        this.apple.update();
        this.snake.update();
        this.bombs.update();

        this.checkColision();
    }

    endGame() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
            this.apple.end();
            this.snake.end();
            this.bombs.end();
        }
    }
}