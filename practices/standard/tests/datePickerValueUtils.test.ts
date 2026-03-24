import dayjs from 'dayjs';
import { expect, test } from '@rstest/core';
import {
  formatDateInput,
  formatPickerDate,
  fromPeriodPickerDate,
  toPeriodPickerValue,
  toRangePickerValue,
} from '../src/components/Filter/datePickerValueUtils';

test('formats date inputs for picker display', () => {
  expect(formatDateInput('2026-03-19')).toBe('2026-03-19');
  expect(formatDateInput(new Date(Date.UTC(2026, 2, 20)))).toBe('2026-03-20');
  expect(formatDateInput(undefined)).toBe('');
  expect(formatPickerDate(dayjs('2026-03-21'))).toBe('2026-03-21');
});

test('maps range predicates to range picker values', () => {
  const [start, end] = toRangePickerValue({
    start: '2026-03-19',
    end: new Date(Date.UTC(2026, 2, 20)),
  });

  expect(start?.format('YYYY-MM-DD')).toBe('2026-03-19');
  expect(end?.format('YYYY-MM-DD')).toBe('2026-03-20');
});

test('round-trips period picker values across picker modes', () => {
  const year = toPeriodPickerValue({ unit: 'year', year: 2026 });
  const quarter = toPeriodPickerValue({
    unit: 'quarter',
    year: 2026,
    quarter: 4,
  });
  const month = toPeriodPickerValue({ unit: 'month', year: 2026, month: 3 });
  const week = toPeriodPickerValue({ unit: 'week', year: 2026, week: 12 });
  const day = toPeriodPickerValue({ unit: 'day', date: '2026-03-19' });

  expect(year && fromPeriodPickerDate('year', year)).toEqual({
    unit: 'year',
    year: 2026,
  });
  expect(quarter && fromPeriodPickerDate('quarter', quarter)).toEqual({
    unit: 'quarter',
    year: 2026,
    quarter: 4,
  });
  expect(month && fromPeriodPickerDate('month', month)).toEqual({
    unit: 'month',
    year: 2026,
    month: 3,
  });
  expect(week && fromPeriodPickerDate('week', week)).toEqual({
    unit: 'week',
    year: 2026,
    week: 12,
  });
  expect(day && fromPeriodPickerDate('day', day)).toEqual({
    unit: 'day',
    date: '2026-03-19',
  });
});
