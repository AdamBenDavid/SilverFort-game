export type Shape = 'triangle' | 'square' | 'diamond' | 'circle';
export type Color = 'red' | 'green' | 'blue' | 'yellow';
export type Cell = { shape: Shape; color: Color; cooldown: number };
export type Board = Cell[][];
export type LeaderboardEntry = { name: string; score: number; date: string };

