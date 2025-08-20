type Props = {
    connected: boolean;
    score: number;
    onReset: () => void;
};

export const TopBar = ({connected, score, onReset}: Props) => (
    <header className="topbar">
        <h1>Shape–Color Board</h1>
        <div className="meta">
            <span className={`dot ${connected ? 'on' : 'off'}`} title={connected ? 'connected' : 'disconnected'}/>
            <span className="score">Score: {score}</span>
            <button onClick={onReset}>Reset</button>
        </div>
    </header>
);

export default TopBar;
