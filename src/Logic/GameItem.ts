export interface GameItem {
    context: CanvasRenderingContext2D,
    draw(): void;
    start(): void;
    pause(): void;
    reset(): void;
    update(): void;
    end(): void;
}