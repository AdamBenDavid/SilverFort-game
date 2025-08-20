import {useEffect} from 'react';
import {TopBar, Banner, Grid} from '../../components';
import Leaderboard from '../../components/Leaderboard';
import NamePrompt from '../../components/NamePrompt';
import {useGameSocket} from '../../hooks/useGameSocket';
import {useLeaderboard} from '../../hooks/useLeaderboard';

const GamePage = () => {
    const {board, score, over, connected, clickCell, reset} = useGameSocket();
    const {
        promptOpen, openPrompt, closePrompt, submitName,
        lbOpen, openLeaderboard, closeLeaderboard, entries, loading,
    } = useLeaderboard(score);

    useEffect(() => {
        if (over) openPrompt();
    }, [over, openPrompt]);

    return (
        <div className="app">
            <TopBar
                connected={connected}
                score={score}
                onReset={reset}
                onShowLeaderboard={openLeaderboard}
            />
            {over && <Banner text="Game Over"/>}
            <Grid board={board} onCellClick={clickCell}/>
            
            <NamePrompt open={promptOpen} score={score} onSubmit={submitName} onCancel={closePrompt}/>
            <Leaderboard open={lbOpen} onClose={closeLeaderboard} entries={entries} loading={loading}/>
        </div>
    );
};

export default GamePage;
