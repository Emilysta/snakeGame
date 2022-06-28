import { Point } from "Utils/Point";

export class Snake {
    position: Point[] = [];
    speed: number = 5;

    constructor(snakePosition: Point[]) {
        this.position = snakePosition;
    }

    makeLonger(newPoint: Point) {
        this.position.push(newPoint);
    }

    makeFaster() {
        this.speed *= 1.25;
    }

    move(newPoint: Point) {
        this.position.unshift(newPoint);
        this.position.pop();
    }

    die() {
        this.position.shift();
    }

    length() {
        return this.position.length;
    }
}