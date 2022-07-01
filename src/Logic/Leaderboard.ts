export class Leaderboard {
    snakeGameLeaderboad: LeaderboardPlace[] = [];
    constructor() {
        this.loadLeaderboard();
    }

    saveLeaderboard() {
        window.localStorage.setItem('snakeGameLeaderboard', JSON.stringify(this.snakeGameLeaderboad));
    }

    loadLeaderboard() {
        const leaderboard = window.localStorage.getItem('snakeGameLeaderboard');
        if (leaderboard) {
            try {
                this.snakeGameLeaderboad = JSON.parse(leaderboard);
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    deleteLeaderboard() {
        window.localStorage.removeItem('snakeGameLeaderboard');
        this.snakeGameLeaderboad = [];
    }

    addScoreToLeaderboard(newPlayerName: string, newScore: number) {
        this.snakeGameLeaderboad.push({ playerName: newPlayerName, score: newScore })
        this.snakeGameLeaderboad.sort((place1, place2) => place1.score - place2.score);
        if (this.snakeGameLeaderboad.length > 10)
            this.snakeGameLeaderboad = this.snakeGameLeaderboad.slice(0, 10);
        this.saveLeaderboard();
    }
}

type LeaderboardPlace = {
    playerName: string,
    score: number,
}