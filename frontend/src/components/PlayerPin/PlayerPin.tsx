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
    const RADIUS = 1.7 * scale;
    let { id, x, y, colour, playerNumber, openness } = player;

    // const onDragEnd = (event: any) => {
    //     x = x;
    //     y = y;
    //     isActive = false;
    // };

    // a workaround to scale the position when dragging is happening
    const isActuallyActive = dx !== 0 || dy !== 0 || isActive;
    x = isActuallyActive ? x : x * scale;
    y = isActuallyActive ? y : y * scale;

    // x = x * scale;
    // y = y * scale;
    // dx = dx / scale;
    // dy = dy / scale;

    // console.log('xy: ', x, y);
    // console.log('dxdy: ', dx, dy);

    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={isActive ? openness * scale + 4 : openness * scale}
                fill={colour + "50"}
                transform={`translate(${dx}, ${dy})`}
                stroke="#444E5050"
                strokeWidth={0.05 * scale}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            />

            <circle
                cx={x}
                cy={y}
                r={isActive ? RADIUS + 4 : RADIUS}
                fill={colour}
                transform={`translate(${dx}, ${dy})`}
                stroke="#444E50"
                strokeWidth={0.2 * scale}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            />
            
            <text
                x={x}
                y={y}
                fontSize={1.7 * scale}
                transform={`translate(${dx}, ${dy})`}
                textAnchor="middle"
                stroke="#444E50"
                strokeWidth={0.2 * scale}
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
