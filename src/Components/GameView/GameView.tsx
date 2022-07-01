import CustomButton from 'Components/CustomButton/CustomButton';
import { Game, GameStatus } from 'Logic/Game';
import { useEffect, useRef, useState } from 'react';
import { BOARD_SIZE } from 'Utils/GameUtils';
import styles from './GameView.module.css';
import { PlayFill, PauseFill } from 'react-bootstrap-icons';
import Score from 'Components/Score/Score';

type GameViewProps = {
    gameEndedCallback?: (score: number) => void,
}

export default function GameView(props: GameViewProps) {
    const [game, setGame] = useState<Game | undefined>(undefined);
    const [gameStatus, setGameStatus] = useState<GameStatus>({
        isPlaying: false,
        isEnd: false,
        isPaused: false,
        score: 0,
    })
    const [countdown, setCountdown] = useState(-1);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        if (context) {
            setGame(new Game(context, gameStatusChanged));
        }
    }, [])

    function startGame() {
        let i = 3;
        const interval = setInterval(() => {
            setCountdown(i);
            i--;
        }, 1000)
        setTimeout(() => {
            clearInterval(interval);
            game?.startGame(true);
            setCountdown(-1)
        }, 3000);
    }

    function resetGame() {
        setTimeout(() => game?.resetGame(), 2000);
    }

    function pauseGame() {
        if (gameStatus.isPlaying)
            game?.pauseGame();
    }

    function continueGame() {
        setTimeout(() => game?.startGame(true), 2000);
    }

    function gameStatusChanged(currentGameStatus: GameStatus) {
        setGameStatus({ ...currentGameStatus });
        if (currentGameStatus.isEnd) {
            if (props.gameEndedCallback)
                props.gameEndedCallback(currentGameStatus.score);
        }
    }

    function onBoardKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        game?.reactToUserInput(e.key);
    }

    const score = gameStatus.score;
    return (
        <div className={styles.gameBox} onKeyDown={onBoardKeyDown} tabIndex={0}>
            Game View
            <div className={styles.infoBox}>
                <Score score={score} />
                {!gameStatus.isPaused &&
                    <CustomButton value="Pause" onClick={pauseGame} disabled={!gameStatus.isPlaying} icon={<PauseFill height={30} width={30} />} />
                }
                {gameStatus.isPaused &&
                    <CustomButton value="Continue" onClick={continueGame} disabled={!gameStatus.isPlaying} icon={<PauseFill height={30} width={30} />} />
                }
            </div>

            <canvas className={styles.board} ref={canvasRef} height={BOARD_SIZE} width={BOARD_SIZE}></canvas>

            {(!gameStatus.isPlaying || gameStatus.isEnd) &&
                <div className={styles.buttonOverlay}>
                    {countdown !== -1 && <h1>{countdown}</h1>}
                    {countdown === -1 && !gameStatus.isPlaying &&
                        <CustomButton value="Play" onClick={startGame} contentClassName={styles.buttonContent} icon={<PlayFill height={80} width={80} />} />
                    }
                    {gameStatus.isEnd &&
                        <CustomButton value="Restart game" onClick={resetGame} contentClassName={styles.buttonContent} icon={<PlayFill height={80} width={80} />} />
                    }
                </div>
            }

        </div>
    )
}

