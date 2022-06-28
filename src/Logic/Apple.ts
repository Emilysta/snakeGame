import { Point } from "Utils/Point";
import { RandomInt } from "Utils/RandomInt";

export class Apple {
    position: Point;

    constructor(applePosition: Point = new Point(5, 5)) {
        this.position = applePosition;
    }

    changePosition() {
        const x = RandomInt.getRandomIntOnInterval(0, 20);
        const y = RandomInt.getRandomIntOnInterval(0, 20);
        const newPos = new Point(x, y);
        this.position = newPos;
    }
}