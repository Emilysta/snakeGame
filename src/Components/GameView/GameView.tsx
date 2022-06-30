import { Game } from 'Logic/Game';
import { useEffect, useRef, useState } from 'react';
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

    return (
        <canvas className={styles.board} ref={canvasRef} height={1024} width={1024}></canvas>
    )
}

