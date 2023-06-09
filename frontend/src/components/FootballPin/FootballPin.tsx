import { FootballPinProps } from '@/interfaces/components/FootballPinProps';
import { FC } from 'react';

const FootballPin: FC<FootballPinProps> = ({ football, scale }) => {
    const { x, y, height } = football;
    const physicalBallRadius = 0.23;

    const ballSize = 0.6 + Math.sqrt(physicalBallRadius < height ? height : physicalBallRadius);
    const shadowShift = 10 * (physicalBallRadius < height ? height : physicalBallRadius);
    return (
        <>
            <filter id="shadow" colorInterpolationFilters="sRGB">
                <feDropShadow dx="2" dy="2" stdDeviation="0" floodOpacity="0.5" />
            </filter>
            <filter id="blur" colorInterpolationFilters="sRGB">
                <feGaussianBlur stdDeviation="2.5" floodOpacity="0.5" />
            </filter>
            <defs>
                <pattern id="footballSvg" patternUnits="objectBoundingBox" width="100%" height="100%">
                    <image
                        href="/assets/images/football.svg"
                        width={2 * ballSize * scale}
                        height={2 * ballSize * scale}
                    />
                </pattern>
            </defs>
            <circle
                cx={x * scale - shadowShift}
                cy={y * scale + shadowShift}
                r={ballSize * scale}
                filter="url(#blur)"
                fill="#363636AA"
                pointerEvents="none"
            />
            <circle cx={x * scale} cy={y * scale} r={ballSize * scale} fill="url(#footballSvg)" pointerEvents="none" />
        </>
    );
};

export default FootballPin;
