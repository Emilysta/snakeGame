import CustomButton from "Components/CustomButton/CustomButton";
import { useState } from "react";
import { getLeaderboard, LeaderboardContent, PlayerScore } from "Utils/GlobalLeaderboardApi";
import styles from './LeaderboardView.module.css';
import ScoreRow from "./ScoreRow/SocreRow";
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

type LeaderboardViewProps = {
    leaderboard: PlayerScore[];
}

export default function LeaderboardView(props: LeaderboardViewProps) {
    const [data, setData] = useState<LeaderboardContent | null>(
        {
            pageNumber: 1,
            pagesCount: 1,
            scores: props.leaderboard
        });
    const [isGlobal, setIsGlobal] = useState(false);

    function changePage(decrease: boolean = false) {
        let pageNumber: number = 1;
        if (data)
            pageNumber = data.pageNumber + (decrease ? -1 : 1);
        fetchAndSetData(pageNumber)
    }

    async function fetchAndSetData(pageNumber: number) {
        const data = await getLeaderboard(pageNumber);
        if (data)
            setData({ ...data });
        else
            console.log("Problem with getting data")
    }

    async function changeIsGlobal(isGlobal: boolean) {
        setIsGlobal(isGlobal);
        if (isGlobal) {
            await fetchAndSetData(1);
        }
        else {
            setData({
                pageNumber: 1,
                pagesCount: 1,
                scores: props.leaderboard
            })
        }
    }


    console.log(data);
    return (
        <div className={styles.leaderboardViewBox}>
            <div>
                <h2>Leaderboard View</h2>
                <CustomButton value="Global leaderboard" onClick={() => changeIsGlobal(true)} />
                <CustomButton value="Local leaderboard" onClick={() => changeIsGlobal(false)} />
                <div className={styles.scoreLabel}>
                    <p>No.</p>
                    <p>Player name</p>
                    <p className={styles.score}>Score</p>
                </div>
                <div className={styles.scoresBox}>
                    {
                        data?.scores.map((place, i) =>
                            <ScoreRow placeStats={place} placeNumber={i + 1} key={i} />
                        )
                    }
                    {data?.scores.length === 0 && <p>No data</p>}
                </div>
            </div>
            <div className={styles.pageChangersBox}>
                {data?.pageNumber !== 1 && <CustomButton onClick={() => changePage(true)} icon={<ChevronLeft />} />}
                {data ? data.pageNumber + "/" + data.pagesCount : "1 / 1"}
                {data?.pageNumber !== data?.pagesCount && <CustomButton onClick={() => changePage()} icon={<ChevronRight />} />}
            </div>
        </div>
    )
}
