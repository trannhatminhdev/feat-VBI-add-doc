import { expect, test } from '@rstest/core';
import {
  formatDimensionDateAggregate,
  getDefaultDimensionDateAggregate,
  getDimensionDateAggregateItems,
  isDateDimensionField,
  normalizeDimensionDateAggregate,
} from '../src/components/Shelfs/dimensionDateAggregateUtils';

test('detects date-like schema field types', () => {
  expect(isDateDimensionField('date')).toBe(true);
  expect(isDateDimensionField('datetime')).toBe(true);
  expect(isDateDimensionField('timestamp')).toBe(true);
  expect(isDateDimensionField('string')).toBe(false);
  expect(isDateDimensionField(undefined)).toBe(false);
});

test('returns full set of supported dimension date aggregates', () => {
  const items = getDimensionDateAggregateItems();
  const keys = items.map((item) => item.key);

  expect(keys).toEqual([
    'toYear',
    'toQuarter',
    'toMonth',
    'toWeek',
    'toDay',
    'toHour',
    'toMinute',
    'toSecond',
  ]);
});

test('uses toDay as the default date aggregate', () => {
  expect(getDefaultDimensionDateAggregate()).toEqual({ func: 'toDay' });
});

test('normalizes dimension date aggregates by schema type', () => {
  expect(normalizeDimensionDateAggregate({ func: 'toMonth' }, 'date')).toEqual({
    func: 'toMonth',
  });
  expect(normalizeDimensionDateAggregate({ func: 'toMonth' }, 'string')).toBe(
    undefined,
  );
  expect(
    normalizeDimensionDateAggregate({ func: 'sum' } as never, 'date'),
  ).toBe(undefined);
});

test('formats dimension date aggregate labels for display', () => {
  expect(formatDimensionDateAggregate(undefined)).toBeUndefined();
  expect(formatDimensionDateAggregate({ func: 'toYear' })).toBe('年');
  expect(formatDimensionDateAggregate({ func: 'toQuarter' })).toBe('季度');
  expect(formatDimensionDateAggregate({ func: 'toDay' })).toBe('日');
});
