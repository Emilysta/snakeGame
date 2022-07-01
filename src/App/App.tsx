import GameView from 'Components/GameView/GameView';
import LeaderboardView from 'Components/LeaderboardView/LeaderboardView';
import { Leaderboard } from 'Logic/Leaderboard';
import { useState } from 'react';
import styles from './App.module.css';
import { Route, Routes, Link } from 'react-router-dom';

function App() {
  const [leaderboard] = useState(new Leaderboard());

  function saveScore(playerName: string, score: number) {
    leaderboard.addScoreToLeaderboard(playerName, score);
  }

  return (
    <div className={styles.app}>
      <nav className={styles.appNavbar}>
        <ul className={styles.appNavbarItemsBox}>
          <li><Link to="/leaderboard" className={styles.appLink}>Leaderboard</Link></li>
          <li><Link to="/" className={styles.appLink}>Game</Link></li>
        </ul>
      </nav>
      <hr />
      <h1>Snake</h1>
      <hr />
      <Routes>
        <Route path="/" element={<GameView gameEndedCallback={saveScore} />} />
        <Route path="leaderboard" element={<LeaderboardView leaderboard={leaderboard.snakeGameLeaderboad} />} />
      </Routes>
    </div>
  );
}

export default App;
