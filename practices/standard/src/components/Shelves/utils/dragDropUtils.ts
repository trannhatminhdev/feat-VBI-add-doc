import type { FieldRole } from 'src/utils/fieldRole';

export type FieldDragPayload = {
  kind: 'field';
  field: string;
  type?: string;
  role: FieldRole;
};

type LegacyFieldDragPayload = {
  field?: string;
  type?: string;
  role?: FieldRole;
};

const SHELF_INDEX_PREFIX = 'shelf-index:';

const parseJSON = (rawValue: string): unknown => {
  if (!rawValue) {
    return undefined;
  }

  try {
    return JSON.parse(rawValue) as unknown;
  } catch {
    return undefined;
  }
};

export const createFieldDragPayload = (params: {
  field: string;
  type?: string;
  role: FieldRole;
}): FieldDragPayload => {
  return {
    kind: 'field',
    field: params.field,
    type: params.type,
    role: params.role,
  };
};

export const writeFieldDragPayload = (
  e: React.DragEvent,
  payload: FieldDragPayload,
) => {
  e.dataTransfer.setData('application/json', JSON.stringify(payload));
  e.dataTransfer.effectAllowed = 'copy';
};

export const readFieldDragPayload = (
  e: React.DragEvent,
): FieldDragPayload | undefined => {
  const parsed = parseJSON(e.dataTransfer.getData('application/json'));
  if (!parsed || typeof parsed !== 'object') {
    return undefined;
  }

  if ('kind' in parsed && (parsed as { kind?: string }).kind === 'field') {
    const payload = parsed as Partial<FieldDragPayload>;
    if (!payload.field || !payload.role) {
      return undefined;
    }

    return {
      kind: 'field',
      field: payload.field,
      type: payload.type,
      role: payload.role,
    };
  }

  const legacyPayload = parsed as LegacyFieldDragPayload;
  if (!legacyPayload.field || !legacyPayload.role) {
    return undefined;
  }

  return {
    kind: 'field',
    field: legacyPayload.field,
    type: legacyPayload.type,
    role: legacyPayload.role,
  };
};

export const writeShelfDragIndex = (e: React.DragEvent, index: number) => {
  e.dataTransfer.setData('text/plain', `${SHELF_INDEX_PREFIX}${index}`);
  e.dataTransfer.effectAllowed = 'move';
};

export const readShelfDragIndex = (e: React.DragEvent): number | undefined => {
  const rawValue = e.dataTransfer.getData('text/plain');
  if (!rawValue) {
    return undefined;
  }

  if (rawValue.startsWith(SHELF_INDEX_PREFIX)) {
    const parsed = Number.parseInt(
      rawValue.slice(SHELF_INDEX_PREFIX.length),
      10,
    );
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  const legacyIndex = Number.parseInt(rawValue, 10);
  return Number.isNaN(legacyIndex) ? undefined : legacyIndex;
};
