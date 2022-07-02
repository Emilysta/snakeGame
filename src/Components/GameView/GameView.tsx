import CustomButton from 'Components/CustomButton/CustomButton';
import { Game, GameStatus } from 'Logic/Game';
import { useEffect, useRef, useState } from 'react';
import { BOARD_SIZE } from 'Utils/GameUtils';
import styles from './GameView.module.css';
import { PlayFill, PauseFill } from 'react-bootstrap-icons';
import Score from 'Components/Score/Score';
import InputModal from 'Components/InputModal/InputModal';

type GameViewProps = {
    gameEndedCallback?: (playerName: string, score: number) => void,
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
    const [showModal, setShowModal] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context) {
            setGame(new Game(context, gameStatusChanged));
        }
    }, [])

    function startGame() {
        timeout(() => {
            canvasRef.current?.focus();
            game?.startGame();
        });
    }

    function resetGame() {
        timeout(() => {
            canvasRef.current?.focus();
            game?.resetGame();
        });
    }

    function pauseGame() {
        game?.pauseGame();
    }

    function continueGame() {
        timeout(() => {
            canvasRef.current?.focus();
            game?.startGame(true);
        });
    }

    function timeout(callbackFunction: () => void) {
        let i = 3;
        const interval = setInterval(() => {
            setCountdown(i);
            i--;
        }, 1000)
        setTimeout(() => {
            clearInterval(interval);
            callbackFunction();
            setCountdown(-1);
        }, 3000);
    }

    function gameStatusChanged(currentGameStatus: GameStatus) {
        setGameStatus({ ...currentGameStatus });
        if (currentGameStatus.isEnd)
            setShowModal(true);
    }

    function submitScore(inputValue: string) {
        setShowModal(false);
        if (props.gameEndedCallback)
            props.gameEndedCallback(inputValue, gameStatus.score);
    }

    function onBoardKeyDown(e: React.KeyboardEvent<HTMLCanvasElement>) {
        game?.reactToUserInput(e.key);
    }

    const score = gameStatus.score;
    return (
        <div className={styles.gameBox}>
            Game View
            <div className={styles.infoBox}>
                <Score score={score} />
                {!gameStatus.isPaused &&
                    <CustomButton value="Pause" onClick={pauseGame} disabled={!gameStatus.isPlaying} icon={<PauseFill height={30} width={30} />} />
                }
                {gameStatus.isPaused &&
                    <CustomButton value="Continue" onClick={continueGame} disabled={!gameStatus.isPlaying} icon={<PlayFill height={30} width={30} />} />
                }
            </div>

            <canvas className={styles.board} ref={canvasRef} height={BOARD_SIZE} width={BOARD_SIZE} id="gameCanvas" onKeyDown={onBoardKeyDown} tabIndex={0} />

            {(!gameStatus.isPlaying || gameStatus.isEnd || gameStatus.isPaused) &&
                <div className={styles.gameOverlay}>
                    {countdown === -1 && !gameStatus.isPlaying && !gameStatus.isEnd &&
                        <CustomButton value="Play" onClick={startGame} contentClassName={styles.buttonContent} icon={<PlayFill height={80} width={80} />} />
                    }
                    {countdown === -1 && gameStatus.isEnd &&
                        <CustomButton value="Restart game" onClick={resetGame} contentClassName={styles.buttonContent} icon={<PlayFill height={80} width={80} />} />
                    }
                    {countdown !== -1 &&
                        <h1>Game will start in <br />
                            {countdown !== -1 ? countdown : '...'}
                        </h1>
                    }
                    {countdown === -1 && gameStatus.isPaused &&
                        <h1>Game paused </h1>
                    }

                </div>
            }
            <InputModal isShown={showModal} onSubmit={submitScore} />
        </div>
    )
}

