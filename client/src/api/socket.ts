// client/src/api/socket.ts
import {io, Socket} from 'socket.io-client';
import type {Board} from '../types';

const URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:4000';
export type StatePayload = { board: Board; score: number };

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 500,
        });
    }
    return socket;
};

export const onInit = (cb: (p: StatePayload) => void) => getSocket().on('init', cb);
export const onUpdate = (cb: (p: StatePayload) => void) => getSocket().on('update', cb);
export const onGameOver = (cb: (p: StatePayload) => void) => getSocket().on('gameOver', cb);

export const emitClickCell = (row: number, colum: number) =>
    getSocket().emit('clickCell', {row, col: colum});

export const emitReset = () => getSocket().emit('reset');

export const offAll = () => {
    if (!socket) return;
    socket.off('init');
    socket.off('update');
    socket.off('gameOver');
};
