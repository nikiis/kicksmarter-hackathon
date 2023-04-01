import { FootballPinProps } from '@/interfaces/components/FootballPinProps';
import { FC } from 'react';

const FootballPin: FC<FootballPinProps> = ({ x, y, scale, heightScale }) => {
    let ballSize = 20 * (1 + heightScale);
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
                cx={x * scale - 30 * heightScale}
                cy={y * scale + 30 * heightScale}
                r={ballSize * (1 + heightScale) * scale}
                filter="url(#blur)"
                fill="#363636"
            />
            <circle cx={x * scale} cy={y * scale} r={ballSize * scale} fill="url(#footballSvg)" />
        </>
    );
};

export default FootballPin;
