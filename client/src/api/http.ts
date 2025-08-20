const BASE = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:4000';

export const getLeaderboard = async () => {
    const res = await fetch(`${BASE}/leaderboard`);
    if (!res.ok) throw new Error('Failed to load leaderboard');
    return res.json() as Promise<import('../types').LeaderboardEntry[]>;
};

export const postScore = async (name: string, score: number) => {
    const res = await fetch(`${BASE}/leaderboard`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, score}),
    });
    if (!res.ok) throw new Error('Failed to submit score');
    return res.json() as Promise<import('../types').LeaderboardEntry[]>;
};
