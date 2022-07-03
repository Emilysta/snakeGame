import { BoardTile, TILE_SIZE } from "Utils/GameUtils";
import { Point } from "Utils/Point";
import { GameItem } from "./GameItem";

export class Apple implements GameItem {
    position: Point = new Point(5, 5);
    context: CanvasRenderingContext2D;
    isChangePositionExpected: boolean = false;
    elapsedTime: number = 0;
    randomPoisitionNeededCallback: (type: BoardTile, previous?: Point, deletePreviou?: boolean) => Point;

    constructor(context: CanvasRenderingContext2D, randomPoisitionNeededCallback: (type: BoardTile, previous?: Point, deletePreviou?: boolean) => Point) {
        this.context = context;
        this.randomPoisitionNeededCallback = randomPoisitionNeededCallback;
    }

    setIsChangePositionExpected() {
        this.isChangePositionExpected = true;
    }

    changePosition() {
        const newPos = this.randomPoisitionNeededCallback(BoardTile.Apple,this.position, true);
        this.position = newPos;
        this.draw();
        this.isChangePositionExpected = false;
    }

    draw() {
        const x = (this.position.x + 0.5) * TILE_SIZE;
        const y = (this.position.y + 0.5) * TILE_SIZE;
        this.context.beginPath();
        this.context.arc(x, y, TILE_SIZE / 2, 0, 2 * Math.PI);
        this.context.fillStyle = '#d2202e';
        this.context.fill();
        this.context.closePath()
    }

    update() {
        this.elapsedTime += 1.00/60;
        if (this.isChangePositionExpected || this.elapsedTime >= 10.00){
            this.changePosition();
            this.elapsedTime = 0;
        }
        this.draw();
    }
}