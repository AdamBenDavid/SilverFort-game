import {useEffect, useState, useMemo} from 'react';
import type {Board} from '../types';
import {getSocket, onInit, onUpdate, onGameOver, emitClickCell, emitReset, offAll} from '../api/socket';

export const useGameSocket = () => {
    const [board, setBoard] = useState<Board>([]);
    const [score, setScore] = useState(0);
    const [over, setOver] = useState(false);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const s = getSocket();
        const onC = () => setConnected(true);
        const onD = () => setConnected(false);
        s.on('connect', onC);
        s.on('disconnect', onD);

        onInit(({board, score}) => {
            setBoard(board);
            setScore(score);
            setOver(false);
        });
        onUpdate(({board, score}) => {
            setBoard(board);
            setScore(score);
        });
        onGameOver(({board, score}) => {
            setBoard(board);
            setScore(score);
            setOver(true);
        });

        return () => {
            s.off('connect', onC);
            s.off('disconnect', onD);
            offAll();
        };
    }, []);

    const actions = useMemo(() => ({
        clickCell: (r: number, c: number) => {
            if (!over) emitClickCell(r, c);
        },
        reset: () => emitReset(),
    }), [over]);

    return {board, score, over, connected, ...actions};
};
