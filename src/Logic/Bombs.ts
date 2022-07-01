import { BoardTile, TILE_SIZE } from "Utils/GameUtils";
import { Point } from "Utils/Point";
import { GameItem } from "./GameItem";

export class Bombs implements GameItem {
    positions: Point[] = [];
    context: CanvasRenderingContext2D;
    timer: NodeJS.Timer | undefined;
    isNewBombExpected: boolean = false;
    randomPoisitionNeededCallback: (type: BoardTile, previous?: Point, deletePreviou?: boolean) => Point;

    constructor(context: CanvasRenderingContext2D, randomPoisitionNeededCallback: (type: BoardTile, previous?: Point, deletePreviou?: boolean) => Point) {
        this.context = context;
        this.randomPoisitionNeededCallback = randomPoisitionNeededCallback;
    }

    setIsNewBombExpected() {
        this.isNewBombExpected = true;
    }

    addNewBomb() {
        const newBomb = this.randomPoisitionNeededCallback(BoardTile.Bomb);
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

    start() {
        if (this.timer === undefined) {
            this.timer = setInterval(this.setIsNewBombExpected.bind(this), 30 * 1000);
            this.draw();
        }
    }

    pause() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    update() {
        this.draw();
        if (this.isNewBombExpected)
            this.addNewBomb();
    }

    end() {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}