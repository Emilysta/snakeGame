import { PlayerScore } from "Utils/GlobalLeaderboardApi";

export class Leaderboard {
    snakeGameLeaderboad: PlayerScore[] = [];
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
        this.snakeGameLeaderboad.push({ playerName: newPlayerName, playerScore: newScore })
        const tempLeaderboard = this.snakeGameLeaderboad.sort((place1, place2) => place2.playerScore - place1.playerScore);
        if (tempLeaderboard.length > 10)
            this.snakeGameLeaderboad = tempLeaderboard.slice(0, 10);
        else
            this.snakeGameLeaderboad = tempLeaderboard;
        this.saveLeaderboard();
    }
}