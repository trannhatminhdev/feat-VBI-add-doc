import { useDroppable } from '@dnd-kit/core';
import { useShelfDndContext } from './ShelfDndProvider';
import { ShelfDropIndicator } from './ShelfDropIndicator';
import {
  createShelfInsertId,
  type ShelfInsertAnchor,
  type ShelfInsertTargetData,
  type ShelfType,
} from './types';

export const DropArea = ({
  shelf,
  insertIndex,
  anchor,
  color,
  flexible = false,
}: {
  shelf: ShelfType;
  insertIndex: number;
  anchor: ShelfInsertAnchor;
  color: string;
  flexible?: boolean;
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
        width: flexible ? 'auto' : 24,
        minWidth: 24,
        height: 22,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: flexible ? 'flex-start' : 'center',
        flexShrink: 0,
        flex: flexible ? '1 0 24px' : '0 0 24px',
        opacity: isDragging ? 1 : 0.85,
      }}
    >
      <ShelfDropIndicator color={color} isActive={isOver} />
    </div>
  );
};
