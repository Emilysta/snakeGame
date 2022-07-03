import React from 'react'
import { PlayerScore } from 'Utils/GlobalLeaderboardApi';
import styles from "./ScoreRow.module.css";

type ScoreRowProps = {
    placeStats: PlayerScore;
    placeNumber: number;
}

export default function ScoreRow(props: ScoreRowProps) {
    return (
        <div className={styles.scoreRow}>
            <p>{props.placeNumber}.</p>
            <p>{props.placeStats.playerName} </p>
            <p className={styles.score}>{props.placeStats.playerScore}</p>
        </div>
    )
}
