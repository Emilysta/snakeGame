import { Point } from "Utils/Point";
import { GameItem } from "./GameItem";

const startSnake =
    [
        new Point(7, 5),
        new Point(7, 4),
        new Point(7, 3),
        new Point(7, 2),
    ]

const SIZE = 1024 / 20;

export class Snake implements GameItem {
    position: Point[];
    context: CanvasRenderingContext2D;
    speed: number = 0.1;
    moveDirection: Point = new Point(0, 1);
    timer: NodeJS.Timer | undefined;

    constructor(context: CanvasRenderingContext2D, snakePosition: Point[] = startSnake) {
        this.context = context;
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
        console.log(this.position);
        console.log(this.moveDirection);
        this.clearDraw();
        this.position.forEach((point) => {
            point.x += this.moveDirection.x * this.speed;
            point.y += this.moveDirection.y * this.speed;
        })
        this.draw();
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
        this.context.lineWidth = SIZE;
        this.context.strokeStyle = '#7ec710';
        this.context.lineCap = 'round';
        this.context.beginPath();
        this.position.forEach((point) =>
            this.context.lineTo((point.y) * SIZE, (point.x + 0.5) * SIZE)
        );
        this.context.stroke();
    }

    clearDraw() {
        this.position.forEach((point) =>
            this.context.clearRect((point.y - 0.5) * SIZE - 1.5, (point.x) * SIZE - 1.5, SIZE + 3, SIZE + 3)
        );
    }

    start() {
        if (this.timer === undefined)
            this.timer = setInterval(this.move.bind(this), 1000 / 60);
    }

    stop() {
        clearInterval(this.timer);
        this.timer = undefined;
    }
}