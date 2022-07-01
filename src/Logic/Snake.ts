import { MoveDirection, SNAKE_STEP, TILE_SIZE } from "Utils/GameUtils";
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
    speed: number = 1;
    moveDirections: DirectionElemenet[] = [{ moveDir: new Point(1, 0), countOfSnakeParts: 1 }];
    nextDirection: Point | null = null;
    traveledDistance: number = 0;
    isMakeLongerExpected: boolean = false;
    countOfEatenApples: number = 0;
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
        this.speed *= 1.25;
    }

    move() {
        let startIndex = 0;
        let count = 0;

        this.moveDirections.forEach((direction) => {
            count += direction.countOfSnakeParts;
            for (let it = startIndex; it < count; it++) {
                const x = this.position[it].x + (direction.moveDir.x * SNAKE_STEP);
                const y = this.position[it].y + (direction.moveDir.y * SNAKE_STEP);
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

        new Point(lastPos.x - lastDir.moveDir.x, lastPos.y - lastDir.moveDir.y)
        if (this.isMakeLongerExpected) {
            this.isMakeLongerExpected = false;
            lastDir.countOfSnakeParts += 1;
            this.position.push(previous);
        }

        if (this.traveledDistance >= (1 / SNAKE_STEP) && this.nextDirection !== null &&
            Number.isInteger(snakeHead.x) && Number.isInteger(snakeHead.y)) {
            this.moveDirections.unshift({ moveDir: this.nextDirection, countOfSnakeParts: 1 });
            this.nextDirection = null;
            this.modifyLastDirection();
            this.traveledDistance = 0;
            this.fullTileCallback(previous);
        }

        if (this.traveledDistance >= (1 / SNAKE_STEP) && this.moveDirections.length > 1) {
            this.traveledDistance = 0;
            this.moveDirections[0].countOfSnakeParts += 1;
            this.modifyLastDirection();
            this.fullTileCallback(previous);
        }

        if (this.traveledDistance >= (1 / SNAKE_STEP)) {

            this.traveledDistance = 0
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

    start() {
        this.draw();
    }

    pause() {
    }

    update() {
        this.move();
        this.draw();
    }

    end() {
    }
}