import { MoveDirection, TILE_SIZE } from "Utils/GameUtils";
import { Point } from "Utils/Point";
import { GameItem } from "./GameItem";

const startSnake =
    [
        new Point(7, 5),
        new Point(7, 4),
        new Point(7, 3),
        new Point(7, 2),
    ]

export class Snake implements GameItem {
    position: Point[] = startSnake;
    context: CanvasRenderingContext2D;
    speed: number = 0.1;
    moveDirection: Point = new Point(0, 1);
    timer: NodeJS.Timer | undefined;

    constructor(context: CanvasRenderingContext2D, snakePosition?: Point[]) {
        this.context = context;
        if (snakePosition)
            this.position = snakePosition;
    }

    makeLonger() {
        this.clearDraw();
        this.position.push(new Point(10, 10)); //toDo
        this.draw();
    }

    makeFaster() {
        this.speed *= 1.25;
    }

    move() {
        this.clearDraw();
        this.position.forEach((point) => {
            point.x += this.moveDirection.x * this.speed;
            point.y += this.moveDirection.y * this.speed;
        })
        this.draw();
    }

    changeMoveDirection(direction: MoveDirection) {
        switch (direction) {
            case MoveDirection.Up: {
                this.moveDirection = new Point(0, -1);
                break;
            }
            case MoveDirection.Down: {
                this.moveDirection = new Point(0, 1);
                break;
            }
            case MoveDirection.Left: {
                this.moveDirection = new Point(-1, 0);
                break;
            }
            case MoveDirection.Right: {
                this.moveDirection = new Point(1, 0);
                break;
            }
        }
    }

    die() {
        this.clearDraw();
        this.position.shift();
        this.draw();
    }

    length() {
        return this.position.length;
    }

    draw() {
        this.context.lineWidth = TILE_SIZE;
        this.context.strokeStyle = '#7ec710';
        this.context.lineCap = 'round';
        this.context.beginPath();
        this.position.forEach((point) =>
            this.context.lineTo((point.y) * TILE_SIZE, (point.x + 0.5) * TILE_SIZE)
        );
        this.context.stroke();
    }

    clearDraw() {
        this.position.forEach((point) =>
            this.context.clearRect((point.y - 0.5) * TILE_SIZE - 1.5, (point.x) * TILE_SIZE - 1.5, TILE_SIZE + 3, TILE_SIZE + 3)
        );
    }

    start() {
        if (this.timer === undefined) {
            this.timer = setInterval(this.move.bind(this), 1000 / 60);
            this.draw();
        }
    }

    pause() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    reset() {
        this.position = startSnake;
        this.speed = 0.1;
        this.moveDirection = new Point(0, 1);
        clearInterval(this.timer);
        this.timer = undefined;
    }

    update() {
        this.move();
    }

    end() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
            this.clearDraw();
        }
    }
}