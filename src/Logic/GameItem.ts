export interface GameItem {
    context: CanvasRenderingContext2D,
    draw(): void;
    clearDraw(): void;
    start(): void;
    pause(): void;
    reset(): void;
    update(): void;
    end(): void;
}