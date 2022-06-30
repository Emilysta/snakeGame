import { CircleFill } from 'react-bootstrap-icons';
import styles from './Score.module.css';

type ScoreProps = {
    score: number,
}

export default function Score(props: ScoreProps) {
    return (
        <div className={styles.scoreBox}>
            <CircleFill />
            <h3>Score: {props.score}</h3>
        </div>
    )
}
