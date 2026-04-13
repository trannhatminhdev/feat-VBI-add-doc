import type {
  ShelfDragData,
  ShelfFieldPayload,
  ShelfInsertTargetData,
  ShelfType,
} from './types';

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

export const normalizeShelfInsertIndex = (
  insertIndex: number,
  itemCount: number,
) => {
  return clamp(insertIndex, 0, itemCount);
};

export const getNormalizedReorderIndex = (
  dragIndex: number,
  insertIndex: number,
) => {
  return dragIndex < insertIndex ? insertIndex - 1 : insertIndex;
};

export const isNoopShelfReorder = (params: {
  dragIndex: number;
  insertIndex: number;
}) => {
  const { dragIndex, insertIndex } = params;
  return getNormalizedReorderIndex(dragIndex, insertIndex) === dragIndex;
};

export type ShelfDropAction =
  | { type: 'none' }
  | {
      type: 'add-field';
      targetShelf: ShelfType;
      insertIndex: number;
      payload: ShelfFieldPayload;
    }
  | {
      type: 'reorder';
      shelf: ShelfType;
      dragIndex: number;
      insertIndex: number;
    }
  | {
      type: 'move-item';
      sourceShelf: ShelfType;
      targetShelf: ShelfType;
      insertIndex: number;
      itemId: string;
      payload: ShelfFieldPayload;
    };

export const resolveShelfDropAction = (params: {
  activeDrag: ShelfDragData | undefined;
  overTarget: ShelfInsertTargetData | undefined;
  targetItemCount: number;
}): ShelfDropAction => {
  const { activeDrag, overTarget, targetItemCount } = params;
  if (!activeDrag || !overTarget) {
    return { type: 'none' };
  }

  const insertIndex = normalizeShelfInsertIndex(
    overTarget.insertIndex,
    targetItemCount,
  );

  if (activeDrag.kind === 'schema-field') {
    return {
      type: 'add-field',
      targetShelf: overTarget.shelf,
      insertIndex,
      payload: activeDrag.payload,
    };
  }

  if (activeDrag.shelf === overTarget.shelf) {
    if (
      isNoopShelfReorder({
        dragIndex: activeDrag.index,
        insertIndex,
      })
    ) {
      return { type: 'none' };
    }

    return {
      type: 'reorder',
      shelf: activeDrag.shelf,
      dragIndex: activeDrag.index,
      insertIndex,
    };
  }

  return {
    type: 'move-item',
    sourceShelf: activeDrag.shelf,
    targetShelf: overTarget.shelf,
    insertIndex,
    itemId: activeDrag.itemId,
    payload: activeDrag.payload,
  };
};
