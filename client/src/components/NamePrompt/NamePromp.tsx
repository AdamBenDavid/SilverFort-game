import styles from './TopBar.module.css';

interface Props {
    connected: boolean;
    score: number;
    onReset: () => void;
    onShowLeaderboard: () => void;
}

const TopBar = ({connected, score, onReset, onShowLeaderboard}: Props) => (
    <header className={styles.topbar}>
        <h1>Shape–Color Board</h1>
        <div className={styles.meta}>
            <span className={`${styles.dot} ${connected ? styles.on : styles.off}`}
                  title={connected ? 'connected' : 'disconnected'}/>
            <span className={styles.score}>Score: {score}</span>
            <div className={styles.group}>
                <button className={styles.btn} onClick={onShowLeaderboard}>Leaderboard</button>
                <button className={styles.btn} onClick={onReset}>Reset</button>
            </div>
        </div>
    </header>
);

export default TopBar;
