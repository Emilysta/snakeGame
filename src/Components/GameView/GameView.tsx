import { Game } from 'Logic/Game';
import { useEffect, useRef, useState } from 'react';
import { BOARD_SIZE } from 'Utils/GameUtils';
import styles from './GameView.module.css';

export default function GameView() {
    const [game, setGame] = useState<Game | undefined>(undefined);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        if (context) {
            setGame(new Game(context));
        }
    }, [])

    function startGame() {
        game?.startGame();
    }

    function resetGame() {
        game?.resetGame();
        setTimeout(() => startGame(), 2000);
    }

    function pauseGame() {
        game?.pauseGame();
    }

    function onBoardKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        game?.reactToUserInput(e.key);
    }

    return (
        <div className={styles.gameBox} onKeyDown={onBoardKeyDown} tabIndex={0}>
            <canvas className={styles.board} ref={canvasRef} height={BOARD_SIZE} width={BOARD_SIZE}></canvas>
            <button onClick={startGame} className={styles.startButton} >Start game</button>
            <button onClick={resetGame} className={styles.resetButton} >Reset game</button>
            <button onClick={pauseGame} className={styles.pauseButton} >Pause game</button>
        </div>
    )
}

