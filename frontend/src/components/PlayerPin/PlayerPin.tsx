import { PlayerPinProps } from '@/interfaces/components/PlayerPinProps';
import { FC } from 'react';

const PlayerPin: FC<PlayerPinProps> = ({
    player,
    dx,
    dy,
    isActive = false,
    onMouseMove,
    onMouseUp,
    onMouseDown,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    scale,
}) => {
    const RADIUS = 20 * scale;
    const { id, x, y, colour, playerNumber } = player;

    return (
        <>
            <circle
                key={id}
                cx={x ? x / scale : 0}
                cy={y ? y / scale : 0}
                r={isActive ? RADIUS + 4 : RADIUS}
                fill={colour}
                transform={`translate(${dx}, ${dy})`}
                stroke="#444E50"
                strokeWidth={3 * scale}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            />
            <text
                x={x ? x / scale : 0}
                y={y ? y / scale : 0}
                fontSize={24 * scale}
                transform={`translate(${dx}, ${dy})`}
                textAnchor="middle"
                stroke="#444E50"
                strokeWidth={2 * scale}
                dy=".3em"
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}>
                {playerNumber}
            </text>
        </>
    );
};

export default PlayerPin;
