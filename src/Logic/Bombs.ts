import { Point } from "Utils/Point";
import { RandomInt } from "Utils/RandomInt";

export class Bombs {
    positions: Point[];

    constructor(bombsPositions: Point[] = []) {
        this.positions = bombsPositions;
    }

    addNewBomb() {
        const x = RandomInt.getRandomIntOnInterval(0, 20);
        const y = RandomInt.getRandomIntOnInterval(0, 20);
        const newBomb = new Point(x, y);
        this.positions.push(newBomb);
    }
}