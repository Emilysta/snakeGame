export interface GameItem {
    context: CanvasRenderingContext2D,
    draw(): void;
    clearDraw(): void;
    start(): void;
    stop(): void;
}