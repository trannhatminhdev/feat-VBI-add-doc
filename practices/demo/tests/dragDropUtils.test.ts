import { expect, test } from '@rstest/core';
import {
  createFieldDragPayload,
  readFieldDragPayload,
  readShelfDragIndex,
  writeFieldDragPayload,
  writeShelfDragIndex,
} from '../src/components/Shelfs/dragDropUtils';

const createMockDragEvent = () => {
  const store = new Map<string, string>();

  return {
    dataTransfer: {
      effectAllowed: 'none',
      setData: (type: string, value: string) => {
        store.set(type, value);
      },
      getData: (type: string) => {
        return store.get(type) ?? '';
      },
    },
  } as unknown as React.DragEvent;
};

test('writes and reads field drag payload', () => {
  const event = createMockDragEvent();

  writeFieldDragPayload(
    event,
    createFieldDragPayload({
      field: 'sales',
      type: 'number',
      role: 'measure',
    }),
  );

  expect(readFieldDragPayload(event)).toEqual({
    kind: 'field',
    field: 'sales',
    type: 'number',
    role: 'measure',
  });
});

test('reads legacy field drag payload', () => {
  const event = createMockDragEvent();
  event.dataTransfer.setData(
    'application/json',
    JSON.stringify({ field: 'region', type: 'string', role: 'dimension' }),
  );

  expect(readFieldDragPayload(event)).toEqual({
    kind: 'field',
    field: 'region',
    type: 'string',
    role: 'dimension',
  });
});

test('reads shelf drag index with new and legacy formats', () => {
  const event = createMockDragEvent();

  writeShelfDragIndex(event, 3);
  expect(readShelfDragIndex(event)).toBe(3);

  event.dataTransfer.setData('text/plain', '8');
  expect(readShelfDragIndex(event)).toBe(8);
});
