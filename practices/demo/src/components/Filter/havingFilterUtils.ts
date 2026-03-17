import { getMeasureAggregateItems } from 'src/components/Shelfs/measureAggregateUtils';

const UI_TO_DSL_OPERATOR: Record<string, string> = {
  '=': 'eq',
  '!=': 'ne',
  '>': 'gt',
  '>=': 'gte',
  '<': 'lt',
  '<=': 'lte',
};

const DSL_TO_UI_OPERATOR = Object.fromEntries(
  Object.entries(UI_TO_DSL_OPERATOR).map(([uiOperator, dslOperator]) => [
    dslOperator,
    uiOperator,
  ]),
) as Record<string, string>;

const SUPPORTED_AGGREGATES = new Set(
  getMeasureAggregateItems()
    .filter((item) => item.key !== 'quantile')
    .map((item) => item.key),
);

export const HAVING_OPERATOR_OPTIONS = [
  { label: '等于 (=)', value: '=' },
  { label: '不等于 (!=)', value: '!=' },
  { label: '大于 (>)', value: '>' },
  { label: '大于等于 (>=)', value: '>=' },
  { label: '小于 (<)', value: '<' },
  { label: '小于等于 (<=)', value: '<=' },
  { label: '范围 (between)', value: 'between' },
] as const;

export const HAVING_AGGREGATE_OPTIONS = getMeasureAggregateItems()
  .filter((item) => item.key !== 'quantile')
  .map((item) => ({
    label: item.label,
    value: item.key,
  }));

export const normalizeHavingOperator = (operator?: string) => {
  if (!operator) {
    return '=';
  }

  if (operator in UI_TO_DSL_OPERATOR) {
    return operator;
  }

  return DSL_TO_UI_OPERATOR[operator] ?? operator;
};

export const toHavingDslOperator = (operator: string) => {
  return UI_TO_DSL_OPERATOR[operator] ?? operator;
};

export const parseHavingOperator = (rawOperator?: string) => {
  const defaultResult = {
    aggregateFunc: 'sum',
    operator: '>' as string,
  };

  if (!rawOperator) {
    return defaultResult;
  }

  const match = rawOperator.match(/^([a-zA-Z_][\w]*)\((.*)\)$/);
  if (match) {
    const aggregateFunc = match[1];
    const operator = normalizeHavingOperator(match[2]);

    return {
      aggregateFunc: SUPPORTED_AGGREGATES.has(aggregateFunc)
        ? aggregateFunc
        : defaultResult.aggregateFunc,
      operator,
    };
  }

  return {
    aggregateFunc: defaultResult.aggregateFunc,
    operator: normalizeHavingOperator(rawOperator),
  };
};

export const buildHavingOperator = (params: {
  aggregateFunc: string;
  operator: string;
}) => {
  const aggregateFunc = SUPPORTED_AGGREGATES.has(params.aggregateFunc)
    ? params.aggregateFunc
    : 'sum';
  const dslOperator = toHavingDslOperator(params.operator);
  return `${aggregateFunc}(${dslOperator})`;
};

export const getHavingDisplayText = (params: {
  aggregateFunc: string;
  field: string;
  operator: string;
  value: unknown;
}) => {
  return `${params.aggregateFunc}(${params.field}) ${params.operator} ${params.value}`;
};
