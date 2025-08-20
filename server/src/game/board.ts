import { Board, Shape, Color, SHAPES, COLORS } from './types';
import { ROWS, COLS, INITIAL_COOLDOWN, MAX_TRIES } from './constants';

export const neighbors = (row: number, column: number): [number, number][] =>
  [
    [row - 1, column],
    [row + 1, column],
    [row, column - 1],
    [row, column + 1],
  ].filter(
    ([filteredRow, filteredColumn]) =>
      filteredRow >= 0 &&
      filteredRow < ROWS &&
      filteredColumn >= 0 &&
      filteredColumn < COLS,
  ) as [number, number][];

export const isValid = (
  row: number,
  column: number,
  shape: Shape,
  color: Color,
  grid: Board,
): boolean => {
  for (const [neighborRow, neighborColumn] of neighbors(row, column)) {
    const cell = grid[neighborRow]?.[neighborColumn];
    if (!cell) continue;
    if (cell.shape === shape) return false;
    if (cell.color === color) return false;
  }
  return true;
};

export const anyValidForCell = (
  row: number,
  column: number,
  grid: Board,
): boolean => {
  for (const shapes of SHAPES)
    for (const col of COLORS) {
      if (isValid(row, column, shapes, col, grid)) return true;
    }
  return false;
};

const randomOf = <T extends readonly string[]>(arr: T): T[number] =>
  arr[Math.floor(Math.random() * arr.length)];

export const generateInitialBoard = (): Board => {
  const grid: Board = Array.from(
    { length: ROWS },
    () => Array(COLS).fill(null) as any,
  );
  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLS; column++) {
      let tries = MAX_TRIES;
      let chosen: { shape: Shape; color: Color } | null = null;
      while (tries--) {
        const shape = randomOf(SHAPES) as Shape;
        const color = randomOf(COLORS) as Color;
        if (isValid(row, column, shape, color, grid)) {
          chosen = { shape: shape, color: color };
          break;
        }
      }
      if (!chosen) return generateInitialBoard();
      grid[row][column] = {
        shape: chosen.shape,
        color: chosen.color,
        cooldown: 0,
      };
    }
  }
  return grid;
};

export const applyValidRandomChange = (
  grid: Board,
  row: number,
  column: number,
): Board | null => {
  let tries = MAX_TRIES;
  while (tries--) {
    const shape = randomOf(SHAPES) as Shape;
    const color = randomOf(COLORS) as Color;
    if (isValid(row, column, shape, color, grid)) {
      const next = grid.map((row) => row.map((cell) => ({ ...cell })));
      next[row][column] = {
        shape: shape,
        color: color,
        cooldown: INITIAL_COOLDOWN,
      };
      return next;
    }
  }
  return null;
};

export const decrementCooldowns = (grid: Board): Board => {
  const next = grid.map((row) => row.map((cell) => ({ ...cell })));
  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLS; column++) {
      const cell = next[row][column];
      if (cell.cooldown > 0) cell.cooldown--;
    }
  }
  return next;
};

export const optionsForCell = (grid: Board, row: number, column: number) => {
  const current = grid[row][column];
  const neighbor = neighbors(row, column).map(
    ([neighborRow, neighborColumn]) => grid[neighborRow][neighborColumn]!,
  );
  const usedShapes = new Set(neighbor.map((neighbor) => neighbor.shape));
  const usedColors = new Set(neighbor.map((neighbor) => neighbor.color));

  const shapes = SHAPES.filter(
    (shapes) => shapes !== current.shape && !usedShapes.has(shapes), // You can only loose upon middle row so changed to validation on shapes & colors not or
  );
  const colors = COLORS.filter(
    (colors) => colors !== current.color && !usedColors.has(colors),
  );
  return { shapes, colors };
};

export const applyFromOptions = (
  grid: Board,
  row: number,
  column: number,
): Board | null => {
  const { shapes, colors } = optionsForCell(grid, row, column);
  if (shapes.length === 0 || colors.length === 0) return null;

  const next = decrementCooldowns(grid);

  const shape = shapes[Math.floor(Math.random() * shapes.length)] as Shape;
  const color = colors[Math.floor(Math.random() * colors.length)] as Color;

  next[row][column] = {
    shape: shape,
    color: color,
    cooldown: INITIAL_COOLDOWN,
  };
  return next;
};
