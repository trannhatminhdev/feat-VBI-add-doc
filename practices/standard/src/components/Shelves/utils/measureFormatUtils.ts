import type { VBIMeasureFormat } from '@visactor/vbi';
import type { Translate } from 'src/i18n';

const FORMAT_TYPE_LABEL_KEYS: Record<string, string> = {
  number: 'formatTypeNumber',
  percent: 'formatTypePercent',
  permille: 'formatTypePermille',
  scientific: 'formatTypeScientific',
};

export const formatMeasureFormatLabel = (
  format: VBIMeasureFormat | undefined,
  t: Translate,
): string => {
  if (!format) {
    return t('formatNoFormat');
  }

  if ('autoFormat' in format && format.autoFormat === true) {
    return t('formatAuto');
  }

  const parts: string[] = [];
  const typePart = format.type
    ? t(FORMAT_TYPE_LABEL_KEYS[format.type] ?? 'formatTypeNumber')
    : t('formatTypeNumber');
  parts.push(typePart);

  if (format.prefix) {
    parts.unshift(format.prefix);
  }

  if (format.symbol) {
    parts.push(format.symbol);
  }

  if (format.fractionDigits !== undefined) {
    parts.push(`(${format.fractionDigits}${t('formatFractionDigits')})`);
  }

  return parts.join('');
};

export type FormatPreset = {
  key: string;
  label: string;
  format: VBIMeasureFormat;
};

export const getFormatPresets = (t: Translate): FormatPreset[] => {
  return [
    {
      key: 'auto',
      label: t('formatAuto'),
      format: { autoFormat: true },
    },
    {
      key: 'number-2',
      label: `${t('formatTypeNumber')} (2)`,
      format: { type: 'number', fractionDigits: 2 },
    },
    {
      key: 'percent-1',
      label: `${t('formatTypePercent')} (1)`,
      format: { type: 'percent', fractionDigits: 1 },
    },
    {
      key: 'cny-wan',
      label: `\u00A5${t('formatSymbol')}(\u4E07)`,
      format: {
        type: 'number',
        prefix: '\u00A5',
        ratio: 10000,
        symbol: '\u4E07',
        fractionDigits: 2,
      },
    },
    {
      key: 'usd-k',
      label: '$K (2)',
      format: {
        type: 'number',
        prefix: '$',
        ratio: 1000,
        symbol: 'K',
        fractionDigits: 2,
      },
    },
    {
      key: 'scientific-3',
      label: `${t('formatTypeScientific')} (3)`,
      format: { type: 'scientific', fractionDigits: 3 },
    },
  ];
};
