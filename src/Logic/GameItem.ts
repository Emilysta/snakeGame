export interface GameItem {
    context: CanvasRenderingContext2D,
    draw(): void;
    start(): void;
    pause(): void;
    update(): void;
    end(): void;
}