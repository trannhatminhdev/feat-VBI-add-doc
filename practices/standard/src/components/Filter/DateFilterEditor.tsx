import React, { useCallback } from 'react';
import { DatePicker, InputNumber, Select, Space } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import type { VBIWhereDatePredicate } from '@visactor/vbi';
import { useTranslation } from 'src/i18n';
import {
  formatPickerDate,
  fromPeriodPickerDate,
  toPeriodPickerValue,
  toRangePickerValue,
} from './datePickerValueUtils';
import { getDefaultDatePredicate } from './dateFilterUtils';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface DateFilterEditorProps {
  value?: VBIWhereDatePredicate;
  onChange: (predicate: VBIWhereDatePredicate) => void;
}

const DATE_TYPES = ['range', 'relative', 'current', 'period'] as const;
const DATE_UNITS = ['year', 'quarter', 'month', 'week', 'day'] as const;
const RELATIVE_MODES = ['last', 'next'] as const;
const PERIOD_PICKERS: Record<PeriodValue['unit'], DatePickerProps['picker']> = {
  year: 'year',
  quarter: 'quarter',
  month: 'month',
  week: 'week',
  day: undefined,
};

export const DateFilterEditor: React.FC<DateFilterEditorProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const predicate = value ?? getDefaultDatePredicate();

  const handleTypeChange = useCallback(
    (type: string) => {
      switch (type) {
        case 'range':
          onChange({ type: 'range', start: '', end: '' });
          break;
        case 'relative':
          onChange({ type: 'relative', mode: 'last', amount: 7, unit: 'day' });
          break;
        case 'current':
          onChange({ type: 'current', unit: 'day' });
          break;
        case 'period':
          onChange({
            type: 'period',
            unit: 'year',
            year: new Date().getFullYear(),
          });
          break;
      }
    },
    [onChange],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Select
        value={predicate.type}
        onChange={handleTypeChange}
        variant="filled"
        size="small"
        style={{ width: '100%' }}
      >
        {DATE_TYPES.map((type) => (
          <Option key={type} value={type}>
            {t(`dateFilterType${type.charAt(0).toUpperCase()}${type.slice(1)}`)}
          </Option>
        ))}
      </Select>

      {predicate.type === 'range' && (
        <RangeFields value={predicate} onChange={onChange} />
      )}
      {predicate.type === 'relative' && (
        <RelativeFields value={predicate} onChange={onChange} />
      )}
      {predicate.type === 'current' && (
        <CurrentFields value={predicate} onChange={onChange} />
      )}
      {predicate.type === 'period' && (
        <PeriodFields value={predicate} onChange={onChange} />
      )}
    </div>
  );
};

/* ---------- Range ---------- */

type RangeValue = Extract<VBIWhereDatePredicate, { type: 'range' }>;
type RangePickerValue = GetProps<typeof DatePicker.RangePicker>['value'];

const RangeFields: React.FC<{
  value: RangeValue;
  onChange: (v: VBIWhereDatePredicate) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const handleChange = useCallback(
    (dates: RangePickerValue) => {
      onChange({
        ...value,
        start: formatPickerDate(dates?.[0] ?? null),
        end: formatPickerDate(dates?.[1] ?? null),
      });
    },
    [onChange, value],
  );

  return (
    <RangePicker
      size="small"
      variant="filled"
      value={toRangePickerValue(value)}
      onChange={handleChange}
      format="YYYY-MM-DD"
      inputReadOnly
      style={{ width: '100%' }}
      placeholder={[
        t('dateFilterStartPlaceholder'),
        t('dateFilterEndPlaceholder'),
      ]}
    />
  );
};

/* ---------- Relative ---------- */

type RelativeValue = Extract<VBIWhereDatePredicate, { type: 'relative' }>;

const RelativeFields: React.FC<{
  value: RelativeValue;
  onChange: (v: VBIWhereDatePredicate) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Space size={6} style={{ width: '100%' }}>
      <Select
        size="small"
        variant="filled"
        value={value.mode}
        onChange={(mode) => onChange({ ...value, mode })}
        style={{ width: 80 }}
      >
        {RELATIVE_MODES.map((m) => (
          <Option key={m} value={m}>
            {t(m === 'last' ? 'dateFilterModeLast' : 'dateFilterModeNext')}
          </Option>
        ))}
      </Select>
      <InputNumber
        size="small"
        variant="filled"
        min={1}
        value={value.amount}
        onChange={(v) => v != null && onChange({ ...value, amount: v })}
        style={{ width: 64 }}
        controls={false}
      />
      <UnitSelect
        value={value.unit}
        onChange={(unit) => onChange({ ...value, unit })}
      />
    </Space>
  );
};

