import { PlayerPitchProps } from '@/interfaces/components/PlayerPitchProps';
import { Player } from '@/interfaces/global';
import { FC, useState } from 'react';
import { Drag, raise } from '@visx/drag';
import styles from './PlayerPitch.module.scss';
import PlayerPin from '../PlayerPin/PlayerPin';
import FootballPin from '../FootballPin/FootballPin';

const PlayerPitch: FC<PlayerPitchProps> = ({ parentWidth, parentHeight, players, football }) => {
    const ratio = 1.6; // ratio = width / height would get this from the API
    let height = parentHeight;
    let width = parentWidth;

    height = parentWidth / ratio;
    const scale = height / parentHeight;

    const [draggingItems, setDraggingItems] = useState<Player[]>(players);

    if (draggingItems.length === 0 || width < 10) return null;

    return (
        <div className={styles.playerPitch} style={{ touchAction: 'none' }}>
            <svg width={width} height={height} className={styles.svg}>
                <>
                    <rect fill="#E1EAE4" width={width} height={height} />
                    <line x1={width / 2} y1={height} x2={width / 2} stroke="#4C554B" strokeWidth={4.2 * scale} />
                    <circle
                        cx={width / 2}
                        cy={height / 2}
                        r={87.57 * scale}
                        fill="transparent"
                        stroke="#4C554B"
                        strokeWidth={4.2 * scale}
                    />
                    <circle
                        cx={129.68 * scale}
                        cy={height / 2}
                        r={86.45 * scale}
                        fill="transparent"
                        stroke="#4C554B"
                        strokeWidth={4.2 * scale}
                    />
                    <circle
                        cx={width - 129.68 * scale}
                        cy={height / 2}
                        r={86.45 * scale}
                        fill="transparent"
                        stroke="#4C554B"
                        strokeWidth={4.2 * scale}
                    />
                    <rect
                        x="0"
                        y={(height - 389 * scale) / 2}
                        width={158.5 * scale}
                        height={389 * scale}
                        fill="#C6D7CC"
                        stroke="#4C554B"
                        strokeWidth={4.2 * scale}
                    />
                    <rect
                        x={width - 160.66 * scale}
                        y={(height - 389 * scale) / 2}
                        width={160.66 * scale}
                        height={389 * scale}
                        fill="#C6D7CC"
                        stroke="#4C554B"
                        strokeWidth={4.2 * scale}
                    />
                    <rect
                        x="0"
                        y={(height - 172.91 * scale) / 2}
                        width={50.43 * scale}
                        height={172.91 * scale}
                        fill="#E1EAE4"
                        stroke="#4C554B"
                        strokeWidth={4.2 * scale}
                    />
                    <rect
                        x={width - 52.6 * scale}
                        y={(height - 172.9 * scale) / 2}
                        width={52.6 * scale}
                        height={172.9 * scale}
                        fill="#E1EAE4"
                        stroke="#4C554B"
                        strokeWidth={4.2 * scale}
                    />
                    <FootballPin x={football.x} y={football.y} scale={scale} heightScale={football.height} />
                    {draggingItems.map((item, index) => (
                        <Drag
                            key={`drag-${item.id}`}
                            width={width}
                            height={height}
                            x={item.x}
                            y={item.y}
                            onDragStart={() => {
                                setDraggingItems(raise(draggingItems, index));
                            }}>
                            {({ dragStart, dragEnd, dragMove, isDragging, x, y, dx, dy }) => (
                                <PlayerPin
                                    player={{
                                        id: item.id,
                                        x,
                                        y,
                                        playerNumber: item.playerNumber,
                                        colour: item.colour,
                                    }}
                                    dx={dx}
                                    dy={dy}
                                    isActive={isDragging}
                                    onMouseMove={dragMove}
                                    onMouseUp={dragEnd}
                                    onMouseDown={dragStart}
                                    onTouchStart={dragStart}
                                    onTouchMove={dragMove}
                                    onTouchEnd={dragEnd}
                                    scale={scale}
                                />
                            )}
                        </Drag>
                    ))}
                </>
            </svg>
        </div>
    );
};

export default PlayerPitch;
