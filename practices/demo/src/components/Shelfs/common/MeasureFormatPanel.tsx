import {
  Button,
  Flex,
  Input,
  InputNumber,
  Select,
  Segmented,
  Switch,
  Typography,
  theme,
} from 'antd';
import { useCallback, useMemo } from 'react';
import type { VBIMeasureFormat } from '@visactor/vbi';
import { useTranslation } from 'src/i18n';

type MeasureFormatPanelProps = {
  format?: VBIMeasureFormat;
  onFormatChange: (format: VBIMeasureFormat | undefined) => void;
};

const FORMAT_TYPES = ['number', 'percent', 'permille', 'scientific'] as const;

const FORMAT_TYPE_LABEL_KEYS: Record<string, string> = {
  number: 'formatTypeNumber',
  percent: 'formatTypePercent',
  permille: 'formatTypePermille',
  scientific: 'formatTypeScientific',
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  marginBottom: 0,
  whiteSpace: 'nowrap',
  minWidth: 70,
};

const PANEL_STYLE: React.CSSProperties = {
  width: 280,
  padding: '14px 16px 12px',
};

const FormatForm = (props: {
  format?: VBIMeasureFormat;
  onFormatChange: (format: VBIMeasureFormat | undefined) => void;
}) => {
  const { format, onFormatChange } = props;
  const { t } = useTranslation();

  const isAutoFormat =
    format !== undefined &&
    'autoFormat' in format &&
    format.autoFormat === true;

  const customFormat = useMemo(() => {
    if (!format || isAutoFormat) {
      return {};
    }
    return format;
  }, [format, isAutoFormat]);

  const handleAutoToggle = useCallback(
    (checked: boolean) => {
      if (checked) {
        onFormatChange({ autoFormat: true });
      } else {
        onFormatChange({ type: 'number', fractionDigits: 2 });
      }
    },
    [onFormatChange],
  );

  const updateField = useCallback(
    (key: string, value: unknown) => {
      const base = isAutoFormat ? {} : { ...customFormat };
      onFormatChange({
        ...base,
        autoFormat: false,
        [key]: value,
      } as VBIMeasureFormat);
    },
    [customFormat, isAutoFormat, onFormatChange],
  );

  return (
    <Flex vertical gap={10} style={PANEL_STYLE}>
      <Segmented
        block
        size="small"
        value={isAutoFormat ? 'auto' : 'custom'}
        options={[
          { label: t('formatAuto'), value: 'auto' },
          { label: t('formatCustom'), value: 'custom' },
        ]}
        onChange={(value) => handleAutoToggle(value === 'auto')}
      />

      {!isAutoFormat && (
        <>
          <Flex align="center" justify="space-between">
            <Typography.Text style={LABEL_STYLE}>
              {t('formatTypeLabel')}
            </Typography.Text>
            <Select
              size="small"
              variant="filled"
              value={customFormat.type ?? 'number'}
              onChange={(v) => updateField('type', v)}
              style={{ width: 140 }}
              options={FORMAT_TYPES.map((type) => ({
                value: type,
                label: t(FORMAT_TYPE_LABEL_KEYS[type]),
              }))}
            />
          </Flex>

          <Flex align="center" justify="space-between">
            <Typography.Text style={LABEL_STYLE}>
              {t('formatPrefix')}
            </Typography.Text>
            <Input
              size="small"
              variant="filled"
              value={customFormat.prefix ?? ''}
              onChange={(e) =>
                updateField('prefix', e.target.value || undefined)
              }
              style={{ width: 140 }}
              placeholder="$, \u00A5..."
            />
          </Flex>

          <Flex align="center" justify="space-between">
            <Typography.Text style={LABEL_STYLE}>
              {t('formatSuffix')}
            </Typography.Text>
            <Input
              size="small"
              variant="filled"
              value={customFormat.suffix ?? ''}
              onChange={(e) =>
                updateField('suffix', e.target.value || undefined)
              }
              style={{ width: 140 }}
            />
          </Flex>

          <Flex align="center" justify="space-between">
            <Typography.Text style={LABEL_STYLE}>
              {t('formatRatio')}
            </Typography.Text>
            <InputNumber
              size="small"
              variant="filled"
              value={customFormat.ratio ?? 1}
              onChange={(v) => updateField('ratio', v ?? undefined)}
              style={{ width: 140 }}
              min={0.0001}
            />
          </Flex>

          <Flex align="center" justify="space-between">
            <Typography.Text style={LABEL_STYLE}>
              {t('formatSymbol')}
            </Typography.Text>
            <Input
              size="small"
              variant="filled"
              value={customFormat.symbol ?? ''}
              onChange={(e) =>
                updateField('symbol', e.target.value || undefined)
              }
              style={{ width: 140 }}
              placeholder="\u4E07, K..."
            />
          </Flex>

          <Flex align="center" justify="space-between">
            <Typography.Text style={LABEL_STYLE}>
              {t('formatFractionDigits')}
            </Typography.Text>
            <InputNumber
              size="small"
              variant="filled"
              value={customFormat.fractionDigits ?? 2}
              onChange={(v) => updateField('fractionDigits', v ?? undefined)}
              style={{ width: 140 }}
              min={0}
              max={10}
            />
          </Flex>

          <Flex align="center" justify="space-between">
            <Typography.Text style={LABEL_STYLE}>
              {t('formatThousandSeparator')}
            </Typography.Text>
            <Switch
              size="small"
              checked={customFormat.thousandSeparator ?? false}
              onChange={(checked) => updateField('thousandSeparator', checked)}
            />
          </Flex>
        </>
      )}

      <Button
        size="small"
        type="text"
        danger
        onClick={() => onFormatChange(undefined)}
        style={{ alignSelf: 'flex-start' }}
      >
        {t('formatClear')}
      </Button>
    </Flex>
  );
};

export const MeasureFormatPanel = (props: MeasureFormatPanelProps) => {
  const { format, onFormatChange } = props;
  const { token } = theme.useToken();

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      style={{
        background: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
      }}
    >
      <FormatForm format={format} onFormatChange={onFormatChange} />
    </div>
  );
};
