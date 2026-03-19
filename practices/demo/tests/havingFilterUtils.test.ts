import { expect, test } from '@rstest/core';
import {
  getDefaultHavingAggregateByFieldRole,
  getDefaultHavingOperator,
  getHavingFilterFormValue,
  getHavingFilterInputStrategy,
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

test('derives numeric mode and operator availability by aggregate role', () => {
  expect(isHavingNumericAggregate('measure', { func: 'sum' })).toBe(true);
  expect(isHavingNumericAggregate('dimension', { func: 'count' })).toBe(true);
  expect(isHavingNumericAggregate('dimension', { func: 'min' })).toBe(false);

  expect(getDefaultHavingOperator(true)).toBe('>');
  expect(getDefaultHavingOperator(false)).toBe('=');
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

test('converts aggregate function key to aggregate config', () => {
  expect(toHavingAggregate('sum')).toEqual({ func: 'sum' });
  expect(toHavingAggregate('quantile')).toEqual({
    func: 'quantile',
    quantile: 0.5,
  });
  expect(toHavingAggregate('unknown')).toEqual({ func: 'sum' });
});
