import {useCallback, useState} from 'react';
import type {LeaderboardEntry} from '../types';
import {getLeaderboard, postScore} from '../api/http';

export const useLeaderboard = (currentScore: number) => {
    const [promptOpen, setPromptOpen] = useState(false);
    const [lbOpen, setLbOpen] = useState(false);
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(false);

    const openPrompt = useCallback(() => setPromptOpen(true), []);
    const closePrompt = useCallback(() => setPromptOpen(false), []);

    const loadLeaderboard = useCallback(async () => {
        setLoading(true);
        try {
            setEntries(await getLeaderboard());
        } finally {
            setLoading(false);
        }
    }, []);

    const openLeaderboard = useCallback(async () => {
        setLbOpen(true);
        await loadLeaderboard();
    }, [loadLeaderboard]);

    const closeLeaderboard = useCallback(() => setLbOpen(false), []);

    const submitName = useCallback(async (name: string) => {
        setPromptOpen(false);
        try {
            await postScore(name, currentScore);
            await openLeaderboard();
        } catch {

        }
    }, [currentScore, openLeaderboard]);

    return {
        promptOpen, openPrompt, closePrompt, submitName,
        lbOpen, openLeaderboard, closeLeaderboard, entries, loading,
    };
};
