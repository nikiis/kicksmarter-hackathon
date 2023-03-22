import { FC } from 'react';
import { SvgIconProps } from '@/interfaces/components/SvgIconProps';

const SvgIcon: FC<SvgIconProps> = ({ svgName, customClass = '' }) => {
    return (
        <svg role="img" aria-label="hidden" className={customClass}>
            <use href={`/assets/icons/icons.svg#${svgName}`} />
        </svg>
    );
};

export default SvgIcon;
