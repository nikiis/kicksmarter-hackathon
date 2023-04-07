import { PlayerPinProps } from '@/interfaces/components/PlayerPinProps';
import { Player } from '@/interfaces/global';
import { MouseTouchOrPointerEvent } from '@visx/drag/lib/useDrag';
import { FC, useState } from 'react';

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
    getOpenness,
    scale,
}) => {
    const RADIUS = 1.7 * scale;
    let { id, x, y, jerseyColor, secondaryColor, playerNumber, openness } = player;

    const [isShadowPlayer, setIsShadowPlayer] = useState<boolean>();
    const [shadowOpenness, setShadowOpenness] = useState<number>(0);

    // a workaround to scale the position when dragging is happening
    const isActuallyActive = dx !== 0 || dy !== 0 || isActive;
    x = isActuallyActive ? x : (x ?? 0) * scale;
    y = isActuallyActive ? y : (y ?? 0) * scale;

        // handle the start of a drag event
    const handlePlayerClick = (event: MouseTouchOrPointerEvent) => {
        if (event.type === 'touchstart')
            onTouchStart(event)
        else onMouseDown(event)

        // todo need to cancel shadow player when pressing play
        setIsShadowPlayer(true);
    };
    
    const handlePlayerRelease = (event: any) => {
        onMouseUp ? onMouseUp(event) : onTouchEnd(event);

        if (event.type === 'touchend')
            onTouchEnd(event)
        else onMouseUp(event)
    };
    
    const handlePlayerDrag = (event: any) => {
        const shadowPlayer = {...player};

        shadowPlayer.x = x / scale + dx / scale;
        shadowPlayer.y = y / scale + dy / scale;

        console.log('x, y:', x, y);

        setShadowOpenness(getOpenness(shadowPlayer));

        if (event.type === 'touchmove')
            onTouchMove(event)
        else onMouseMove(event)
    };

    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={isActive ? shadowOpenness * scale + 4 : shadowOpenness * scale}
                fill={isShadowPlayer ? `${jerseyColor}30` : "none"}
                stroke={isShadowPlayer ? "#4C554B20" : "none"} 
                strokeWidth={0.05 * scale}
                pointerEvents="none"
                transform={`translate(${dx}, ${dy})`}
            />
            <text
                x={x}
                y={y}
                fontSize={1.8 * scale}
                textAnchor="middle"
                stroke={secondaryColor}
                strokeWidth={0.2 * scale}
                pointerEvents="none"
                transform={`translate(${dx}, ${dy})`}
                dy=".35em">
                {playerNumber}
            </text>
            <circle
                cx={x}
                cy={y}
                r={isActive ? RADIUS + 4 : RADIUS}
                fill={`${jerseyColor}40`}
                stroke={isShadowPlayer ? `${secondaryColor}30` : "none"}
                strokeWidth={0.2 * scale}
                transform={`translate(${dx}, ${dy})`}
                onMouseDown={handlePlayerClick}
                onMouseMove={handlePlayerDrag}
                onMouseUp={handlePlayerRelease}
                onTouchStart={handlePlayerClick}
                onTouchMove={handlePlayerDrag}
                onTouchEnd={handlePlayerRelease}
            />

            <circle
                cx={x}
                cy={y}
                r={isActive ? openness * scale + 4 : openness * scale}
                fill={`${jerseyColor}50`}
                stroke="#4C554B50"
                strokeWidth={0.05 * scale}
                pointerEvents="none"
            />

            <circle
                cx={x}
                cy={y}
                r={isActive ? RADIUS + 4 : RADIUS}
                fill={jerseyColor}
                stroke={secondaryColor}
                strokeWidth={0.2 * scale}
                pointerEvents="none"
            />
            
            <text
                x={x}
                y={y}
                fontSize={1.8 * scale}
                textAnchor="middle"
                stroke={secondaryColor}
                strokeWidth={0.2 * scale}
                pointerEvents="none"
                dy=".35em">
                {playerNumber}
            </text>
        </>
    );
};

export default PlayerPin;