/* ---------- Current ---------- */

type CurrentValue = Extract<VBIWhereDatePredicate, { type: 'current' }>;

const CurrentFields: React.FC<{
  value: CurrentValue;
  onChange: (v: VBIWhereDatePredicate) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Space size={6} style={{ width: '100%' }}>
      <UnitSelect
        value={value.unit}
        onChange={(unit) => onChange({ ...value, unit })}
      />
      <InputNumber
        size="small"
        variant="filled"
        value={value.offset ?? 0}
        onChange={(v) => onChange({ ...value, offset: v ?? 0 })}
        style={{ width: 64 }}
        controls={false}
        placeholder={t('dateFilterOffsetPlaceholder')}
      />
    </Space>
  );
};

/* ---------- Period ---------- */

type PeriodValue = Extract<VBIWhereDatePredicate, { type: 'period' }>;

const PeriodFields: React.FC<{
  value: PeriodValue;
  onChange: (v: VBIWhereDatePredicate) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const handleUnitChange = (unit: string) => {
    switch (unit) {
      case 'year':
        onChange({ type: 'period', unit: 'year', year: currentYear });
        break;
      case 'quarter':
        onChange({
          type: 'period',
          unit: 'quarter',
          year: currentYear,
          quarter: 1,
        });
        break;
      case 'month':
        onChange({
          type: 'period',
          unit: 'month',
          year: currentYear,
          month: 1,
        });
        break;
      case 'week':
        onChange({ type: 'period', unit: 'week', year: currentYear, week: 1 });
        break;
      case 'day':
        onChange({ type: 'period', unit: 'day', date: '' });
        break;
    }
  };

  return (
    <Space size={6} style={{ width: '100%' }} wrap>
      <UnitSelect value={value.unit} onChange={handleUnitChange} />
      <DatePicker
        size="small"
        variant="filled"
        picker={PERIOD_PICKERS[value.unit]}
        value={toPeriodPickerValue(value)}
        onChange={(date) => {
          if (!date) {
            return;
          }
          onChange({
            type: 'period',
            ...fromPeriodPickerDate(value.unit, date),
          });
        }}
        format={getPeriodPickerFormat(value.unit)}
        inputReadOnly
        allowClear={false}
        placeholder={getPeriodPlaceholder(value.unit, t)}
        style={{ width: 136 }}
      />
    </Space>
  );
};

function getPeriodPickerFormat(
  unit: PeriodValue['unit'],
): DatePickerProps['format'] {
  switch (unit) {
    case 'year':
      return 'YYYY';
    case 'quarter':
      return (value) => {
        const period = fromPeriodPickerDate('quarter', value);
        if (period.unit !== 'quarter') {
          return '';
        }
        return `${period.year}-Q${period.quarter}`;
      };
    case 'month':
      return 'YYYY-MM';
    case 'week':
      return (value) => {
        const period = fromPeriodPickerDate('week', value);
        if (period.unit !== 'week') {
          return '';
        }
        return `${period.year}-W${String(period.week).padStart(2, '0')}`;
      };
    case 'day':
      return 'YYYY-MM-DD';
  }
}

function getPeriodPlaceholder(
  unit: PeriodValue['unit'],
  t: (key: string) => string,
): string {
  switch (unit) {
    case 'year':
      return t('dateFilterYearPlaceholder');
    case 'quarter':
      return t('dateFilterUnitQuarter');
    case 'month':
      return t('dateFilterMonthPlaceholder');
    case 'week':
      return t('dateFilterWeekPlaceholder');
    case 'day':
      return t('filtersDateDate');
  }
}

/* ---------- Shared unit selector ---------- */

type DateUnit = (typeof DATE_UNITS)[number];

const UnitSelect: React.FC<{
  value: DateUnit;
  onChange: (unit: DateUnit) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Select
      size="small"
      variant="filled"
      value={value}
      onChange={onChange}
      style={{ width: 80 }}
    >
      {DATE_UNITS.map((u) => (
        <Option key={u} value={u}>
          {t(`dateFilterUnit${u.charAt(0).toUpperCase()}${u.slice(1)}`)}
        </Option>
      ))}
    </Select>
  );
};
