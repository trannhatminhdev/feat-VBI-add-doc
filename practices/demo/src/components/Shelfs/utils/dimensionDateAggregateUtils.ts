import type { VBIDimension } from '@visactor/vbi';
import type { Translate } from 'src/i18n';
import { isDateSchemaType } from 'src/utils/fieldRole';

export type DimensionDateAggregate = NonNullable<VBIDimension['aggregate']>;
export const DIMENSION_DATE_AGGREGATE_KEYS = [
  'toYear',
  'toQuarter',
  'toMonth',
  'toWeek',
  'toDay',
  'toHour',
  'toMinute',
  'toSecond',
] as const;

export type DimensionDateAggregateKey =
  (typeof DIMENSION_DATE_AGGREGATE_KEYS)[number];

export type DimensionDateAggregateItem = {
  key: DimensionDateAggregateKey;
  label: string;
  shortLabel: string;
  aggregate: DimensionDateAggregate;
};

const ALL_DIMENSION_DATE_AGGREGATE_ITEM_DEFS: Array<{
  key: DimensionDateAggregateKey;
  aggregate: DimensionDateAggregate;
}> = [
  {
    key: 'toYear',
    aggregate: { func: 'toYear' },
  },
  {
    key: 'toQuarter',
    aggregate: { func: 'toQuarter' },
  },
  {
    key: 'toMonth',
    aggregate: { func: 'toMonth' },
  },
  {
    key: 'toWeek',
    aggregate: { func: 'toWeek' },
  },
  {
    key: 'toDay',
    aggregate: { func: 'toDay' },
  },
  {
    key: 'toHour',
    aggregate: { func: 'toHour' },
  },
  {
    key: 'toMinute',
    aggregate: { func: 'toMinute' },
  },
  {
    key: 'toSecond',
    aggregate: { func: 'toSecond' },
  },
];

const SUPPORTED_DIMENSION_DATE_AGGREGATE_FUNCS = new Set(
  ALL_DIMENSION_DATE_AGGREGATE_ITEM_DEFS.map((item) => item.key),
);

export const isDateDimensionField = (schemaType?: string) => {
  return isDateSchemaType(schemaType);
};

const toTranslationKeySuffix = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const getDimensionDateAggregateText = (
  key: DimensionDateAggregateKey,
  t: Translate,
  mode: 'label' | 'short' = 'label',
) => {
  return t(
    `aggregatesDate${toTranslationKeySuffix(key)}${toTranslationKeySuffix(mode)}`,
  );
};

export const getDimensionDateAggregateItems = (
  t: Translate,
): DimensionDateAggregateItem[] => {
  return ALL_DIMENSION_DATE_AGGREGATE_ITEM_DEFS.map((item) => ({
    ...item,
    label: getDimensionDateAggregateText(item.key, t, 'label'),
    shortLabel: getDimensionDateAggregateText(item.key, t, 'short'),
  }));
};

export const getDefaultDimensionDateAggregate = (): DimensionDateAggregate => {
  return { func: 'toDay' };
};

export const normalizeDimensionDateAggregate = (
  aggregate: VBIDimension['aggregate'] | undefined,
  schemaType?: string,
) => {
  if (!isDateDimensionField(schemaType) || !aggregate) {
    return undefined;
  }

  if (!SUPPORTED_DIMENSION_DATE_AGGREGATE_FUNCS.has(aggregate.func)) {
    return undefined;
  }

  return aggregate;
};

export const formatDimensionDateAggregate = (
  aggregate: DimensionDateAggregate | undefined,
  t: Translate,
) => {
  if (!aggregate) {
    return undefined;
  }

  return getDimensionDateAggregateText(aggregate.func, t, 'short');
};
