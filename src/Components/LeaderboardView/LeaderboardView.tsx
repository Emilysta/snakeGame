import { LeaderboardPlace } from "Logic/Leaderboard";
import styles from './LeaderboardView.module.css';

type LeaderboardViewProps = {
    leaderboard: LeaderboardPlace[];
}

export default function LeaderboardView(props: LeaderboardViewProps) {
    return (
        <div className={styles.leaderboardViewBox}>
            <h3>Leaderboard View</h3>
            <div className={styles.scoresBox}>
                <div className={`${styles.scoreLabel} ${styles.scoreRow}`}>
                    <p>No.</p>
                    <p>Player name</p>
                    <p className={styles.score}>Score</p>
                </div>
                {
                    props.leaderboard.map((place, i) =>
                        <div className={styles.scoreRow} key={i}>
                            <p>{i + 1}.</p>
                            <p>{place.playerName} </p>
                            <p className={styles.score}>{place.score}</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
