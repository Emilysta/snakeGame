import { Point } from "Utils/Point";
import { Apple } from "./Apple";
import { Bombs } from "./Bombs";
import { Snake } from "./Snake";

export class Game {
    apple: Apple;
    bombs: Bombs;
    snake: Snake;

    constructor(context: CanvasRenderingContext2D) {
        this.apple = new Apple(context);
        this.bombs = new Bombs(context);
        this.snake = new Snake(context);
        this.drawInitialGame();
        this.startGame();
    }

    drawInitialGame() {
        this.apple.draw();
        this.snake.draw();
        this.bombs.draw();
    }

    stopGame() {
        this.apple.stop();
        this.snake.stop();
        this.bombs.stop();
    }

    startGame() {
        // this.apple.start();
        this.snake.start();
        this.bombs.start();
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
}