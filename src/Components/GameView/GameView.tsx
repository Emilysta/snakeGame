import CustomButton from 'Components/CustomButton/CustomButton';
import { Game, GameStatus } from 'Logic/Game';
import { useEffect, useRef, useState } from 'react';
import { BOARD_SIZE } from 'Utils/GameUtils';
import styles from './GameView.module.css';
import { PlayFill, PauseFill, XLg } from 'react-bootstrap-icons';



export default function GameView() {
    const [game, setGame] = useState<Game | undefined>(undefined);
    const [gameStatus, setGameStatus] = useState<GameStatus>({
        isPlaying: false,
        isEnd: false,
        isPaused: false,
        score: 0,
    })

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        if (context) {
            setGame(new Game(context, gameStatusChanged));
        }
    }, [])

    function startGame() {
        setTimeout(() => game?.startGame(), 2000);
    }

    function resetGame() {
        setTimeout(() => game?.resetGame(), 2000);
    }

    function pauseGame() {
        game?.pauseGame();
    }

    function continueGame() {
        setTimeout(() => game?.startGame(true), 2000);
    }

    function gameStatusChanged(currentGameStatus: GameStatus) {
        setGameStatus(currentGameStatus);
    }

    function onBoardKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        game?.reactToUserInput(e.key);
    }

    return (
        <div className={styles.gameBox} onKeyDown={onBoardKeyDown} tabIndex={0}>
            <div className={styles.infoBox}></div>
            <canvas className={styles.board} ref={canvasRef} height={BOARD_SIZE} width={BOARD_SIZE}></canvas>
            {(!gameStatus.isPlaying || gameStatus.isEnd) &&
                <div className={styles.buttonOverlay}>
                    {!gameStatus.isPlaying &&
                        <CustomButton value="Play" onClick={startGame} contentClassName={styles.buttonContent} icon={<PlayFill height={80} width={80} />} />
                    }
                    {gameStatus.isEnd &&
                        <CustomButton value="Restart game" onClick={resetGame} contentClassName={styles.buttonContent} icon={<XLg height={80} width={80} />} />
                    }
                </div>
            }
            {gameStatus.isPlaying && !gameStatus.isPaused &&
                <CustomButton value="Pause" onClick={pauseGame} icon={<PauseFill height={30} width={30} />} />
            }

            {gameStatus.isPlaying && gameStatus.isPaused &&
                <CustomButton value="Continue" onClick={continueGame} icon={<PauseFill height={30} width={30} />} />
            }
        </div>
    )
}

