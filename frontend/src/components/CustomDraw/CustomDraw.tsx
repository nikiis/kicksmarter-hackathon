import { Lines } from '@/interfaces/global';
import { FC, useCallback, useState } from 'react';
import { useDrag } from '@visx/drag';
import { LinePath } from '@visx/shape';
import { curveBasis } from '@visx/curve';
import { CustomDrawProps } from '@/interfaces/components/CustomDrawProps';

const CustomDraw: FC<CustomDrawProps> = ({ width, height }) => {
    const [lines, setLines] = useState<Lines>([]);

    const onDragStart = useCallback(
        (currDrag: any) => {
            // add the new line with the starting point
            setLines((currLines) => [...currLines, [{ x: currDrag.x, y: currDrag.y }]]);
        },
        [setLines]
    );

    const onDragMove = useCallback(
        (currDrag: any) => {
            // add the new point to the current line
            setLines((currLines) => {
                const nextLines = [...currLines];
                const newPoint = { x: currDrag.x + currDrag.dx, y: currDrag.y + currDrag.dy };
                const lastIndex = nextLines.length - 1;
                nextLines[lastIndex] = [...(nextLines[lastIndex] || []), newPoint];
                return nextLines;
            });
        },
        [setLines]
    );

    const {
        x = 0,
        y = 0,
        dx,
        dy,
        isDragging,
        dragStart,
        dragEnd,
        dragMove,
    } = useDrag({
        onDragStart,
        onDragMove,
        resetOnStart: true,
    });
    return (
        <>
            {lines.map((line, i) => (
                <LinePath
                    key={`line-${i}`}
                    fill="transparent"
                    stroke="red"
                    strokeWidth={4}
                    data={line}
                    curve={curveBasis}
                    x={(d) => d.x}
                    y={(d) => d.y}
                />
            ))}
            <g>
                {isDragging && (
                    /* capture mouse events (note: <Drag /> does this for you) */
                    <rect width={width} height={height} onMouseMove={dragMove} onMouseUp={dragEnd} fill="transparent" />
                )}
                {isDragging && (
                    <g>
                        <rect fill="white" width={8} height={8} x={x + dx - 4} y={y + dy - 4} pointerEvents="none" />
                        <circle cx={x} cy={y} r={4} fill="transparent" stroke="white" pointerEvents="none" />
                    </g>
                )}
                <rect
                    fill="transparent"
                    width={width}
                    height={height}
                    onMouseDown={dragStart}
                    onMouseUp={isDragging ? dragEnd : undefined}
                    onMouseMove={isDragging ? dragMove : undefined}
                    onTouchStart={dragStart}
                    onTouchEnd={isDragging ? dragEnd : undefined}
                    onTouchMove={isDragging ? dragMove : undefined}
                />
            </g>
        </>
    );
};

export default CustomDraw;
