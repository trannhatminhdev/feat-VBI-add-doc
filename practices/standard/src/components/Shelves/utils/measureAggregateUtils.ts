import type { FieldRole } from 'src/utils/fieldRole';
import type { Translate } from 'src/i18n';
import { getFieldRoleBySchemaType } from 'src/utils/fieldRole';

export type MeasureFieldRole = FieldRole;

export type MeasureAggregate =
  | {
      func:
        | 'count'
        | 'countDistinct'
        | 'sum'
        | 'avg'
        | 'min'
        | 'max'
        | 'variance'
        | 'variancePop'
        | 'stddev'
        | 'median';
    }
  | {
      func: 'quantile';
      quantile?: number;
    };

export const MEASURE_AGGREGATE_KEYS = [
  'sum',
  'count',
  'countDistinct',
  'avg',
  'min',
  'max',
  'variance',
  'variancePop',
  'stddev',
  'median',
  'quantile',
] as const;

export type MeasureAggregateKey = (typeof MEASURE_AGGREGATE_KEYS)[number];

export type MeasureAggregateItem = {
  key: MeasureAggregateKey;
  label: string;
  shortLabel: string;
  aggregate: MeasureAggregate;
};

const ALL_MEASURE_AGGREGATE_ITEM_DEFS: Array<{
  key: MeasureAggregateKey;
  aggregate: MeasureAggregate;
}> = [
  { key: 'sum', aggregate: { func: 'sum' } },
  { key: 'count', aggregate: { func: 'count' } },
  {
    key: 'countDistinct',
    aggregate: { func: 'countDistinct' },
  },
  { key: 'avg', aggregate: { func: 'avg' } },
  { key: 'min', aggregate: { func: 'min' } },
  { key: 'max', aggregate: { func: 'max' } },
  {
    key: 'variance',
    aggregate: { func: 'variance' },
  },
  {
    key: 'variancePop',
    aggregate: { func: 'variancePop' },
  },
  { key: 'stddev', aggregate: { func: 'stddev' } },
  { key: 'median', aggregate: { func: 'median' } },
  {
    key: 'quantile',
    aggregate: { func: 'quantile', quantile: 0.5 },
  },
];

const DIMENSION_MEASURE_AGGREGATES = new Set([
  'count',
  'countDistinct',
  'min',
  'max',
]);

export const getMeasureFieldRoleBySchemaType = (
  schemaType?: string,
): MeasureFieldRole => {
  return getFieldRoleBySchemaType(schemaType);
};

const toTranslationKeySuffix = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const getMeasureAggregateText = (
  key: MeasureAggregateKey,
  t: Translate,
  mode: 'label' | 'short' = 'label',
) => {
  return t(
    `aggregatesMeasure${toTranslationKeySuffix(key)}${toTranslationKeySuffix(mode)}`,
  );
};

export const getMeasureAggregateItems = (
  t: Translate,
): MeasureAggregateItem[] => {
  return ALL_MEASURE_AGGREGATE_ITEM_DEFS.map((item) => ({
    ...item,
    label: getMeasureAggregateText(item.key, t, 'label'),
    shortLabel: getMeasureAggregateText(item.key, t, 'short'),
  }));
};

export const isAggregateSupportedByFieldRole = (
  aggregate: MeasureAggregate,
  fieldRole: MeasureFieldRole,
) => {
  if (fieldRole === 'measure') {
    return true;
  }

  return DIMENSION_MEASURE_AGGREGATES.has(aggregate.func);
};

export const getAggregateItemsByFieldRole = (
  fieldRole: MeasureFieldRole,
  t: Translate,
): MeasureAggregateItem[] => {
  return getMeasureAggregateItems(t).filter((item) =>
    isAggregateSupportedByFieldRole(item.aggregate, fieldRole),
  );
};

export const getDefaultAggregateByFieldRole = (
  fieldRole: MeasureFieldRole,
): MeasureAggregate => {
  if (fieldRole === 'dimension') {
    return { func: 'count' };
  }
  return { func: 'sum' };
};

export const formatMeasureAggregate = (
  aggregate: MeasureAggregate | undefined,
  t: Translate,
) => {
  if (!aggregate) {
    return undefined;
  }

  if (aggregate.func !== 'quantile') {
    return getMeasureAggregateText(aggregate.func, t, 'short');
  }

  const quantile = aggregate.quantile ?? 0.5;
  const percent = quantile * 100;
  const normalizedPercent = Number.isInteger(percent)
    ? `${percent}`
    : `${percent.toFixed(2)}`.replace(/\.?0+$/, '');

  return `P${normalizedPercent}`;
};
