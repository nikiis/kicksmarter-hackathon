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
    let { id, x, y, jerseyColor, secondaryColor, playerNumber, openness } = player;

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
                fill={`${jerseyColor}50`}
                transform={`translate(${dx}, ${dy})`}
                stroke={`${secondaryColor}50`}
                strokeWidth={0.05 * scale}
            />

            <circle
                cx={x}
                cy={y}
                r={isActive ? RADIUS + 4 : RADIUS}
                fill={jerseyColor}
                transform={`translate(${dx}, ${dy})`}
                stroke={secondaryColor}
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
                fontSize={1.8 * scale}
                transform={`translate(${dx}, ${dy})`}
                textAnchor="middle"
                stroke={secondaryColor}
                strokeWidth={0.2 * scale}
                fontFamily='Oxygen'
                dy=".35em"
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
