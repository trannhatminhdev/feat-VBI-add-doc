import { expect, test } from '@rstest/core';
import {
  getNormalizedReorderIndex,
  isNoopShelfReorder,
  normalizeShelfInsertIndex,
  resolveShelfDropAction,
} from '../src/components/Shelves/dnd';

test('normalizes reorder index for forward and backward moves', () => {
  expect(getNormalizedReorderIndex(0, 2)).toBe(1);
  expect(getNormalizedReorderIndex(3, 1)).toBe(1);
});

test('treats self-edge drops as no-op reorders', () => {
  expect(
    isNoopShelfReorder({
      dragIndex: 1,
      insertIndex: 1,
    }),
  ).toBe(true);

  expect(
    isNoopShelfReorder({
      dragIndex: 1,
      insertIndex: 2,
    }),
  ).toBe(true);
});

test('keeps adjacent item swap as a real reorder', () => {
  expect(
    resolveShelfDropAction({
      activeDrag: {
        kind: 'shelf-item',
        shelf: 'dimensions',
        itemId: 'a',
        index: 0,
        payload: {
          field: 'region',
          role: 'dimension',
        },
        label: 'region',
      },
      overTarget: {
        kind: 'shelf-insert',
        shelf: 'dimensions',
        insertIndex: 2,
        anchor: 'after',
      },
      targetItemCount: 2,
    }),
  ).toEqual({
    type: 'reorder',
    shelf: 'dimensions',
    dragIndex: 0,
    insertIndex: 2,
  });
});

test('resolves schema field drop to add action', () => {
  expect(
    resolveShelfDropAction({
      activeDrag: {
        kind: 'schema-field',
        payload: {
          field: 'sales',
          type: 'number',
          role: 'measure',
        },
        label: 'sales',
      },
      overTarget: {
        kind: 'shelf-insert',
        shelf: 'measures',
        insertIndex: 99,
        anchor: 'tail',
      },
      targetItemCount: 3,
    }),
  ).toEqual({
    type: 'add-field',
    targetShelf: 'measures',
    insertIndex: 3,
    payload: {
      field: 'sales',
      type: 'number',
      role: 'measure',
    },
  });
});

test('resolves cross-shelf move and clamps insert index', () => {
  expect(
    resolveShelfDropAction({
      activeDrag: {
        kind: 'shelf-item',
        shelf: 'dimensions',
        itemId: 'region-id',
        index: 0,
        payload: {
          field: 'region',
          role: 'dimension',
        },
        label: 'region',
      },
      overTarget: {
        kind: 'shelf-insert',
        shelf: 'where',
        insertIndex: -4,
        anchor: 'before',
      },
      targetItemCount: 2,
    }),
  ).toEqual({
    type: 'move-item',
    sourceShelf: 'dimensions',
    targetShelf: 'where',
    insertIndex: 0,
    itemId: 'region-id',
    payload: {
      field: 'region',
      role: 'dimension',
    },
  });
});

test('clamps insert index boundaries', () => {
  expect(normalizeShelfInsertIndex(-3, 4)).toBe(0);
  expect(normalizeShelfInsertIndex(6, 4)).toBe(4);
});
