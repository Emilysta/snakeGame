import { Point } from "Utils/Point";
import { RandomInt } from "Utils/RandomInt";
import { GameItem } from "./GameItem";

const SIZE = 1024.0 / 20.0;

export class Apple implements GameItem {
    position: Point = new Point(5, 5);
    context: CanvasRenderingContext2D;
    isChangePositionExpected: boolean = false;
    timer: NodeJS.Timer | undefined;

    constructor(context: CanvasRenderingContext2D, applePosition?: Point) {
        this.context = context;
        if (applePosition)
            this.position = applePosition;
    }

    setIsChangePositionExpected() {
        this.isChangePositionExpected = true;
    }

    changePosition() {
        const x = RandomInt.getRandomIntOnInterval(0, 20);
        const y = RandomInt.getRandomIntOnInterval(0, 20);
        const newPos = new Point(x, y);
        this.clearDraw();
        this.position = newPos;
        this.draw();
        this.isChangePositionExpected = false;
    }

    draw() {
        const x = (this.position.x + 0.5) * SIZE;
        const y = (this.position.y + 0.5) * SIZE;
        this.context.beginPath();
        this.context.arc(x, y, SIZE / 2, 0, 2 * Math.PI);
        this.context.fillStyle = '#d2202e';
        this.context.fill();
        this.context.closePath()
    }

    clearDraw() {
        const x = (this.position.x) * SIZE;
        const y = (this.position.y) * SIZE;
        this.context.clearRect(x, y, SIZE, SIZE);
    }

    start() {
        if (this.timer === undefined) {
            this.timer = setInterval(this.setIsChangePositionExpected.bind(this), 10 * 1000);
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
        this.position = new Point(5, 5);
        this.isChangePositionExpected = false;
        clearInterval(this.timer);
        this.timer = undefined;
        console.log('resetApple');
    }

    update() {
        if (this.isChangePositionExpected)
            this.changePosition();
    }

    end() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
            this.clearDraw();
        }
    }
}