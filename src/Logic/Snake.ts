import { MoveDirection, TILE_SIZE } from "Utils/GameUtils";
import { Point } from "Utils/Point";
import { GameItem } from "./GameItem";
type DirectionElemenet = {
    moveDir: Point,
    countOfSnakeParts: number,
    //count of snake Parts(Points) 
    //that direction affects
}

export class Snake implements GameItem {
    position: Point[] = [new Point(5, 7)];
    context: CanvasRenderingContext2D;
    speed: number = 0.05;
    moveDirections: DirectionElemenet[] = [{ moveDir: new Point(1, 0), countOfSnakeParts: 1 }];
    nextDirection: Point | null = null;
    traveledDistance: number = 0;
    isMakeLongerExpected: boolean = false;
    isMakeFasterExpected: boolean = false;
    countOfEatenApples: number = 0;
    elapsedTime: number = 0;
    fullTileCallback: (previous: Point) => void;


    constructor(context: CanvasRenderingContext2D, fullTileCallback: (previous: Point) => void) {

        this.context = context;
        this.fullTileCallback = fullTileCallback;
    }

    makeLonger() {
        this.isMakeLongerExpected = true;
        this.countOfEatenApples += 1;
        if (this.countOfEatenApples === 5) {
            this.countOfEatenApples = 0;
            this.makeFaster();
        }
    }

    makeFaster() {
        this.isMakeFasterExpected = true;
    }

    move() {
        let startIndex = 0;
        let count = 0;

        const stepBeforeLast = Math.round(1 / this.speed - 1);

        this.moveDirections.forEach((direction) => {
            count += direction.countOfSnakeParts;
            for (let it = startIndex; it < count; it++) {
                const distToTravel: Point = new Point(0, 0);
                if (this.traveledDistance < stepBeforeLast) {
                    distToTravel.x = (direction.moveDir.x * this.speed)
                    distToTravel.y = (direction.moveDir.y * this.speed)
                }
                else {
                    distToTravel.x = (1 - stepBeforeLast * this.speed) * direction.moveDir.x;
                    distToTravel.y = (1 - stepBeforeLast * this.speed) * direction.moveDir.y;
                }
                const x = this.position[it].x + distToTravel.x;
                const y = this.position[it].y + distToTravel.y;
                this.position[it].x = Math.round(x * 100) / 100;
                this.position[it].y = Math.round(y * 100) / 100;
            }
            startIndex = count;
        });

        const snakeHead = this.position[0];
        this.traveledDistance += 1;

        const lastIndex = this.moveDirections.length - 1;
        const lastDir = this.moveDirections[lastIndex];
        const lastPos = this.position[count - 1];
        const previous = new Point(lastPos.x - lastDir.moveDir.x, lastPos.y - lastDir.moveDir.y);

        if (this.isMakeLongerExpected) {
            this.isMakeLongerExpected = false;
            lastDir.countOfSnakeParts += 1;
            this.position.push(previous);
        }

        if (this.traveledDistance >= (stepBeforeLast + 1)) {

            if (this.nextDirection !== null && Number.isInteger(snakeHead.x) && Number.isInteger(snakeHead.y)) {
                this.moveDirections.unshift({ moveDir: this.nextDirection, countOfSnakeParts: 1 });
                this.nextDirection = null;
                this.modifyLastDirection();
            }
            else if (this.moveDirections.length > 1) {
                this.moveDirections[0].countOfSnakeParts += 1;
                this.modifyLastDirection();
            }
            if (this.isMakeFasterExpected) {
                const tempSpeed = this.speed * 1.25;
                this.speed = Math.round(tempSpeed * 100) / 100;
                this.isMakeFasterExpected = false;
            }
            this.traveledDistance = 0;
            this.fullTileCallback(previous);
        }
    }

    changeMoveDirection(dir: MoveDirection) {
        let newDirection: Point;
        switch (dir) {
            case MoveDirection.Up: {
                newDirection = new Point(0, -1);
                break;
            }
            case MoveDirection.Down: {
                newDirection = new Point(0, 1);
                break;
            }
            case MoveDirection.Left: {
                newDirection = new Point(-1, 0);
                break;
            }
            case MoveDirection.Right: {
                newDirection = new Point(1, 0);
                break;
            }
        }

        if (this.checkIfDirectionPossible(newDirection))
            this.nextDirection = newDirection;
    }

    modifyLastDirection() {
        const lastIndex = this.moveDirections.length - 1;
        const lastDirection = this.moveDirections[lastIndex];
        lastDirection.countOfSnakeParts -= 1;
        if (lastDirection.countOfSnakeParts <= 0)
            this.moveDirections.pop();
    }

    checkIfDirectionPossible(dir: Point) {
        const firstDir = this.moveDirections[0].moveDir;
        if (dir.x === firstDir.x && dir.y === firstDir.y)
            return false;
        if (dir.x === -firstDir.x && dir.y === -firstDir.y)
            return false;
        return true;
    }

    draw() {
        this.context.lineWidth = TILE_SIZE;
        this.context.strokeStyle = '#7ec710';
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.beginPath();
        this.position.forEach((point) =>
            this.context.lineTo((point.x + 0.5) * TILE_SIZE, (point.y + 0.5) * TILE_SIZE)
        );
        this.context.stroke();
    }

    update() {
        this.move();
        this.draw();
    }

}