export const SHAPES = ['triangle', 'square', 'diamond', 'circle'] as const;
export const COLORS = ['red', 'green', 'blue', 'yellow'] as const;

export type Shape = (typeof SHAPES)[number];
export type Color = (typeof COLORS)[number];

export type Cell = { shape: Shape; color: Color; cooldown: number };
export type Board = Cell[][];

export type LeaderboardEntry = { name: string; score: number; date: string };
