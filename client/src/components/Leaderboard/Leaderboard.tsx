import styles from './Leaderboard.module.css';
import type {LeaderboardEntry} from '../../types';

type Props = {
    open: boolean;
    onClose: () => void;
    entries: LeaderboardEntry[];
    loading?: boolean;
};

const Leaderboard = ({open, onClose, entries, loading}: Props) => {
    if (!open) return null;
    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.card} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Leaderboard (Top 10)</h2>
                    <div className={styles.actions}>
                        <button className={styles.btn} onClick={onClose}>Close</button>
                    </div>
                </div>
                {loading ? (
                    <div>Loading…</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th className={styles.rank}>#</th>
                            <th>Name</th>
                            <th>Score</th>
                            <th className={styles.small}>When</th>
                        </tr>
                        </thead>
                        <tbody>
                        {entries.length === 0 ? (
                            <tr>
                                <td colSpan={4}>No scores yet — be the first!</td>
                            </tr>
                        ) : entries.map((e, i) => (
                            <tr key={`${e.name}-${e.date}`}>
                                <td className={styles.rank}>{i + 1}</td>
                                <td>{e.name}</td>
                                <td>{e.score}</td>
                                <td className={styles.small}>{new Date(e.date).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
