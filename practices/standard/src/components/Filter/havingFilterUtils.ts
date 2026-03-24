import type { VBIHavingAggregate } from '@visactor/vbi';
import type { Translate } from 'src/i18n';
import {
  MEASURE_AGGREGATE_KEYS,
  getAggregateItemsByFieldRole,
  getMeasureAggregateText,
  isAggregateSupportedByFieldRole,
  type MeasureAggregate,
  type MeasureAggregateKey,
  type MeasureAggregateItem,
} from 'src/components/Shelfs/measureAggregateUtils';
import type { FieldRole } from 'src/utils/fieldRole';
import {
  getFilterOperatorDisplayLabel,
  getFilterOperatorOptionLabel,
} from './whereFilterUtils';

export type HavingFieldRole = FieldRole;

export type HavingFilterRangeValue = {
  min?: unknown;
  max?: unknown;
};

export type HavingFilterLike = {
  field: string;
  aggregate: VBIHavingAggregate;
  operator?: string;
  value: unknown;
};

export type HavingFilterInputStrategy =
  | 'none'
  | 'range'
  | 'tags'
  | 'number'
  | 'text';

export type HavingAggregateOption = {
  label: string;
  shortLabel: string;
  value: string;
};

export type HavingAggregateOptionGroup = {
  key: 'common' | 'advanced';
  label: string;
  options: HavingAggregateOption[];
};

const UI_TO_DSL_OPERATOR: Record<string, string> = {
  '=': 'eq',
  '!=': 'neq',
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

const NO_VALUE_OPERATORS = new Set(['is null', 'is not null']);
const RANGE_OPERATORS = new Set(['between', 'not between']);
const TAG_OPERATORS = new Set(['in', 'not in']);

const NUMERIC_HAVING_OPERATOR_VALUES = [
  '>',
  '>=',
  '<',
  '<=',
  'between',
  'not between',
] as const;

const COMMON_HAVING_OPERATOR_VALUES = [
  '=',
  '!=',
  'in',
  'not in',
  'is null',
  'is not null',
] as const;

const SUPPORTED_AGGREGATE_FUNCS = new Set<string>(MEASURE_AGGREGATE_KEYS);

const RECOMMENDED_AGGREGATES: Record<HavingFieldRole, Set<string>> = {
  measure: new Set(['sum', 'avg', 'count', 'countDistinct']),
  dimension: new Set(['count', 'countDistinct']),
};

const parseNumericValue = (value: unknown) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'number') {
    return value;
  }

  const parsed = Number(String(value).trim());
  return Number.isNaN(parsed) ? value : parsed;
};

const parseTagValues = (value: unknown, isNumericValue: boolean) => {
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
    .map((item) => (isNumericValue ? parseNumericValue(item) : item));
};

const toHavingAggregateOptions = (
  items: MeasureAggregateItem[],
): HavingAggregateOption[] => {
  return items.map((item) => ({
    label: item.label,
    shortLabel: item.shortLabel,
    value: item.key,
  }));
};

function isHavingRangeObject(value: unknown): value is HavingFilterRangeValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeHavingOperator(operator?: string): string {
  if (!operator) {
    return '=';
  }

  const trimmed = operator.trim();
  if (trimmed in UI_TO_DSL_OPERATOR) {
    return trimmed;
  }

  const normalized = trimmed.toLowerCase();
  return DSL_TO_UI_OPERATOR[normalized] ?? normalized;
}

export function toHavingDslOperator(operator: string): string {
  return UI_TO_DSL_OPERATOR[operator] ?? operator;
}

export function getDefaultHavingAggregateByFieldRole(
  fieldRole: HavingFieldRole,
): VBIHavingAggregate {
  if (fieldRole === 'dimension') {
    return { func: 'count' };
  }

  return { func: 'sum' };
}

export function toHavingAggregate(aggregateFunc: string): VBIHavingAggregate {
  if (!SUPPORTED_AGGREGATE_FUNCS.has(aggregateFunc)) {
    return { func: 'sum' };
  }

  if (aggregateFunc === 'quantile') {
    return { func: 'quantile', quantile: 0.5 };
  }

  return {
    func: aggregateFunc as Exclude<VBIHavingAggregate['func'], 'quantile'>,
  };
}

export function normalizeHavingAggregate(
  aggregate: VBIHavingAggregate | undefined,
  fieldRole: HavingFieldRole,
): VBIHavingAggregate {
  const fallback = getDefaultHavingAggregateByFieldRole(fieldRole);

  if (!aggregate || !SUPPORTED_AGGREGATE_FUNCS.has(aggregate.func)) {
    return fallback;
  }

  if (
    !isAggregateSupportedByFieldRole(aggregate as MeasureAggregate, fieldRole)
  ) {
    return fallback;
  }

  if (aggregate.func === 'quantile') {
    return {
      func: 'quantile',
      quantile:
        typeof aggregate.quantile === 'number' ? aggregate.quantile : 0.5,
    };
  }

  return { func: aggregate.func };
}

export function getHavingAggregateOptionsByFieldRole(
  fieldRole: HavingFieldRole,
  t: Translate,
): HavingAggregateOption[] {
  return toHavingAggregateOptions(getAggregateItemsByFieldRole(fieldRole, t));
}

