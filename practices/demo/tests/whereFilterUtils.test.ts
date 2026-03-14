import { expect, test } from '@rstest/core';
import {
  getWhereDisplayText,
  getWhereFilterFormValue,
  getWhereFilterInputStrategy,
  normalizeWhereOperator,
  serializeWhereFilterValue,
} from '../src/components/Filter/whereFilterUtils';

test('normalizes legacy operators for UI display', () => {
  expect(normalizeWhereOperator('eq')).toBe('=');
  expect(normalizeWhereOperator('gte')).toBe('>=');
});

test('formats where display text for not between ranges', () => {
  expect(
    getWhereDisplayText({
      field: 'sales',
      operator: 'not between',
      value: { min: 100, max: 200, leftOp: '<=', rightOp: '<=' },
    }),
  ).toBe('not (100 <= sales <= 200)');
});

test('selects input strategy by operator and field role', () => {
  expect(getWhereFilterInputStrategy('in', 'dimension')).toBe('tags');
  expect(getWhereFilterInputStrategy('in', 'measure')).toBe('tags');
  expect(getWhereFilterInputStrategy('>', 'measure')).toBe('number');
  expect(getWhereFilterInputStrategy('like', 'dimension')).toBe('text');
});

test('converts stored tag values back to form values', () => {
  expect(getWhereFilterFormValue('in', ['华东', '华北'])).toEqual([
    '华东',
    '华北',
  ]);
  expect(getWhereFilterFormValue('in', '华东')).toEqual(['华东']);
});

test('serializes tag and numeric values with operator-aware rules', () => {
  expect(
    serializeWhereFilterValue({
      operator: 'in',
      fieldRole: 'dimension',
      value: ['华东', '华北'],
    }),
  ).toEqual(['华东', '华北']);

  expect(
    serializeWhereFilterValue({
      operator: 'in',
      fieldRole: 'measure',
      value: ['1', '2.5'],
    }),
  ).toEqual([1, 2.5]);

  expect(
    serializeWhereFilterValue({
      operator: '>',
      fieldRole: 'measure',
      value: '42',
    }),
  ).toBe(42);
});
