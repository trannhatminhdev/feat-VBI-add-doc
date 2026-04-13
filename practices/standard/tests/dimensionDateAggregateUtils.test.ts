import { expect, test } from '@rstest/core';
import {
  getDefaultDimensionDateAggregate,
  isDateDimensionField,
  normalizeDimensionDateAggregate,
} from '../src/components/Shelves/dimensionDateAggregateUtils';

test('detects date-like schema field types', () => {
  expect(isDateDimensionField('date')).toBe(true);
  expect(isDateDimensionField('datetime')).toBe(true);
  expect(isDateDimensionField('timestamp')).toBe(true);
  expect(isDateDimensionField('string')).toBe(false);
  expect(isDateDimensionField(undefined)).toBe(false);
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
