import { PlayerPitchProps } from '@/interfaces/components/PlayerPitchProps';
import { Player } from '@/interfaces/global';
import { FC, useEffect, useState } from 'react';
import { Drag, raise } from '@visx/drag';
import styles from './PlayerPitch.module.scss';
import PlayerPin from '../PlayerPin/PlayerPin';
import FootballPin from '../FootballPin/FootballPin';
import CustomDraw from '../CustomDraw/CustomDraw';
import calculateOpenness from '@/helpers/openness';
import ShadowPlayer from '../ShadowPlayer/ShadowPlayer';

const PlayerPitch: FC<PlayerPitchProps> = ({
    parentWidth,
    parentHeight,
    originalWidth = 1,
    originalHeight = 1,
    players,
    football,
    isDrawEnabled = false,
    leftGoalColor,
    rightGoalColor,
    isResetOpenness,
    reInitialiseOpenness,
    showOpenness,
    showShadowPlayer,
}) => {
    const ratio = originalWidth / originalHeight;
    const scale = parentWidth / originalWidth;

    const width = parentWidth;
    const height = width / ratio;

    const [shadowPlayers, setShadowPlayers] = useState<Player[]>([]);

    const getOpenness = (player: Player) => {
        return calculateOpenness(player, players);
    };

    return (
        <div className={styles.playerPitch} style={{ touchAction: 'none' }}>
            <svg width={width} height={height} className={styles.svg}>
                <>
                    <rect
                        fill="#E1EAE4"
                        width={width + 8 * scale}
                        height={height + 8 * scale}
                        x={-4 * scale}
                        y={-4 * scale}
                    />
                    <rect fill="#E1EAE4" width={width} height={height} stroke="#4C554B" strokeWidth={0.3 * scale} />
                    <line x1={width / 2} y1={height} x2={width / 2} stroke="#4C554B" strokeWidth={0.2 * scale} />

                    <circle
                        cx={width / 2}
                        cy={height / 2}
                        r={9.15 * scale}
                        fill="transparent"
                        stroke="#4C554B"
                        strokeWidth={0.2 * scale}
                    />
                    <circle
                        cx={width / 2}
                        cy={height / 2}
                        r={0.3 * scale}
                        fill="#4C554B"
                        stroke="#4C554B"
                        strokeWidth={0.2 * scale}
                    />
                    <circle
                        cx={11 * scale}
                        cy={height / 2}
                        r={9.15 * scale}
                        fill="transparent"
                        stroke="#4C554B"
                        strokeWidth={0.2 * scale}
                    />
                    <circle
                        cx={width - 11 * scale}
                        cy={height / 2}
                        r={9.15 * scale}
                        fill="transparent"
                        stroke="#4C554B"
                        strokeWidth={0.2 * scale}
                    />
                    <rect
                        x="0"
                        y={(height - 40.32 * scale) / 2}
                        width={16.5 * scale}
                        height={40.32 * scale}
                        fill="#C6D7CC"
                        stroke="#4C554B"
                        strokeWidth={0.2 * scale}
                    />
                    <circle
                        cx={11 * scale}
                        cy={height / 2}
                        r={0.3 * scale}
                        fill="#4C554B"
                        stroke="#4C554B"
                        strokeWidth={0.2 * scale}
                    />
                    <rect
                        x={width - 16.5 * scale}
                        y={(height - 40.32 * scale) / 2}
                        width={16.5 * scale}
                        height={40.32 * scale}
                        fill="#C6D7CC"
                        stroke="#4C554B"
                        strokeWidth={0.2 * scale}
                    />
                    <circle
                        cx={width - 11 * scale}
                        cy={height / 2}
                        r={0.3 * scale}
                        fill="#4C554B"
                        stroke="#4C554B"
                        strokeWidth={0.2 * scale}
                    />
                    <rect
                        x="0"
                        y={(height - 18.32 * scale) / 2}
                        width={5.5 * scale}
                        height={18.32 * scale}
                        fill="#E1EAE4"
                        stroke="#4C554B"
                        strokeWidth={0.2 * scale}
                    />
                    <rect
                        x={width - 5.5 * scale}
                        y={(height - 18.32 * scale) / 2}
                        width={5.5 * scale}
                        height={18.32 * scale}
                        fill="#E1EAE4"
                        stroke="#4C554B"
                        strokeWidth={0.2 * scale}
                    />

                    {/* left goal */}
                    <rect
                        x={-3.05 * scale}
                        y={(height - 7.32 * scale) / 2}
                        width={3 * scale}
                        height={7.32 * scale}
                        fill={leftGoalColor}
                        stroke="#4C554B"
                        strokeWidth={0.3 * scale}
                    />

                    {/* right goal */}
                    <rect
                        x={0.05 * scale + width}
                        y={(height - 7.32 * scale) / 2}
                        width={3 * scale}
                        height={7.32 * scale}
                        fill={rightGoalColor}
                        stroke="#4C554B"
                        strokeWidth={0.3 * scale}
                    />
                    {showShadowPlayer &&
                        shadowPlayers.map((item, index) => (
                            <ShadowPlayer
                                key={`shadow-${index}`}
                                player={item}
                                scale={scale}
                                showOpenness={showOpenness}
                            />
                        ))}
                    {players.map((item, index) => (
                        <Drag key={`drag-${item.id}`} width={width} height={height} x={item.x} y={item.y}>
                            {({ dragStart, dragEnd, dragMove, isDragging, x, y, dx, dy }) => {
                                return (
                                    <PlayerPin
                                        player={{
                                            ...item,
                                            x: x,
                                            y: y,
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
                                        getOpenness={getOpenness}
                                        isResetOpenness={isResetOpenness}
                                        showOpenness={showOpenness}
                                        resetShadows={() => {
                                            setShadowPlayers([]);
                                            reInitialiseOpenness();
                                        }}
                                        onCreateNewShadow={(player: Player) =>
                                            setShadowPlayers([...shadowPlayers, player])
                                        }
                                    />
                                );
                            }}
                        </Drag>
                    ))}

                    <FootballPin football={football} scale={scale} />

                    {isDrawEnabled && <CustomDraw width={parentWidth} height={parentHeight} />}
                </>
            </svg>
        </div>
    );
};

export default PlayerPitch;