export function getHavingAggregateOptionGroupsByFieldRole(
  fieldRole: HavingFieldRole,
  t: Translate,
): HavingAggregateOptionGroup[] {
  const recommendedSet = RECOMMENDED_AGGREGATES[fieldRole];
  const options = getHavingAggregateOptionsByFieldRole(fieldRole, t);

  const recommended = options.filter((item) => recommendedSet.has(item.value));
  const advanced = options.filter((item) => !recommendedSet.has(item.value));

  const groups: HavingAggregateOptionGroup[] = [
    {
      key: 'common',
      label: t('filtersOperatorGroupsCommon'),
      options: recommended,
    },
    {
      key: 'advanced',
      label: t('filtersOperatorGroupsAdvanced'),
      options: advanced,
    },
  ];

  return groups.filter((group) => group.options.length > 0);
}

export function isHavingNumericAggregate(
  fieldRole: HavingFieldRole,
  aggregate: VBIHavingAggregate,
): boolean {
  if (fieldRole === 'measure') {
    return true;
  }

  return aggregate.func === 'count' || aggregate.func === 'countDistinct';
}

export function getDefaultHavingOperator(isNumericValue: boolean): string {
  return isNumericValue ? '>' : '=';
}

export function getHavingOperatorOptions(
  isNumericValue: boolean,
  t: Translate,
) {
  const values = !isNumericValue
    ? COMMON_HAVING_OPERATOR_VALUES
    : [
        ...COMMON_HAVING_OPERATOR_VALUES.slice(0, 2),
        ...NUMERIC_HAVING_OPERATOR_VALUES,
        ...COMMON_HAVING_OPERATOR_VALUES.slice(2),
      ];

  return values.map((value) => ({
    label: getFilterOperatorOptionLabel(value, t),
    value,
  }));
}

export function getHavingFilterInputStrategy(
  operator: string | undefined,
  isNumericValue: boolean,
): HavingFilterInputStrategy {
  const normalizedOperator = normalizeHavingOperator(operator);

  if (NO_VALUE_OPERATORS.has(normalizedOperator)) {
    return 'none';
  }

  if (RANGE_OPERATORS.has(normalizedOperator)) {
    return 'range';
  }

  if (TAG_OPERATORS.has(normalizedOperator)) {
    return 'tags';
  }

  if (!isNumericValue) {
    return 'text';
  }

  return 'number';
}

export function normalizeHavingRangeValue(
  value: unknown,
): HavingFilterRangeValue {
  if (Array.isArray(value)) {
    return {
      min: value[0],
      max: value[1],
    };
  }

  if (isHavingRangeObject(value)) {
    return {
      min: value.min,
      max: value.max,
    };
  }

  return {
    min: undefined,
    max: undefined,
  };
}

export function getHavingFilterFormValue(
  operator: string | undefined,
  value: unknown,
) {
  const normalizedOperator = normalizeHavingOperator(operator);

  if (NO_VALUE_OPERATORS.has(normalizedOperator)) {
    return undefined;
  }

  if (RANGE_OPERATORS.has(normalizedOperator)) {
    return normalizeHavingRangeValue(value);
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

export function serializeHavingFilterValue(params: {
  operator: string | undefined;
  isNumericValue: boolean;
  value: unknown;
}) {
  const { operator, isNumericValue, value } = params;
  const strategy = getHavingFilterInputStrategy(operator, isNumericValue);

  if (strategy === 'none') {
    return undefined;
  }

  if (strategy === 'range') {
    const range = normalizeHavingRangeValue(value);
    return [
      isNumericValue ? parseNumericValue(range.min) : range.min,
      isNumericValue ? parseNumericValue(range.max) : range.max,
    ];
  }

  if (strategy === 'tags') {
    return parseTagValues(value, isNumericValue);
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

export function getHavingAggregateLabel(
  aggregate: VBIHavingAggregate,
  t: Translate,
  mode: 'label' | 'short' = 'label',
): string {
  if (!SUPPORTED_AGGREGATE_FUNCS.has(aggregate.func)) {
    return aggregate.func;
  }

  return getMeasureAggregateText(
    aggregate.func as MeasureAggregateKey,
    t,
    mode,
  );
}

export function getHavingDisplayText(
  item: HavingFilterLike,
  t: Translate,
): string {
  const normalizedOperator = normalizeHavingOperator(item.operator);
  const aggregateExpr = `${getHavingAggregateLabel(item.aggregate, t, 'short')}(${item.field})`;
  const operatorLabel = getFilterOperatorDisplayLabel(normalizedOperator, t);

  if (NO_VALUE_OPERATORS.has(normalizedOperator)) {
    return `${aggregateExpr} ${operatorLabel}`;
  }

  if (RANGE_OPERATORS.has(normalizedOperator)) {
    const range = normalizeHavingRangeValue(item.value);
    const minText = range.min ?? '';
    const maxText = range.max ?? '';
    return `${aggregateExpr} ${operatorLabel} [${minText}, ${maxText}]`;
  }

  const valueText = Array.isArray(item.value)
    ? item.value.join(', ')
    : String(item.value ?? '');

  return `${aggregateExpr} ${operatorLabel} ${valueText}`.trim();
}
