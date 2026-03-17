import { expect, test } from '@rstest/core';
import {
  HAVING_AGGREGATE_OPTIONS,
  buildHavingOperator,
  normalizeHavingOperator,
  parseHavingOperator,
} from '../src/components/Filter/havingFilterUtils';

test('normalizes having operators for UI', () => {
  expect(normalizeHavingOperator('eq')).toBe('=');
  expect(normalizeHavingOperator('gte')).toBe('>=');
  expect(normalizeHavingOperator('>')).toBe('>');
});

test('parses and builds aggregate operators', () => {
  expect(parseHavingOperator('countDistinct(gte)')).toEqual({
    aggregateFunc: 'countDistinct',
    operator: '>=',
  });

  expect(
    buildHavingOperator({
      aggregateFunc: 'variancePop',
      operator: '>=',
    }),
  ).toBe('variancePop(gte)');
});

test('falls back to supported defaults for unsupported aggregate names', () => {
  expect(parseHavingOperator('unknown(gt)')).toEqual({
    aggregateFunc: 'sum',
    operator: '>',
  });

  expect(
    buildHavingOperator({
      aggregateFunc: 'unknown',
      operator: '>',
    }),
  ).toBe('sum(gt)');
});

test('having aggregate options include extended aggregate funcs', () => {
  const values = HAVING_AGGREGATE_OPTIONS.map((item) => item.value);
  expect(values).toContain('countDistinct');
  expect(values).toContain('variancePop');
});
