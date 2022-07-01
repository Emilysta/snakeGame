import { LeaderboardPlace } from "Logic/Leaderboard"

type LeaderboardViewProps = {
    leaderboard: LeaderboardPlace[];
}

export default function LeaderboardView(props: LeaderboardViewProps) {
    return (
        <div>
            Leaderboard View
            {
                props.leaderboard.map((place, i) =>
                    <div key={i}>{place.playerName} {place.score}</div>
                )
            }
        </div>
    )
}
