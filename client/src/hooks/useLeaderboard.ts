import {useCallback, useEffect, useState} from "react";
import type {LeaderboardEntry} from "../types";
import {getLeaderboard, postScore} from "../api/http";
import {socket} from "../socket";   // 👈 import here

export const useLeaderboard = (currentScore: number) => {
    const [promptOpen, setPromptOpen] = useState(false);
    const [lbOpen, setLbOpen] = useState(false);
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [gameId, setGameId] = useState<number | null>(null);

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

    useEffect(() => {
        socket.on("gameOver", ({gameId}) => {
            setGameId(gameId);
            setPromptOpen(true);
        });
        socket.on("scoreSaved", ({leaderboard}) => {
            setPromptOpen(false);
            setLbOpen(true);
            setEntries(leaderboard);
        });
        socket.on("scoreRejected", () => setPromptOpen(false));

        return () => {
            socket.off("gameOver");
            socket.off("scoreSaved");
            socket.off("scoreRejected");
        };
    }, []);

    const submitName = useCallback(
        async (name: string) => {
            setPromptOpen(false);
            if (gameId) socket.emit("submitScore", {gameId, name});
            try {
                await postScore(name, currentScore);
                await openLeaderboard();
            } catch {
                // ignore errors here
            }
        },
        [currentScore, openLeaderboard, gameId]
    );

    return {
        promptOpen,
        openPrompt,
        closePrompt,
        submitName,
        lbOpen,
        openLeaderboard,
        closeLeaderboard,
        entries,
        loading,
    };
};
