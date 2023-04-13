import { ShadowPlayerProps } from '@/interfaces/components/ShadowPlayerProps';
import { FC } from 'react';

const ShadowPlayer: FC<ShadowPlayerProps> = ({ player, isActive = false, scale, showOpenness = true }) => {
    const RADIUS = 1.7 * scale;
    let { x, y, jerseyColor, secondaryColor, playerNumber, openness } = player;

    x = (x ?? 0) * scale;
    y = (y ?? 0) * scale;

    return (
        <>
            {showOpenness && (
                <circle
                    cx={x}
                    cy={y}
                    r={isActive ? openness * scale + 4 : openness * scale}
                    fill={`${jerseyColor}30`}
                    stroke="#4C554B50"
                    strokeWidth={0.05 * scale}
                    pointerEvents="none"
                />
            )}

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

            <circle
                cx={x}
                cy={y}
                r={isActive ? RADIUS + 4 : RADIUS}
                fill={`${jerseyColor}40`}
                stroke={`${secondaryColor}30`}
                strokeWidth={0.2 * scale}
                pointerEvents="none"
            />
        </>
    );
};

export default ShadowPlayer;
