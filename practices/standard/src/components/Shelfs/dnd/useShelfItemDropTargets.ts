import { useDroppable } from '@dnd-kit/core';
import {
  createShelfInsertId,
  type ShelfInsertAnchor,
  type ShelfInsertTargetData,
  type ShelfType,
} from './types';

const createInsertTargetData = (params: {
  shelf: ShelfType;
  insertIndex: number;
  anchor: ShelfInsertAnchor;
}): ShelfInsertTargetData => {
  return {
    kind: 'shelf-insert',
    shelf: params.shelf,
    insertIndex: params.insertIndex,
    anchor: params.anchor,
  };
};

type ShelfItemDropTarget = {
  setNodeRef: (element: HTMLElement | null) => void;
  isOver: boolean;
};

export const useShelfItemDropTargets = ({
  shelf,
  index,
}: {
  shelf: ShelfType;
  index: number;
}): {
  before: ShelfItemDropTarget;
  after: ShelfItemDropTarget;
  isOver: boolean;
} => {
  const before = useDroppable({
    id: createShelfInsertId({
      shelf,
      insertIndex: index,
      anchor: 'before',
    }),
    data: createInsertTargetData({
      shelf,
      insertIndex: index,
      anchor: 'before',
    }),
  });

  const after = useDroppable({
    id: createShelfInsertId({
      shelf,
      insertIndex: index + 1,
      anchor: 'after',
    }),
    data: createInsertTargetData({
      shelf,
      insertIndex: index + 1,
      anchor: 'after',
    }),
  });

  return {
    before,
    after,
    isOver: before.isOver || after.isOver,
  };
};
