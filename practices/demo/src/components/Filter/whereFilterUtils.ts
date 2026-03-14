export type WhereFilterFieldRole = 'dimension' | 'measure';

export type WhereFilterRangeValue = {
  min?: unknown;
  max?: unknown;
  leftOp?: '<' | '<=';
  rightOp?: '<' | '<=';
};

export type WhereFilterLike = {
  field: string;
  operator?: string;
  value: unknown;
};

export type WhereFilterInputStrategy =
  | 'none'
  | 'range'
  | 'tags'
  | 'number'
  | 'text';

const OPERATOR_ALIASES: Record<string, string> = {
  eq: '=',
  ne: '!=',
  neq: '!=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
};

const NO_VALUE_OPERATORS = new Set(['is null', 'is not null']);
const RANGE_OPERATORS = new Set(['between', 'not between']);
const TAG_OPERATORS = new Set(['in', 'not in']);

export const DIMENSION_OPERATORS = [
  { label: '等于 (=)', value: '=' },
  { label: '不等于 (!=)', value: '!=' },
  { label: '包含任一 (in)', value: 'in' },
  { label: '不包含 (not in)', value: 'not in' },
  { label: '模糊匹配 (like)', value: 'like' },
  { label: '不匹配 (not like)', value: 'not like' },
  { label: '不区分大小写匹配 (ilike)', value: 'ilike' },
  { label: '不区分大小写不匹配 (not ilike)', value: 'not ilike' },
  { label: '为空 (is null)', value: 'is null' },
  { label: '不为空 (is not null)', value: 'is not null' },
];

export const MEASURE_OPERATORS = [
  { label: '等于 (=)', value: '=' },
  { label: '不等于 (!=)', value: '!=' },
  { label: '大于 (>)', value: '>' },
  { label: '大于等于 (>=)', value: '>=' },
  { label: '小于 (<)', value: '<' },
  { label: '小于等于 (<=)', value: '<=' },
  { label: '包含任一 (in)', value: 'in' },
  { label: '不包含 (not in)', value: 'not in' },
  { label: '范围 (between)', value: 'between' },
  { label: '不在范围内 (not between)', value: 'not between' },
  { label: '为空 (is null)', value: 'is null' },
  { label: '不为空 (is not null)', value: 'is not null' },
];

export function normalizeWhereOperator(operator?: string): string {
  if (!operator) {
    return '=';
  }
  return OPERATOR_ALIASES[operator] ?? operator;
}

export function getDefaultWhereOperator(role: WhereFilterFieldRole): string {
  void role;
  return '=';
}

export function getWhereFilterInputStrategy(
  operator: string | undefined,
  fieldRole: WhereFilterFieldRole,
): WhereFilterInputStrategy {
  const normalizedOperator = normalizeWhereOperator(operator);

  if (NO_VALUE_OPERATORS.has(normalizedOperator)) {
    return 'none';
  }
  if (RANGE_OPERATORS.has(normalizedOperator)) {
    return 'range';
  }
  if (TAG_OPERATORS.has(normalizedOperator)) {
    return 'tags';
  }
  if (fieldRole === 'measure') {
    return 'number';
  }
  return 'text';
}

function isRangeObject(value: unknown): value is WhereFilterRangeValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeWhereRangeValue(
  value: unknown,
): WhereFilterRangeValue {
  if (Array.isArray(value)) {
    return {
      min: value[0],
      max: value[1],
      leftOp: '<=',
      rightOp: '<=',
    };
  }

  if (isRangeObject(value)) {
    return {
      min: value.min,
      max: value.max,
      leftOp: value.leftOp === '<' ? '<' : '<=',
      rightOp: value.rightOp === '<' ? '<' : '<=',
    };
  }

  return {
    min: undefined,
    max: undefined,
    leftOp: '<=',
    rightOp: '<=',
  };
}

export function getWhereFilterFormValue(
  operator: string | undefined,
  value: unknown,
) {
  const normalizedOperator = normalizeWhereOperator(operator);

  if (NO_VALUE_OPERATORS.has(normalizedOperator)) {
    return undefined;
  }

  if (RANGE_OPERATORS.has(normalizedOperator)) {
    return normalizeWhereRangeValue(value);
  }

  if (TAG_OPERATORS.has(normalizedOperator)) {
    if (Array.isArray(value)) {
      return value.map((item) => String(item));
    }
    if (value === undefined || value === null || value === '') {
      return [];
    }
    return [String(value)];
  }

  return value;
}

function parseNumericValue(value: unknown) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'number') {
    return value;
  }

  const parsed = Number(String(value).trim());
  return Number.isNaN(parsed) ? value : parsed;
}

function parseTagValues(value: unknown, fieldRole: WhereFilterFieldRole) {
  const rawValues = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : value === undefined || value === null || value === ''
        ? []
        : [value];

  return rawValues
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0)
    .map((item) => (fieldRole === 'measure' ? parseNumericValue(item) : item));
}

export function serializeWhereFilterValue(params: {
  operator: string | undefined;
  fieldRole: WhereFilterFieldRole;
  value: unknown;
}) {
  const { operator, fieldRole, value } = params;
  const strategy = getWhereFilterInputStrategy(operator, fieldRole);

  if (strategy === 'none') {
    return undefined;
  }

  if (strategy === 'range') {
    return normalizeWhereRangeValue(value);
  }

  if (strategy === 'tags') {
    return parseTagValues(value, fieldRole);
  }

  if (strategy === 'number') {
    return parseNumericValue(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }

  return value;
}

export function getWhereDisplayText(item: WhereFilterLike): string {
  const operator = normalizeWhereOperator(item.operator);

  if (NO_VALUE_OPERATORS.has(operator)) {
    return `${item.field} ${operator}`;
  }

  if (RANGE_OPERATORS.has(operator)) {
    const range = normalizeWhereRangeValue(item.value);
    const expression =
      `${range.min ?? ''} ${range.leftOp ?? '<='} ${item.field} ${range.rightOp ?? '<='} ${range.max ?? ''}`.trim();
    return operator === 'not between' ? `not (${expression})` : expression;
  }

  const valueText = Array.isArray(item.value)
    ? item.value.join(', ')
    : String(item.value ?? '');
  return `${item.field} ${operator} ${valueText}`;
}
