import { BoardTile, TILE_SIZE } from "Utils/GameUtils";
import { Point } from "Utils/Point";
import { GameItem } from "./GameItem";

export class Bombs implements GameItem {
    positions: Point[] = [];
    context: CanvasRenderingContext2D;
    elapsedTime: number = 0;
    randomPoisitionNeededCallback: (type: BoardTile, previous?: Point, deletePreviou?: boolean) => Point;

    constructor(context: CanvasRenderingContext2D, randomPoisitionNeededCallback: (type: BoardTile, previous?: Point, deletePreviou?: boolean) => Point) {
        this.context = context;
        this.randomPoisitionNeededCallback = randomPoisitionNeededCallback;
    }

    addNewBomb() {
        const newBomb = this.randomPoisitionNeededCallback(BoardTile.Bomb);
        this.positions.push(newBomb);
        this.drawNewBomb(newBomb);
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

    update() {
        this.elapsedTime += 1.00 / 60;

        if (this.elapsedTime >= 30.00) {
            this.elapsedTime = 0;
            this.addNewBomb();
        }
        this.draw();
    }
}