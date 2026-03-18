import type { VBIDimension } from '@visactor/vbi';
import { isDateSchemaType } from 'src/utils/fieldRole';

export type DimensionDateAggregate = NonNullable<VBIDimension['aggregate']>;

export type DimensionDateAggregateItem = {
  key: DimensionDateAggregate['func'];
  label: string;
  shortLabel: string;
  aggregate: DimensionDateAggregate;
};

const ALL_DIMENSION_DATE_AGGREGATE_ITEMS: DimensionDateAggregateItem[] = [
  {
    key: 'toYear',
    label: '年 (toYear)',
    shortLabel: '年',
    aggregate: { func: 'toYear' },
  },
  {
    key: 'toQuarter',
    label: '季度 (toQuarter)',
    shortLabel: '季度',
    aggregate: { func: 'toQuarter' },
  },
  {
    key: 'toMonth',
    label: '月 (toMonth)',
    shortLabel: '月',
    aggregate: { func: 'toMonth' },
  },
  {
    key: 'toWeek',
    label: '周 (toWeek)',
    shortLabel: '周',
    aggregate: { func: 'toWeek' },
  },
  {
    key: 'toDay',
    label: '日 (toDay)',
    shortLabel: '日',
    aggregate: { func: 'toDay' },
  },
  {
    key: 'toHour',
    label: '小时 (toHour)',
    shortLabel: '小时',
    aggregate: { func: 'toHour' },
  },
  {
    key: 'toMinute',
    label: '分钟 (toMinute)',
    shortLabel: '分钟',
    aggregate: { func: 'toMinute' },
  },
  {
    key: 'toSecond',
    label: '秒 (toSecond)',
    shortLabel: '秒',
    aggregate: { func: 'toSecond' },
  },
];

const SUPPORTED_DIMENSION_DATE_AGGREGATE_FUNCS = new Set(
  ALL_DIMENSION_DATE_AGGREGATE_ITEMS.map((item) => item.key),
);
const DIMENSION_DATE_AGGREGATE_ITEM_MAP = new Map(
  ALL_DIMENSION_DATE_AGGREGATE_ITEMS.map((item) => [item.key, item]),
);

export const isDateDimensionField = (schemaType?: string) => {
  return isDateSchemaType(schemaType);
};

export const getDimensionDateAggregateItems = () => {
  return [...ALL_DIMENSION_DATE_AGGREGATE_ITEMS];
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
) => {
  if (!aggregate) {
    return undefined;
  }

  return DIMENSION_DATE_AGGREGATE_ITEM_MAP.get(aggregate.func)?.shortLabel;
};
