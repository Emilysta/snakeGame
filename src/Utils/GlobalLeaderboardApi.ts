export async function getLeaderboard(page: number) {
    const response = await fetch(`https://snake.toadres.pl/api/scores/${page}`, { mode: "no-cors" });
    if (response.status === 400)
        return null;
    try {
        const resJson = await response.json() as LeaderboardContent;
        return resJson;
    } catch (err) {
        console.log(err)
        return null;
    }
}

export async function addPlayerScoreToLeaderboard(playerName: string, playerScore: number) {
    const playerResult: PlayerScore = { playerName: playerName, playerScore: playerScore };

    const response = await fetch("https://snake.toadres.pl/api/score",
        {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(playerResult),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
    return response.ok;
}

export type PlayerScore = {
    playerName: string,
    playerScore: number,
}

export type LeaderboardContent = {
    pageNumber: number,
    scores: PlayerScore[],
    pagesCount: number,
}