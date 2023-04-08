import { ShadowPlayerProps } from '@/interfaces/components/ShadowPlayerProps';
import { MouseTouchOrPointerEvent } from '@visx/drag/lib/useDrag';
import { FC, useEffect, useState } from 'react';

const ShadowPlayer: FC<ShadowPlayerProps> = ({
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
    isResetShadow,
    reInitialiseShadow,
}) => {
    const RADIUS = 1.7 * scale;
    let { x, y, jerseyColor, secondaryColor, playerNumber } = player;

    const [isShadowPlayer, setIsShadowPlayer] = useState<boolean>(false);
    const [shadowOpenness, setShadowOpenness] = useState<number>(0);

    useEffect(() => setShadowOpenness(0), [isResetShadow]);

    // a workaround to scale the position when dragging is happening
    const isActuallyActive = dx !== 0 || dy !== 0 || isActive;
    x = isActuallyActive ? x : (x ?? 0) * scale;
    y = isActuallyActive ? y : (y ?? 0) * scale;

    // handle the start of a drag event
    const handlePlayerClick = (event: MouseTouchOrPointerEvent) => {
        event.type === 'touchstart' ? onTouchStart(event) : onMouseDown(event);

        // todo need to cancel shadow player when pressing play
        setIsShadowPlayer(true);
    };

    const handlePlayerRelease = (event: any) => (event.type === 'touchend' ? onTouchEnd(event) : onMouseUp(event));

    const handlePlayerDrag = (event: any) => {
        const shadowPlayer = { ...player };

        shadowPlayer.x = x / scale + dx / scale;
        shadowPlayer.y = y / scale + dy / scale;

        reInitialiseShadow();
        setShadowOpenness(getOpenness(shadowPlayer));

        event.type === 'touchmove' ? onTouchMove(event) : onMouseMove(event);
    };

    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={isActive ? shadowOpenness * scale + 4 : shadowOpenness * scale}
                fill={isShadowPlayer ? `${jerseyColor}30` : 'none'}
                stroke={isShadowPlayer ? '#4C554B20' : 'none'}
                strokeWidth={0.05 * scale}
                pointerEvents="none"
                transform={`translate(${dx}, ${dy})`}
            />
            {/* Text cannot be semi-transparent, thus added before drawing the player ball, to make it look semi-transparent */}
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
                fill={isShadowPlayer ? `${jerseyColor}40` : 'transparent'}
                stroke={isShadowPlayer ? `${secondaryColor}30` : 'transparent'}
                strokeWidth={0.2 * scale}
                transform={`translate(${dx}, ${dy})`}
                onMouseDown={handlePlayerClick}
                onMouseMove={handlePlayerDrag}
                onMouseUp={handlePlayerRelease}
                onTouchStart={handlePlayerClick}
                onTouchMove={handlePlayerDrag}
                onTouchEnd={handlePlayerRelease}
            />
        </>
    );
};

export default ShadowPlayer;
