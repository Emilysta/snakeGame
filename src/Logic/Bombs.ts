import { Point } from "Utils/Point";
import { RandomInt } from "Utils/RandomInt";
import { GameItem } from "./GameItem";

const SIZE = 1024 / 20;
export class Bombs implements GameItem {
    positions: Point[];
    context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D, bombsPositions: Point[] = [new Point(7, 19)]) {
        this.context = context;
        this.positions = bombsPositions;
    }

    addNewBomb() {
        const x = RandomInt.getRandomIntOnInterval(0, 20);
        const y = RandomInt.getRandomIntOnInterval(0, 20);
        const newBomb = new Point(x, y);
        this.positions.push(newBomb);
        this.drawNewBomb(newBomb);
    }

    draw() {
        this.context.lineWidth = SIZE;
        this.context.strokeStyle = '#3498db'

        this.positions.forEach((point) => {
            this.context.beginPath()
            this.context.arc((point.x + 0.5) * SIZE, (point.y + 0.5) * SIZE, SIZE / 2, 0, 2 * Math.PI)
            this.context.fillStyle = '#000000'
            this.context.fill();
            this.context.closePath();
        }
        )
    }

    drawNewBomb(point: Point) {
        this.context.beginPath();
        this.context.arc((point.x + 0.5) * SIZE, (point.y + 0.5) * SIZE, SIZE / 2, 0, 2 * Math.PI);
        this.context.fillStyle = '#000000';
        this.context.fill();
        this.context.closePath();
    }

    clearDraw() {
        this.positions.forEach((point) => {
            this.context.clearRect((point.x) * SIZE, (point.y) * SIZE, SIZE, SIZE);
        });
    }

    start() {
        
    }

    stop() {
     
    }
}