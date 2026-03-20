import dayjs, { type Dayjs } from 'dayjs';
import type { VBIWhereDateInput, VBIWhereDatePeriod } from '@visactor/vbi';

const DAY_FORMAT = 'YYYY-MM-DD';

export function formatDateInput(
  value: VBIWhereDateInput | null | undefined,
): string {
  if (!value) {
    return '';
  }
  return value instanceof Date
    ? value.toISOString().slice(0, 10)
    : String(value);
}

export function formatPickerDate(value: Dayjs | null): string {
  return value ? value.format(DAY_FORMAT) : '';
}

export function toPickerDate(
  value: VBIWhereDateInput | null | undefined,
): Dayjs | null {
  const text = formatDateInput(value);
  if (!text) {
    return null;
  }
  const date = dayjs(text);
  return date.isValid() ? date : null;
}

export function toRangePickerValue(value: {
  start: VBIWhereDateInput;
  end: VBIWhereDateInput;
}): [Dayjs | null, Dayjs | null] {
  return [toPickerDate(value.start), toPickerDate(value.end)];
}

export function toPeriodPickerValue(value: VBIWhereDatePeriod): Dayjs | null {
  switch (value.unit) {
    case 'year':
      return dayjs(new Date(value.year, 0, 1));
    case 'quarter':
      return dayjs(new Date(value.year, (value.quarter - 1) * 3, 1));
    case 'month':
      return dayjs(new Date(value.year, value.month - 1, 1));
    case 'week':
      return dayjs(dateFromISOWeek(value.year, value.week));
    case 'day':
      return toPickerDate(value.date);
  }
}

export function fromPeriodPickerDate(
  unit: VBIWhereDatePeriod['unit'],
  value: Dayjs,
): VBIWhereDatePeriod {
  switch (unit) {
    case 'year':
      return { unit, year: value.year() };
    case 'quarter':
      return {
        unit,
        year: value.year(),
        quarter: quarterFromMonth(value.month()),
      };
    case 'month':
      return { unit, year: value.year(), month: value.month() + 1 };
    case 'week': {
      const { year, week } = getISOWeekParts(value.toDate());
      return { unit, year, week };
    }
    case 'day':
      return { unit, date: formatPickerDate(value) };
  }
}

function quarterFromMonth(month: number): 1 | 2 | 3 | 4 {
  return (Math.floor(month / 3) + 1) as 1 | 2 | 3 | 4;
}

function dateFromISOWeek(year: number, week: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;
  const week1 = new Date(jan4);
  week1.setUTCDate(jan4.getUTCDate() - jan4Day + 1);
  const target = new Date(week1);
  target.setUTCDate(week1.getUTCDate() + (week - 1) * 7);
  return target;
}

function getISOWeekParts(date: Date): { year: number; week: number } {
  const value = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const day = value.getUTCDay() || 7;
  value.setUTCDate(value.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(value.getUTCFullYear(), 0, 1));
  const diff = value.getTime() - yearStart.getTime();
  return {
    year: value.getUTCFullYear(),
    week: Math.ceil((diff / 86400000 + 1) / 7),
  };
}
