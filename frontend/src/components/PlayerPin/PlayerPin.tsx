import { PlayerPinProps } from '@/interfaces/components/PlayerPinProps';
import { FC } from 'react';

const PlayerPin: FC<PlayerPinProps> = ({ player, isActive = false, scale }) => {
    const RADIUS = 1.7 * scale;
    let { x, y, jerseyColor, secondaryColor, playerNumber, openness } = player;

    x = (x ?? 0) * scale;
    y = (y ?? 0) * scale;

    return (
        <>
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
