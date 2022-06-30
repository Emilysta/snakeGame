import GameView from 'Components/GameView/GameView';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <h1>Snake game</h1>
      <GameView />
    </div>
  );
}

export default App;
