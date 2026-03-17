import { expect, test } from '@rstest/core';
import {
  getDefaultHavingAggregateByFieldRole,
  getDefaultHavingOperator,
  getHavingAggregateOptionGroupsByFieldRole,
  getHavingDisplayText,
  getHavingFilterFormValue,
  getHavingFilterInputStrategy,
  getHavingOperatorOptions,
  isHavingNumericAggregate,
  normalizeHavingAggregate,
  normalizeHavingOperator,
  serializeHavingFilterValue,
  toHavingAggregate,
  toHavingDslOperator,
} from '../src/components/Filter/havingFilterUtils';

test('normalizes having operators between UI and DSL forms', () => {
  expect(normalizeHavingOperator('eq')).toBe('=');
  expect(normalizeHavingOperator('gte')).toBe('>=');
  expect(normalizeHavingOperator('NOT IN')).toBe('not in');
  expect(toHavingDslOperator('>')).toBe('gt');
  expect(toHavingDslOperator('not in')).toBe('not in');
});

test('uses role-based default and normalized aggregates', () => {
  expect(getDefaultHavingAggregateByFieldRole('measure')).toEqual({
    func: 'sum',
  });
  expect(getDefaultHavingAggregateByFieldRole('dimension')).toEqual({
    func: 'count',
  });

  expect(normalizeHavingAggregate(undefined, 'dimension')).toEqual({
    func: 'count',
  });
  expect(normalizeHavingAggregate({ func: 'sum' }, 'dimension')).toEqual({
    func: 'count',
  });
  expect(normalizeHavingAggregate({ func: 'quantile' }, 'measure')).toEqual({
    func: 'quantile',
    quantile: 0.5,
  });
});

test('exposes grouped aggregate options and limits dimension aggregates', () => {
  const dimensionValues = getHavingAggregateOptionGroupsByFieldRole(
    'dimension',
  ).flatMap((group) => group.options.map((item) => item.value));
  expect(dimensionValues).toEqual(['count', 'countDistinct', 'min', 'max']);

  const measureValues = getHavingAggregateOptionGroupsByFieldRole(
    'measure',
  ).flatMap((group) => group.options.map((item) => item.value));
  expect(measureValues).toContain('sum');
  expect(measureValues).toContain('variancePop');
  expect(measureValues).toContain('quantile');
});

test('derives numeric mode and operator availability by aggregate role', () => {
  expect(isHavingNumericAggregate('measure', { func: 'sum' })).toBe(true);
  expect(isHavingNumericAggregate('dimension', { func: 'count' })).toBe(true);
  expect(isHavingNumericAggregate('dimension', { func: 'min' })).toBe(false);

  expect(getDefaultHavingOperator(true)).toBe('>');
  expect(getDefaultHavingOperator(false)).toBe('=');

  const numericOperators = getHavingOperatorOptions(true).map(
    (item) => item.value,
  );
  const textOperators = getHavingOperatorOptions(false).map(
    (item) => item.value,
  );

  expect(numericOperators).toContain('between');
  expect(textOperators).not.toContain('between');
});

test('supports role-aware value strategy and serialization', () => {
  expect(getHavingFilterInputStrategy('between', true)).toBe('range');
  expect(getHavingFilterInputStrategy('in', false)).toBe('tags');
  expect(getHavingFilterInputStrategy('is null', true)).toBe('none');

  expect(getHavingFilterFormValue('between', [1, 5])).toEqual({
    min: 1,
    max: 5,
  });
  expect(getHavingFilterFormValue('in', [1, 2])).toEqual(['1', '2']);

  expect(
    serializeHavingFilterValue({
      operator: 'between',
      isNumericValue: true,
      value: { min: '1', max: '5' },
    }),
  ).toEqual([1, 5]);

  expect(
    serializeHavingFilterValue({
      operator: 'in',
      isNumericValue: true,
      value: ['1', '2'],
    }),
  ).toEqual([1, 2]);

  expect(
    serializeHavingFilterValue({
      operator: '=',
      isNumericValue: false,
      value: '  华东  ',
    }),
  ).toBe('华东');
});

test('formats display text with explicit aggregate config', () => {
  expect(
    getHavingDisplayText({
      field: 'sales',
      aggregate: { func: 'sum' },
      operator: 'gt',
      value: 100,
    }),
  ).toBe('sum(sales) > 100');

  expect(
    getHavingDisplayText({
      field: 'sales',
      aggregate: { func: 'sum' },
      operator: 'between',
      value: [1, 5],
    }),
  ).toBe('sum(sales) between [1, 5]');
});

test('converts aggregate function key to aggregate config', () => {
  expect(toHavingAggregate('sum')).toEqual({ func: 'sum' });
  expect(toHavingAggregate('quantile')).toEqual({
    func: 'quantile',
    quantile: 0.5,
  });
  expect(toHavingAggregate('unknown')).toEqual({ func: 'sum' });
});
