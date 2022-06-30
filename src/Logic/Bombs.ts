import { TILE_SIZE } from "Utils/GameUtils";
import { Point } from "Utils/Point";
import { RandomInt } from "Utils/RandomInt";
import { GameItem } from "./GameItem";

export class Bombs implements GameItem {
    positions: Point[] = [];
    context: CanvasRenderingContext2D;
    timer: NodeJS.Timer | undefined;
    isNewBombExpected: boolean = false;

    constructor(context: CanvasRenderingContext2D, bombsPositions?: Point[]) {
        this.context = context;
        if (bombsPositions)
            this.positions = bombsPositions;
    }

    setIsNewBombExpected() {
        this.isNewBombExpected = true;
    }

    addNewBomb() {
        const x = RandomInt.getRandomIntOnInterval(0, 20);
        const y = RandomInt.getRandomIntOnInterval(0, 20);
        const newBomb = new Point(x, y);
        this.positions.push(newBomb);
        this.drawNewBomb(newBomb);
        this.isNewBombExpected = false;
    }

    draw() {
        this.context.lineWidth = TILE_SIZE;
        this.context.strokeStyle = '#3498db'

        this.positions.forEach((point) => {
            this.context.beginPath()
            this.context.arc((point.x + 0.5) * TILE_SIZE, (point.y + 0.5) * TILE_SIZE, TILE_SIZE / 2, 0, 2 * Math.PI)
            this.context.fillStyle = '#000000'
            this.context.fill();
            this.context.closePath();
        }
        )
    }

    drawNewBomb(point: Point) {
        this.context.beginPath();
        this.context.arc((point.x + 0.5) * TILE_SIZE, (point.y + 0.5) * TILE_SIZE, TILE_SIZE / 2, 0, 2 * Math.PI);
        this.context.fillStyle = '#000000';
        this.context.fill();
        this.context.closePath();
    }

    clearDraw() {
        this.positions.forEach((point) => {
            this.context.clearRect((point.x) * TILE_SIZE, (point.y) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        });
    }

    start() {
        if (this.timer === undefined) {
            this.timer = setInterval(this.setIsNewBombExpected.bind(this), 10 * 1000);
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
        this.positions = [];
        this.isNewBombExpected = false;
        clearInterval(this.timer);
        this.timer = undefined;
    }

    update() {
        if (this.isNewBombExpected)
            this.addNewBomb();
    }

    end() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
            this.clearDraw();
        }
    }
}