export type YArrayLike<T = unknown> = {
  get: (index: number) => T | undefined;
  delete: (index: number, length: number) => void;
  insert: (index: number, content: T[]) => void;
};

const cloneYArrayItem = <T>(item: T): T => {
  if (
    item &&
    typeof item === 'object' &&
    'clone' in item &&
    typeof item.clone === 'function'
  ) {
    return item.clone() as T;
  }

  return item;
};

export const reorderYArray = <T>(params: {
  yArray: YArrayLike<T>;
  dragIndex: number;
  dropIndex: number;
}) => {
  const { yArray, dragIndex, dropIndex } = params;
  if (dragIndex < 0 || dropIndex < 0 || dragIndex === dropIndex) {
    return;
  }

  const draggedItem = yArray.get(dragIndex);
  if (!draggedItem) {
    return;
  }
  const nextItem = cloneYArrayItem(draggedItem);

  yArray.delete(dragIndex, 1);
  const insertIndex = dragIndex < dropIndex ? dropIndex - 1 : dropIndex;
  yArray.insert(insertIndex, [nextItem]);
};

export const reorderYArrayByInsertIndex = <T>(params: {
  yArray: YArrayLike<T>;
  dragIndex: number;
  insertIndex: number;
}) => {
  const { yArray, dragIndex, insertIndex } = params;
  if (dragIndex < 0 || insertIndex < 0) {
    return;
  }

  const draggedItem = yArray.get(dragIndex);
  if (!draggedItem) {
    return;
  }
  const nextItem = cloneYArrayItem(draggedItem);

  const normalizedInsertIndex =
    dragIndex < insertIndex ? insertIndex - 1 : insertIndex;
  if (normalizedInsertIndex === dragIndex) {
    return;
  }

  yArray.delete(dragIndex, 1);
  yArray.insert(normalizedInsertIndex, [nextItem]);
};
