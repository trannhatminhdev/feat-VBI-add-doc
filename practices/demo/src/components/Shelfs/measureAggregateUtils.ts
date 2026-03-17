export type MeasureFieldRole = 'dimension' | 'measure';

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

export type MeasureAggregateItem = {
  key: string;
  label: string;
  aggregate: MeasureAggregate;
};

const ALL_MEASURE_AGGREGATE_ITEMS: MeasureAggregateItem[] = [
  { key: 'sum', label: '求和 (sum)', aggregate: { func: 'sum' } },
  { key: 'count', label: '计数 (count)', aggregate: { func: 'count' } },
  {
    key: 'countDistinct',
    label: '去重计数 (countDistinct)',
    aggregate: { func: 'countDistinct' },
  },
  { key: 'avg', label: '平均值 (avg)', aggregate: { func: 'avg' } },
  { key: 'min', label: '最小值 (min)', aggregate: { func: 'min' } },
  { key: 'max', label: '最大值 (max)', aggregate: { func: 'max' } },
  {
    key: 'variance',
    label: '样本方差 (variance)',
    aggregate: { func: 'variance' },
  },
  {
    key: 'variancePop',
    label: '总体方差 (variancePop)',
    aggregate: { func: 'variancePop' },
  },
  { key: 'stddev', label: '标准差 (stddev)', aggregate: { func: 'stddev' } },
  { key: 'median', label: '中位数 (median)', aggregate: { func: 'median' } },
  {
    key: 'quantile',
    label: '分位数 (quantile)',
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
  return schemaType === 'number' ? 'measure' : 'dimension';
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
): MeasureAggregateItem[] => {
  return ALL_MEASURE_AGGREGATE_ITEMS.filter((item) =>
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
) => {
  if (!aggregate) {
    return undefined;
  }

  if (aggregate.func !== 'quantile') {
    return aggregate.func;
  }

  return `quantile(${aggregate.quantile ?? 0.5})`;
};
