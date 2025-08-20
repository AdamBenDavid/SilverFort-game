import { Board, Shape, Color, SHAPES, COLORS } from './types';
import { ROWS, COLS, INITIAL_COOLDOWN, MAX_TRIES } from './constants';

export const neighbors = (r: number, c: number): [number, number][] =>
  [
    [r - 1, c],
    [r + 1, c],
    [r, c - 1],
    [r, c + 1],
  ].filter(([rr, cc]) => rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) as [
    number,
    number,
  ][];

export const isValid = (
  r: number,
  c: number,
  shape: Shape,
  color: Color,
  grid: Board,
): boolean => {
  for (const [rr, cc] of neighbors(r, c)) {
    const n = grid[rr]?.[cc];
    if (!n) continue;
    if (n.shape === shape) return false;
    if (n.color === color) return false;
  }
  return true;
};

export const anyValidForCell = (r: number, c: number, grid: Board): boolean => {
  for (const s of SHAPES)
    for (const col of COLORS) {
      if (isValid(r, c, s, col, grid)) return true;
    }
  return false;
};

const randomOf = <T extends readonly string[]>(arr: T): T[number] =>
  arr[Math.floor(Math.random() * arr.length)];

export const generateInitialBoard = (): Board => {
  const g: Board = Array.from(
    { length: ROWS },
    () => Array(COLS).fill(null) as any,
  );
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let tries = MAX_TRIES;
      let chosen: { shape: Shape; color: Color } | null = null;
      while (tries--) {
        const s = randomOf(SHAPES) as Shape;
        const col = randomOf(COLORS) as Color;
        if (isValid(r, c, s, col, g)) {
          chosen = { shape: s, color: col };
          break;
        }
      }
      if (!chosen) return generateInitialBoard();
      g[r][c] = { shape: chosen.shape, color: chosen.color, cooldown: 0 };
    }
  }
  return g;
};

export const applyValidRandomChange = (
  grid: Board,
  r: number,
  c: number,
): Board | null => {
  let tries = MAX_TRIES;
  while (tries--) {
    const s = randomOf(SHAPES) as Shape;
    const col = randomOf(COLORS) as Color;
    if (isValid(r, c, s, col, grid)) {
      const next = grid.map((row) => row.map((cell) => ({ ...cell })));
      next[r][c] = { shape: s, color: col, cooldown: INITIAL_COOLDOWN };
      return next;
    }
  }
  return null;
};

export const decrementCooldowns = (grid: Board): Board => {
  const next = grid.map((row) => row.map((cell) => ({ ...cell })));
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = next[r][c];
      if (cell.cooldown > 0) cell.cooldown--;
    }
  }
  return next;
};

export const optionsForCell = (grid: Board, r: number, c: number) => {
  const neigh = neighbors(r, c).map(([rr, cc]) => grid[rr][cc]!);
  const usedShapes = new Set(neigh.map((n) => n.shape));
  const usedColors = new Set(neigh.map((n) => n.color));

  const shapes = SHAPES.filter((s) => !usedShapes.has(s));
  const colors = COLORS.filter((col) => !usedColors.has(col));
  return { shapes, colors };
};

export const applyFromOptions = (
  grid: Board,
  r: number,
  c: number,
): Board | null => {
  const { shapes, colors } = optionsForCell(grid, r, c);
  if (shapes.length === 0 || colors.length === 0) return null;

  // decrement first so clicked cell shows 3
  const next = decrementCooldowns(grid);

  const s = shapes[Math.floor(Math.random() * shapes.length)] as Shape;
  const col = colors[Math.floor(Math.random() * colors.length)] as Color;

  next[r][c] = { shape: s, color: col, cooldown: INITIAL_COOLDOWN };
  return next;
};
