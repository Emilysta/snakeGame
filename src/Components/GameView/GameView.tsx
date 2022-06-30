import CustomButton from 'Components/CustomButton/CustomButton';
import { Game } from 'Logic/Game';
import { useEffect, useRef, useState } from 'react';
import { BOARD_SIZE } from 'Utils/GameUtils';
import styles from './GameView.module.css';
import { PlayFill, PauseFill, XLg } from 'react-bootstrap-icons';

type GameStatus = {
    isInPlay: boolean,
    ended: boolean,
    isPaused: boolean,
}

export default function GameView() {
    const [game, setGame] = useState<Game | undefined>(undefined);
    const [gameStatus, setGameStatus] = useState<GameStatus>({
        isInPlay: false,
        ended: false,
        isPaused: false,
    })
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        if (context) {
            setGame(new Game(context));
        }
    }, [])

    function runGame() {
        game?.startGame();
        setGameStatus({
            isInPlay: true,
            ended: false,
            isPaused: false,
        })
    }

    function startGame() {
        setTimeout(() => runGame(), 2000);
    }

    function resetGame() {
        game?.resetGame();
        setGameStatus({
            isInPlay: false,
            ended: false,
            isPaused: false,
        })
        setTimeout(() => runGame(), 2000);
    }

    function pauseGame() {
        game?.pauseGame();
        setGameStatus({
            isInPlay: false,
            ended: false,
            isPaused: true,
        })
    }

    function onBoardKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        game?.reactToUserInput(e.key);
    }

    return (
        <div className={styles.gameBox} onKeyDown={onBoardKeyDown} tabIndex={0}>
            <canvas className={styles.board} ref={canvasRef} height={BOARD_SIZE} width={BOARD_SIZE}></canvas>
            <div className={styles.buttonOverlay}>
                {!gameStatus.isInPlay && <CustomButton value="Play" onClick={startGame} className={styles.playButton} contentClassName={styles.buttonContent} icon={<PlayFill height={80} width={80} />} />}
                {gameStatus.ended && <CustomButton value="Restart game" onClick={resetGame} className={styles.restartButton} contentClassName={styles.buttonContent} icon={<XLg height={80} width={80} />} />}
            </div>
            {gameStatus.isInPlay && !gameStatus.isPaused && <CustomButton value="Pause" onClick={pauseGame} className={styles.pauseButton} icon={<PauseFill height={30} width={30} />} />}
        </div>
    )
}

