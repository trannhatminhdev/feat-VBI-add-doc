import type { FieldRole } from 'src/utils/fieldRole';

export type ShelfType = 'dimensions' | 'measures' | 'where' | 'having';
export type ShelfInsertAnchor = 'before' | 'after' | 'empty' | 'tail';

export type ShelfFieldPayload = {
  field: string;
  type?: string;
  role: FieldRole;
};

export type ShelfInsertTargetData = {
  kind: 'shelf-insert';
  shelf: ShelfType;
  insertIndex: number;
  anchor: ShelfInsertAnchor;
};

export type ShelfItemDragData = {
  kind: 'shelf-item';
  shelf: ShelfType;
  itemId: string;
  index: number;
  payload: ShelfFieldPayload;
  label: string;
};

export type SchemaFieldDragData = {
  kind: 'schema-field';
  payload: ShelfFieldPayload;
  label: string;
};

export type ShelfDragData = ShelfItemDragData | SchemaFieldDragData;

export type ShelfDndItem = {
  id: string;
  payload: ShelfFieldPayload;
};

export type ShelfDndAdapter = {
  shelf: ShelfType;
  items: ShelfDndItem[];
  addFieldAt: (payload: ShelfFieldPayload, insertIndex: number) => void;
  removeItem: (id: string) => void;
  reorderWithin: (dragIndex: number, insertIndex: number) => void;
};

export const createShelfItemDragId = (shelf: ShelfType, id: string) => {
  return `shelf-item:${shelf}:${id}`;
};

export const createShelfInsertId = (params: {
  shelf: ShelfType;
  insertIndex: number;
  anchor: ShelfInsertAnchor;
}) => {
  return `shelf-insert:${params.shelf}:${params.insertIndex}:${params.anchor}`;
};

export const createSchemaFieldDragId = (params: {
  field: string;
  role: FieldRole;
}) => {
  return `schema-field:${params.role}:${params.field}`;
};
