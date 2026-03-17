export type YArrayLike<T = unknown> = {
  get: (index: number) => T | undefined;
  delete: (index: number, length: number) => void;
  insert: (index: number, content: T[]) => void;
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

  yArray.delete(dragIndex, 1);
  const insertIndex = dragIndex < dropIndex ? dropIndex - 1 : dropIndex;
  yArray.insert(insertIndex, [draggedItem]);
};
