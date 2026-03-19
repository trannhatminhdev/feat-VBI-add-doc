import { theme } from 'antd';
import type { MenuProps } from 'antd';
import { message } from 'antd';
import { useMemo, useState } from 'react';
import { useVBIBuilder, useVBIMeasures, useVBISchemaFields } from 'src/hooks';
import { useTranslation } from 'src/i18n';
import { useVBIStore } from 'src/model';
import type { VBIMeasure, VBIMeasureFormat } from '@visactor/vbi';
import {
  FieldShelf,
  SHELF_MENU_ITEM_STYLE,
  type FieldShelfTone,
} from '../common/FieldShelf';
import { MeasureFormatPopover } from '../common/MeasureFormatPopover';
import { openShelfRenameModal } from '../common/openShelfRenameModal';
import {
  formatMeasureAggregate,
  getAggregateItemsByFieldRole,
  getDefaultAggregateByFieldRole,
  getMeasureFieldRoleBySchemaType,
  isAggregateSupportedByFieldRole,
  type MeasureAggregate,
} from '../utils/measureAggregateUtils';
import { formatMeasureFormatLabel } from '../utils/measureFormatUtils';
import {
  reorderYArrayByInsertIndex,
  type YArrayLike,
} from '../utils/reorderUtils';

const QUANTILE_PERCENT_OPTIONS = [1, 5, 25, 50, 75, 90, 95, 99] as const;
const DELETE_DIVIDER_STYLE: React.CSSProperties = {
  marginBlock: 0,
};

const MEASURE_ENCODING_LABEL_KEY_MAP: Record<
  NonNullable<VBIMeasure['encoding']>,
  string
> = {
  primaryYAxis: 'shelvesMeasureEncodingPrimaryYAxis',
  secondaryYAxis: 'shelvesMeasureEncodingSecondaryYAxis',
  xAxis: 'shelvesMeasureEncodingXAxis',
  yAxis: 'shelvesMeasureEncodingYAxis',
  angle: 'shelvesMeasureEncodingAngle',
  radius: 'shelvesMeasureEncodingRadius',
  size: 'shelvesMeasureEncodingSize',
  color: 'shelvesMeasureEncodingColor',
  detail: 'shelvesMeasureEncodingDetail',
  column: 'shelvesMeasureEncodingColumn',
  label: 'shelvesMeasureEncodingLabel',
  tooltip: 'shelvesMeasureEncodingTooltip',
  value: 'shelvesMeasureEncodingValue',
  q1: 'shelvesMeasureEncodingQ1',
  q3: 'shelvesMeasureEncodingQ3',
  min: 'shelvesMeasureEncodingMin',
  max: 'shelvesMeasureEncodingMax',
  median: 'shelvesMeasureEncodingMedian',
  outliers: 'shelvesMeasureEncodingOutliers',
  x0: 'shelvesMeasureEncodingX0',
  x1: 'shelvesMeasureEncodingX1',
};

