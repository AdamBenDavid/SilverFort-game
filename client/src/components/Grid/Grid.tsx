import type {Board} from '../types';
import Cell from './Cell';

type Props = { board: Board; onCellClick: (r: number, c: number) => void };

const Grid = ({board, onCellClick}: Props) => {
    const cols = board[0]?.length ?? 6;
    return (
        <div className="grid" style={{gridTemplateColumns: `repeat(${cols}, 96px)`}}>
            {board.map((row, r) =>
                row.map((cell, c) => (
                    <Cell key={`${r}-${c}`} cell={cell} onClick={() => onCellClick(r, c)}/>
                )),
            )}
        </div>
    );
};

export default Grid;
