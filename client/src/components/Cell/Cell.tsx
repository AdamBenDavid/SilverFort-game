import {memo} from 'react';
import type {Cell as TCell} from '../types';

type Props = { cell: TCell; onClick: () => void };

const ShapeSvg = ({shape}: { shape: TCell['shape'] }) => {
    const stroke = '#111', fill = 'rgba(255,255,255,.9)';
    if (shape === 'square') return <svg width={64} height={64}>
        <rect x="4" y="4" width="56" height="56" stroke={stroke} fill={fill} strokeWidth={2}/>
    </svg>;
    if (shape === 'circle') return <svg width={64} height={64}>
        <circle cx="32" cy="32" r="28" stroke={stroke} fill={fill} strokeWidth={2}/>
    </svg>;
    if (shape === 'triangle') return <svg width={64} height={64}>
        <polygon points="32,6 58,58 6,58" stroke={stroke} fill={fill} strokeWidth={2}/>
    </svg>;
    return <svg width={64} height={64}>
        <polygon points="32,4 60,32 32,60 4,32" stroke={stroke} fill={fill} strokeWidth={2}/>
    </svg>;
};

const Cell = ({cell, onClick}: Props) => {
    const blocked = cell.cooldown > 0;
    return (
        <button
            className={`cell ${cell.color} ${blocked ? 'cooldown' : ''}`}
            onClick={onClick}
            disabled={blocked}
            title={blocked ? `Cooldown: ${cell.cooldown}` : 'Click'}
        >
            <ShapeSvg shape={cell.shape}/>
            {blocked && <span className="badge">{cell.cooldown}</span>}
        </button>
    );
};

export default memo(Cell);
