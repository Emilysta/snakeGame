export class Point {
    x: number;
    y: number;

    constructor(xValue: number = 0, yValue: number = 0) {
        this.x = xValue;
        this.y = yValue;
    }

    toString() {
        return `${this.x},${this.y}`
    }
}