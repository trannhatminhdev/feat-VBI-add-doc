import { useDroppable } from '@dnd-kit/core';
import { useShelfDndContext } from './ShelfDndProvider';
import { ShelfDropIndicator } from './ShelfDropIndicator';
import {
  createShelfInsertId,
  type ShelfInsertAnchor,
  type ShelfInsertTargetData,
  type ShelfType,
} from './types';

const DROP_ZONE_SIZE = 24;

export const ShelfBoundaryDropZone = ({
  shelf,
  insertIndex,
  anchor,
  color,
  edge,
}: {
  shelf: ShelfType;
  insertIndex: number;
  anchor: ShelfInsertAnchor;
  color: string;
  edge: 'start' | 'end';
}) => {
  const { isDragging } = useShelfDndContext();
  const { setNodeRef, isOver } = useDroppable({
    id: createShelfInsertId({
      shelf,
      insertIndex,
      anchor,
    }),
    data: {
      kind: 'shelf-insert',
      shelf,
      insertIndex,
      anchor,
    } satisfies ShelfInsertTargetData,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        top: '50%',
        [edge]: 0,
        width: DROP_ZONE_SIZE,
        height: 22,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: edge === 'start' ? 'flex-start' : 'flex-end',
        transform: 'translateY(-50%)',
        opacity: isDragging ? 1 : 0.85,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <ShelfDropIndicator color={color} isActive={isOver} />
    </div>
  );
};
