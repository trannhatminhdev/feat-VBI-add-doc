import type { VBIDimension, VBIMeasure } from '@visactor/vbi';
import {
  isDateDimensionField,
  normalizeDimensionDateAggregate,
} from './dimensionDateAggregateUtils';
import { getSortMenuSelectedKeys } from './sortUtils';

const toQuantilePercent = (quantile?: number) => {
  return Math.round((quantile ?? 0.5) * 100);
};

export const getMeasureMenuSelectedKeys = (measure: {
  aggregate?: VBIMeasure['aggregate'];
  encoding?: VBIMeasure['encoding'];
  sort?: VBIMeasure['sort'];
}) => {
  const keys = getSortMenuSelectedKeys(measure.sort);

  if (measure.encoding) {
    keys.push(`encoding:${measure.encoding}`);
  }

  if (!measure.aggregate) {
    return keys;
  }

  if (measure.aggregate.func !== 'quantile') {
    keys.push(`aggregate:${measure.aggregate.func}`);
    return keys;
  }

  keys.push('aggregate:quantile');
  keys.push(
    `aggregate:quantile:${toQuantilePercent(measure.aggregate.quantile)}`,
  );
  return keys;
};

export const getDimensionMenuSelectedKeys = (
  dimension: {
    aggregate?: VBIDimension['aggregate'];
    encoding?: VBIDimension['encoding'];
    sort?: VBIDimension['sort'];
  },
  schemaType?: string,
) => {
  const keys = getSortMenuSelectedKeys(dimension.sort);
  const isDateField = isDateDimensionField(schemaType);

  if (dimension.encoding) {
    keys.push(`encoding:${dimension.encoding}`);
  }

  const aggregate = normalizeDimensionDateAggregate(
    dimension.aggregate,
    schemaType,
  );

  if (isDateField && aggregate) {
    keys.push(`aggregate:${aggregate.func}`);
    return keys;
  }

  if (isDateField) {
    keys.push('aggregate:none');
  }

  return keys;
};
