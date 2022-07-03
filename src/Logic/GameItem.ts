export interface GameItem {
    context: CanvasRenderingContext2D,
    draw(): void;
    update(): void;
}