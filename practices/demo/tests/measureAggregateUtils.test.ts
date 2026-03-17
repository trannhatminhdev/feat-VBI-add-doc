import { expect, test } from '@rstest/core';
import {
  formatMeasureAggregate,
  getAggregateItemsByFieldRole,
  getDefaultAggregateByFieldRole,
  getMeasureFieldRoleBySchemaType,
  isAggregateSupportedByFieldRole,
} from '../src/components/Shelfs/measureAggregateUtils';

test('returns correct field role by schema type', () => {
  expect(getMeasureFieldRoleBySchemaType('number')).toBe('measure');
  expect(getMeasureFieldRoleBySchemaType('string')).toBe('dimension');
  expect(getMeasureFieldRoleBySchemaType(undefined)).toBe('dimension');
});

test('returns default aggregate by field role', () => {
  expect(getDefaultAggregateByFieldRole('measure')).toEqual({ func: 'sum' });
  expect(getDefaultAggregateByFieldRole('dimension')).toEqual({
    func: 'count',
  });
});

test('dimension fields only expose supported aggregate funcs', () => {
  const items = getAggregateItemsByFieldRole('dimension');
  const keys = items.map((item) => item.key);

  expect(keys).toEqual(['count', 'countDistinct', 'min', 'max']);
});

test('measure fields expose extended aggregate funcs', () => {
  const items = getAggregateItemsByFieldRole('measure');
  const keys = items.map((item) => item.key);

  expect(keys).toContain('sum');
  expect(keys).toContain('variance');
  expect(keys).toContain('variancePop');
  expect(keys).toContain('stddev');
  expect(keys).toContain('median');
  expect(keys).toContain('quantile');
});

test('checks aggregate support by field role', () => {
  expect(isAggregateSupportedByFieldRole({ func: 'count' }, 'dimension')).toBe(
    true,
  );
  expect(isAggregateSupportedByFieldRole({ func: 'min' }, 'dimension')).toBe(
    true,
  );
  expect(isAggregateSupportedByFieldRole({ func: 'sum' }, 'dimension')).toBe(
    false,
  );
  expect(
    isAggregateSupportedByFieldRole(
      { func: 'quantile', quantile: 0.8 },
      'dimension',
    ),
  ).toBe(false);
});

test('formats aggregate labels for display', () => {
  expect(formatMeasureAggregate(undefined)).toBeUndefined();
  expect(formatMeasureAggregate({ func: 'sum' })).toBe('sum');
  expect(formatMeasureAggregate({ func: 'quantile' })).toBe('p50');
  expect(formatMeasureAggregate({ func: 'quantile', quantile: 0.8 })).toBe(
    'p80',
  );
});
