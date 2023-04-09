import { PlayerPinProps } from '@/interfaces/components/PlayerPinProps';
import { MouseTouchOrPointerEvent } from '@visx/drag/lib/useDrag';
import { FC, useEffect, useState } from 'react';

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
    isResetOpenness,
    resetShadows,
    onCreateNewShadow,
}) => {
    const RADIUS = 1.7 * scale;
    let { x, y, jerseyColor, secondaryColor, playerNumber, openness, position } = player;

    // const [isShadowPlayer, setIsShadowPlayer] = useState<boolean>(false);
    const [playerOpenness, setPlayerOpenness] = useState<number>(openness);

    useEffect(() => {
        if (isResetOpenness) {
            resetShadows();
            setPlayerOpenness(openness);
        }
    }, [isResetOpenness, resetShadows, openness]);

    // a workaround to scale the position when dragging is happening
    const isActuallyActive = dx !== 0 || dy !== 0 || isActive;
    x = isActuallyActive ? x : (x ?? 0) * scale;
    y = isActuallyActive ? y : (y ?? 0) * scale;

    // handle the start of a drag event
    const handlePlayerClick = (event: MouseTouchOrPointerEvent) => {
        event.type === 'touchstart' ? onTouchStart(event) : onMouseDown(event);
        // setIsShadowPlayer(true);

        // TODO: on click, create a shadow player / clone - emit player value
        onCreateNewShadow(player);
    };

    const handlePlayerRelease = (event: any) => (event.type === 'touchend' ? onTouchEnd(event) : onMouseUp(event));

    const handlePlayerDrag = (event: any) => {
        console.log(event);
        if (player.position !== 'GK') {
            const shadowPlayer = { ...player };

            shadowPlayer.x = (x ?? 0) / scale + dx / scale;
            shadowPlayer.y = (y ?? 0) / scale + dy / scale;

            setPlayerOpenness(getOpenness(shadowPlayer));
        }

        event.type === 'touchmove' ? onTouchMove(event) : onMouseMove(event);
    };

    return (
        <>
            <circle
                cx={x}
                cy={y}
                r={isActive ? playerOpenness * scale + 4 : playerOpenness * scale}
                fill={`${jerseyColor}50`}
                stroke={'#4C554B20'}
                strokeWidth={0.05 * scale}
                transform={`translate(${dx}, ${dy})`}
                pointerEvents="none"
            />
            <circle
                cx={x}
                cy={y}
                r={isActive ? RADIUS + 4 : RADIUS}
                fill={jerseyColor}
                stroke={secondaryColor}
                strokeWidth={0.2 * scale}
                transform={`translate(${dx}, ${dy})`}
                onMouseDown={handlePlayerClick}
                onMouseMove={handlePlayerDrag}
                onMouseUp={handlePlayerRelease}
                onTouchStart={handlePlayerClick}
                onTouchMove={handlePlayerDrag}
                onTouchEnd={handlePlayerRelease}
            />
            {/* Text cannot be semi-transparent, thus added before drawing the player ball, to make it look semi-transparent */}
            <text
                x={x}
                y={y}
                fontSize={1.8 * scale}
                textAnchor="middle"
                stroke={secondaryColor}
                strokeWidth={0.2 * scale}
                transform={`translate(${dx}, ${dy})`}
                pointerEvents="none"
                dy=".35em">
                {playerNumber}
            </text>
        </>
    );
};

export default PlayerPin;
