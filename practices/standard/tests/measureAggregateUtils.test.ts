import { expect, test } from '@rstest/core';
import {
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
