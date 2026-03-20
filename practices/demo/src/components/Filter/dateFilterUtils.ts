import type { VBIWhereDatePredicate } from '@visactor/vbi';
import type { Translate } from 'src/i18n';
import { formatDateInput } from './datePickerValueUtils';

export function isDateFilter(filter: { op: string }): boolean {
  return filter.op === 'date';
}

export function getDefaultDatePredicate(): VBIWhereDatePredicate {
  return { type: 'relative', mode: 'last', amount: 7, unit: 'day' };
}

const UNIT_KEYS: Record<string, string> = {
  year: 'dateFilterUnitYear',
  quarter: 'dateFilterUnitQuarter',
  month: 'dateFilterUnitMonth',
  week: 'dateFilterUnitWeek',
  day: 'dateFilterUnitDay',
};

function unitLabel(unit: string, t: Translate): string {
  return t(UNIT_KEYS[unit] ?? unit);
}

function formatRangeText(
  p: Extract<VBIWhereDatePredicate, { type: 'range' }>,
  t: Translate,
): string {
  const start = formatDateInput(p.start);
  const end = formatDateInput(p.end);
  return t('dateFilterDisplayRange', { start, end });
}

function formatRelativeText(
  p: Extract<VBIWhereDatePredicate, { type: 'relative' }>,
  t: Translate,
): string {
  const mode = t(
    p.mode === 'last' ? 'dateFilterModeLast' : 'dateFilterModeNext',
  );
  const unit = unitLabel(p.unit, t);
  return t('dateFilterDisplayRelative', { mode, amount: p.amount, unit });
}

function formatCurrentText(
  p: Extract<VBIWhereDatePredicate, { type: 'current' }>,
  t: Translate,
): string {
  const unit = unitLabel(p.unit, t);
  if (p.offset && p.offset !== 0) {
    return t('dateFilterDisplayCurrentOffset', { unit, offset: p.offset });
  }
  return t('dateFilterDisplayCurrent', { unit });
}

function formatPeriodText(
  p: Extract<VBIWhereDatePredicate, { type: 'period' }>,
  t: Translate,
): string {
  switch (p.unit) {
    case 'year':
      return t('dateFilterDisplayPeriodYear', { year: p.year });
    case 'quarter':
      return t('dateFilterDisplayPeriodQuarter', {
        year: p.year,
        quarter: p.quarter,
      });
    case 'month':
      return t('dateFilterDisplayPeriodMonth', {
        year: p.year,
        month: p.month,
      });
    case 'week':
      return t('dateFilterDisplayPeriodWeek', { year: p.year, week: p.week });
    case 'day': {
      const date = formatDateInput(p.date);
      return t('dateFilterDisplayPeriodDay', { date });
    }
    default:
      return '';
  }
}

export function getDateFilterDisplayText(
  predicate: VBIWhereDatePredicate,
  t: Translate,
): string {
  switch (predicate.type) {
    case 'range':
      return formatRangeText(predicate, t);
    case 'relative':
      return formatRelativeText(predicate, t);
    case 'current':
      return formatCurrentText(predicate, t);
    case 'period':
      return formatPeriodText(predicate, t);
    default:
      return '';
  }
}
