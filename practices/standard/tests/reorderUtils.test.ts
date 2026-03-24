import { expect, test } from '@rstest/core';
import { reorderYArrayByInsertIndex } from '../src/components/Shelfs/reorderUtils';

const createMockYArray = <T>(initial: T[]) => {
  const values = [...initial];

  return {
    values,
    yArray: {
      get: (index: number) => values[index],
      delete: (index: number, length: number) => {
        values.splice(index, length);
      },
      insert: (index: number, content: T[]) => {
        values.splice(index, 0, ...content);
      },
    },
  };
};

test('reorders y array by insert index in forward direction', () => {
  const { values, yArray } = createMockYArray(['a', 'b', 'c', 'd']);

  reorderYArrayByInsertIndex({
    yArray,
    dragIndex: 0,
    insertIndex: 3,
  });

  expect(values).toEqual(['b', 'c', 'a', 'd']);
});

test('reorders y array by insert index in backward direction', () => {
  const { values, yArray } = createMockYArray(['a', 'b', 'c', 'd']);

  reorderYArrayByInsertIndex({
    yArray,
    dragIndex: 3,
    insertIndex: 1,
  });

  expect(values).toEqual(['a', 'd', 'b', 'c']);
});

test('ignores no-op insert index', () => {
  const { values, yArray } = createMockYArray(['a', 'b', 'c']);

  reorderYArrayByInsertIndex({
    yArray,
    dragIndex: 1,
    insertIndex: 2,
  });

  expect(values).toEqual(['a', 'b', 'c']);
});

test('clones reorder item when clone api exists', () => {
  const createCloneableItem = (id: string) => {
    return {
      id,
      clone() {
        return createCloneableItem(id);
      },
    };
  };

  const values = [createCloneableItem('amount'), createCloneableItem('profit')];
  const yArray = {
    get: (index: number) => values[index],
    delete: (index: number, length: number) => {
      const deleted = values.splice(index, length);
      deleted.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (key !== 'clone') {
            delete (item as Record<string, unknown>)[key];
          }
        });
      });
    },
    insert: (index: number, content: (typeof values)[number][]) => {
      values.splice(index, 0, ...content);
    },
  };

  reorderYArrayByInsertIndex({
    yArray,
    dragIndex: 0,
    insertIndex: 2,
  });

  expect(values.map((item) => item.id)).toEqual(['profit', 'amount']);
});