export const MeasureShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { token } = theme.useToken();
  const { theme: themeMode } = useVBIBuilder(builder);
  const { t } = useTranslation();
  const { measures, addMeasure, removeMeasure, updateMeasure } =
    useVBIMeasures(builder);
  const { fieldTypeMap } = useVBISchemaFields(builder);
  const measureShelfTone = useMemo<FieldShelfTone>(() => {
    const accent = themeMode === 'dark' ? '#95de64' : '#389e0d';
    const border =
      themeMode === 'dark' ? 'rgba(149, 222, 100, 0.34)' : '#c8efbb';
    const hoverBackground =
      themeMode === 'dark' ? 'rgba(84, 196, 26, 0.16)' : '#eef9e6';
    const iconBackground =
      themeMode === 'dark'
        ? 'rgba(149, 222, 100, 0.14)'
        : 'rgba(82, 196, 26, 0.12)';

    return {
      trackBackground: token.colorBgContainer,
      trackBorder: border,
      placeholderColor: token.colorTextQuaternary,
      dragOverBackground: hoverBackground,
      dragOverBorder: accent,
      itemBackground: token.colorBgContainer,
      itemHoverBackground: hoverBackground,
      itemBorder: border,
      itemHoverBorder: accent,
      textColor: accent,
      iconBackground,
      iconHoverBackground: hoverBackground,
      iconColor: accent,
    };
  }, [themeMode, token]);

  const getFieldRole = (fieldName: string, fieldType?: string) => {
    return getMeasureFieldRoleBySchemaType(
      fieldType ?? fieldTypeMap[fieldName],
    );
  };

  const addFieldAt = (params: {
    fieldName: string;
    fieldType?: string;
    insertIndex: number;
  }) => {
    const { fieldName, fieldType, insertIndex } = params;
    const originalLength = measures.length;
    const fieldRole = getFieldRole(fieldName, fieldType);
    const aggregate = getDefaultAggregateByFieldRole(fieldRole);

    addMeasure(fieldName, (node) => {
      node.setAggregate(aggregate);
    });

    if (insertIndex < originalLength) {
      const yMeasures = builder.dsl.get('measures') as YArrayLike | undefined;
      if (!yMeasures) {
        return;
      }

      builder.doc.transact(() => {
        reorderYArrayByInsertIndex({
          yArray: yMeasures,
          dragIndex: originalLength,
          insertIndex,
        });
      });
    }
  };

  const renameMeasure = (id: string, alias: string) => {
    updateMeasure(id, (node) => {
      node.setAlias(alias);
    });
  };

  const changeAggregate = (id: string, aggregate: MeasureAggregate) => {
    updateMeasure(id, (node) => {
      node.setAggregate(aggregate);
    });
  };

  const [formatEditingId, setFormatEditingId] = useState<string | null>(null);

  const changeEncoding = (
    id: string,
    encoding: NonNullable<VBIMeasure['encoding']>,
  ) => {
    updateMeasure(id, (node) => {
      node.setEncoding(encoding);
    });
  };

  const changeFormat = (id: string, format: VBIMeasureFormat | undefined) => {
    updateMeasure(id, (node) => {
      if (format === undefined) {
        node.clearFormat();
      } else {
        node.setFormat(format);
      }
    });
  };

  const buildMeasureMenuItems = (
    measure: (typeof measures)[number],
  ): MenuProps['items'] => {
    const fieldRole = getFieldRole(measure.field);
    const availableAggregates = getAggregateItemsByFieldRole(fieldRole, t);
    const currentQuantilePercent =
      measure.aggregate?.func === 'quantile'
        ? Math.round((measure.aggregate.quantile ?? 0.5) * 100)
        : undefined;
    const currentAggregateKey = measure.aggregate?.func ?? 'sum';
    const supportedEncodings = builder.chartType.getSupportedMeasureEncodings();
    const currentEncoding = measure.encoding;
    const measureIndex = measures.findIndex((item) => item.id === measure.id);
    const recommendedEncoding =
      measureIndex >= 0
        ? builder.chartType.getRecommendedMeasureEncodings(measures.length)[
            measureIndex
          ]
        : undefined;

    const aggregateMenuItems: NonNullable<MenuProps['items']> =
      availableAggregates.map((item) => {
        if (item.key !== 'quantile') {
          return {
            key: `aggregate:${item.key}`,
            label: `${currentAggregateKey === item.key ? '✓ ' : ''}${
              item.shortLabel
            }`,
            style: SHELF_MENU_ITEM_STYLE,
          };
        }

        return {
          key: 'aggregate:quantile',
          label: `${currentAggregateKey === 'quantile' ? '✓ ' : ''}${t(
            'shelvesMenuQuantile',
          )}`,
          children: QUANTILE_PERCENT_OPTIONS.map((percent) => ({
            key: `aggregate:quantile:${percent}`,
            label: `${currentQuantilePercent === percent ? '✓ ' : ''}P${percent}`,
            style: SHELF_MENU_ITEM_STYLE,
          })),
        };
      });

    return [
      {
        key: 'encoding',
        label: t('shelvesMenuEncoding'),
        children: supportedEncodings.map((encoding) => {
          const selectedPrefix = currentEncoding === encoding ? '✓ ' : '';
          const recommendedSuffix =
            recommendedEncoding === encoding
              ? ` ${t('commonStatusRecommended')}`
              : '';

          return {
            key: `encoding:${encoding}`,
            label: `${selectedPrefix}${t(
              MEASURE_ENCODING_LABEL_KEY_MAP[encoding],
            )}${recommendedSuffix}`,
            style: SHELF_MENU_ITEM_STYLE,
          };
        }),
      },
      {
        key: 'aggregate',
        label: t('shelvesMenuAggregate'),
        children: aggregateMenuItems,
      },
      {
        key: 'format',
        label: `${t('shelvesMenuFormat')}${
          measure.format
            ? ` (${formatMeasureFormatLabel(
                measure.format as VBIMeasureFormat,
                t,
              )})`
            : ''
        }`,
        style: SHELF_MENU_ITEM_STYLE,
      },
      {
        key: 'rename',
        label: t('shelvesMenuRename'),
        style: SHELF_MENU_ITEM_STYLE,
      },
      {
        type: 'divider',
        style: DELETE_DIVIDER_STYLE,
      },
      {
        key: 'delete',
        label: (
          <span style={{ color: '#ff4d4f' }}>{t('shelvesMenuDelete')}</span>
        ),
        style: SHELF_MENU_ITEM_STYLE,
      },
    ];
  };

  const handleMeasureMenuClick = (
    measure: (typeof measures)[number],
    key: string,
  ) => {
    if (key === 'format') {
      setFormatEditingId(measure.id);
      return;
    }

    if (key === 'rename') {
      openShelfRenameModal({
        title: t('shelvesRenameModalMeasureTitle'),
        placeholder: t('shelvesRenameModalMeasurePlaceholder'),
        okText: t('shelvesRenameModalSave'),
        cancelText: t('shelvesRenameModalCancel'),
        emptyNameMessage: t('shelvesRenameModalEmptyName'),
        id: measure.id,
        currentAlias: measure.alias || measure.field,
        onRename: renameMeasure,
      });
      return;
    }

    if (key === 'delete') {
      removeMeasure(measure.id);
      return;
    }

    if (key.startsWith('encoding:')) {
      const nextEncoding = key.replace('encoding:', '') as NonNullable<
        VBIMeasure['encoding']
      >;
      changeEncoding(measure.id, nextEncoding);
      return;
    }

    if (!key.startsWith('aggregate:')) {
      return;
    }

    const aggregateKey = key.replace('aggregate:', '');
    const fieldRole = getFieldRole(measure.field);

    if (aggregateKey === 'quantile') {
      changeAggregate(measure.id, { func: 'quantile', quantile: 0.5 });
      return;
    }

    if (aggregateKey.startsWith('quantile:')) {
      const percentValue = Number(aggregateKey.replace('quantile:', ''));
      if (!Number.isFinite(percentValue)) {
        return;
      }

      const quantileValue = Math.max(0, Math.min(100, percentValue)) / 100;
      changeAggregate(measure.id, {
        func: 'quantile',
        quantile: quantileValue,
      });
      return;
    }

    const selectedAggregate = getAggregateItemsByFieldRole(fieldRole, t).find(
      (item) => item.key === aggregateKey,
    )?.aggregate;

    if (!selectedAggregate) {
      return;
    }

    if (!isAggregateSupportedByFieldRole(selectedAggregate, fieldRole)) {
      message.warning(t('shelvesMeasureUnsupportedAggregate'));
      return;
    }

    changeAggregate(measure.id, selectedAggregate);
  };

  const getMeasureDisplayLabel = (measure: (typeof measures)[number]) => {
    const baseLabel = measure.alias || measure.field;
    const aggregate = formatMeasureAggregate(
      measure.aggregate as MeasureAggregate | undefined,
      t,
    );

    if (!aggregate) {
      return baseLabel;
    }

    return `${aggregate}(${baseLabel})`;
  };

  const formatEditingMeasure = useMemo(() => {
    if (!formatEditingId) {
      return undefined;
    }
    return measures.find((m) => m.id === formatEditingId);
  }, [formatEditingId, measures]);

  return (
    <MeasureFormatPopover
      open={!!formatEditingMeasure}
      onOpenChange={(open) => {
        if (!open) {
          setFormatEditingId(null);
        }
      }}
      format={formatEditingMeasure?.format as VBIMeasureFormat | undefined}
      onFormatChange={(format) => {
        if (formatEditingMeasure) {
          changeFormat(formatEditingMeasure.id, format);
        }
      }}
    >
      <div>
        <FieldShelf
          shelf="measures"
          items={measures}
          placeholder={t('shelvesPlaceholdersMeasures')}
          tone={measureShelfTone}
          style={style}
          maxLabelWidth={112}
          getDisplayLabel={getMeasureDisplayLabel}
          getItemPayload={(item) => ({
            field: item.field,
            type: fieldTypeMap[item.field],
            role: getFieldRole(item.field),
          })}
          buildMenuItems={buildMeasureMenuItems}
          onMenuClick={handleMeasureMenuClick}
          onRemove={removeMeasure}
          onAddFieldAt={(payload, insertIndex) => {
            if (!payload.field) {
              return;
            }

            addFieldAt({
              fieldName: payload.field,
              fieldType: payload.type,
              insertIndex,
            });
          }}
          onReorder={(dragIndex, insertIndex) => {
            const yMeasures = builder.dsl.get('measures') as
              | YArrayLike
              | undefined;
            if (!yMeasures) {
              return;
            }

            builder.doc.transact(() => {
              reorderYArrayByInsertIndex({
                yArray: yMeasures,
                dragIndex,
                insertIndex,
              });
            });
          }}
        />
      </div>
    </MeasureFormatPopover>
  );
};
