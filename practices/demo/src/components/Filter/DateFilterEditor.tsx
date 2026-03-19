import React, { useCallback } from 'react';
import { Select, Input, InputNumber, Space } from 'antd';
import type { VBIWhereDatePredicate } from '@visactor/vbi';
import { useTranslation } from 'src/i18n';
import { getDefaultDatePredicate } from './dateFilterUtils';

const { Option } = Select;

interface DateFilterEditorProps {
  value?: VBIWhereDatePredicate;
  onChange: (predicate: VBIWhereDatePredicate) => void;
}

const DATE_TYPES = ['range', 'relative', 'current', 'period'] as const;
const DATE_UNITS = ['year', 'quarter', 'month', 'week', 'day'] as const;
const RELATIVE_MODES = ['last', 'next'] as const;
const QUARTERS = [1, 2, 3, 4] as const;

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

const RangeFields: React.FC<{
  value: RangeValue;
  onChange: (v: VBIWhereDatePredicate) => void;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const startStr =
    value.start instanceof Date
      ? value.start.toISOString().slice(0, 10)
      : String(value.start ?? '');
  const endStr =
    value.end instanceof Date
      ? value.end.toISOString().slice(0, 10)
      : String(value.end ?? '');

  return (
    <Space direction="vertical" size={6} style={{ width: '100%' }}>
      <Input
        size="small"
        variant="filled"
        placeholder={t('dateFilterStartPlaceholder')}
        value={startStr}
        onChange={(e) => onChange({ ...value, start: e.target.value })}
      />
      <Input
        size="small"
        variant="filled"
        placeholder={t('dateFilterEndPlaceholder')}
        value={endStr}
        onChange={(e) => onChange({ ...value, end: e.target.value })}
      />
    </Space>
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
      {renderPeriodDetail(value, onChange, t)}
    </Space>
  );
};

function renderPeriodDetail(
  value: PeriodValue,
  onChange: (v: VBIWhereDatePredicate) => void,
  t: (key: string) => string,
) {
  switch (value.unit) {
    case 'year':
      return (
        <InputNumber
          size="small"
          variant="filled"
          value={value.year}
          onChange={(v) => v != null && onChange({ ...value, year: v })}
          style={{ width: 80 }}
          controls={false}
          placeholder={t('dateFilterYearPlaceholder')}
        />
      );
    case 'quarter':
      return (
        <>
          <InputNumber
            size="small"
            variant="filled"
            value={value.year}
            onChange={(v) => v != null && onChange({ ...value, year: v })}
            style={{ width: 80 }}
            controls={false}
          />
          <Select
            size="small"
            variant="filled"
            value={value.quarter}
            onChange={(q) => onChange({ ...value, quarter: q })}
            style={{ width: 64 }}
          >
            {QUARTERS.map((q) => (
              <Option key={q} value={q}>
                Q{q}
              </Option>
            ))}
          </Select>
        </>
      );
    case 'month':
      return (
        <>
          <InputNumber
            size="small"
            variant="filled"
            value={value.year}
            onChange={(v) => v != null && onChange({ ...value, year: v })}
            style={{ width: 80 }}
            controls={false}
          />
          <InputNumber
            size="small"
            variant="filled"
            min={1}
            max={12}
            value={value.month}
            onChange={(v) => v != null && onChange({ ...value, month: v })}
            style={{ width: 64 }}
            controls={false}
            placeholder={t('dateFilterMonthPlaceholder')}
          />
        </>
      );
    case 'week':
      return (
        <>
          <InputNumber
            size="small"
            variant="filled"
            value={value.year}
            onChange={(v) => v != null && onChange({ ...value, year: v })}
            style={{ width: 80 }}
            controls={false}
          />
          <InputNumber
            size="small"
            variant="filled"
            min={1}
            max={53}
            value={value.week}
            onChange={(v) => v != null && onChange({ ...value, week: v })}
            style={{ width: 64 }}
            controls={false}
            placeholder={t('dateFilterWeekPlaceholder')}
          />
        </>
      );
    case 'day':
      return (
        <Input
          size="small"
          variant="filled"
          value={
            value.date instanceof Date
              ? value.date.toISOString().slice(0, 10)
              : String(value.date ?? '')
          }
          onChange={(e) =>
            onChange({ type: 'period', unit: 'day', date: e.target.value })
          }
          placeholder="YYYY-MM-DD"
          style={{ width: 120 }}
        />
      );
    default:
      return null;
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
