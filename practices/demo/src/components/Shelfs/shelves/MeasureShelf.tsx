import type { MenuProps } from 'antd';
import { message } from 'antd';
import { useVBIMeasures, useVBISchemaFields } from 'src/hooks';
import { useVBIStore } from 'src/model';
import {
  FieldShelf,
  SHELF_MENU_ITEM_STYLE,
  type FieldShelfTone,
} from '../common/FieldShelf';
import { openShelfRenameModal } from '../common/openShelfRenameModal';
import {
  formatMeasureAggregate,
  getAggregateItemsByFieldRole,
  getDefaultAggregateByFieldRole,
  getMeasureFieldRoleBySchemaType,
  isAggregateSupportedByFieldRole,
  type MeasureAggregate,
} from '../utils/measureAggregateUtils';
import {
  reorderYArrayByInsertIndex,
  type YArrayLike,
} from '../utils/reorderUtils';
import { getNextFieldDuplicateName } from '../utils/shelfNameUtils';

const QUANTILE_PERCENT_OPTIONS = [1, 5, 25, 50, 75, 90, 95, 99] as const;

const MEASURE_SHELF_TONE: FieldShelfTone = {
  dragOverBackground: 'rgba(82, 196, 26, 0.1)',
  dragOverBorder: 'rgba(82, 196, 26, 0.4)',
  itemBackground: '#f3fff0',
  itemHoverBackground: '#e9f9df',
  itemBorder: '#c8efbb',
  itemHoverBorder: '#95de64',
  textColor: '#389e0d',
  iconBackground: 'rgba(82, 196, 26, 0.18)',
  iconHoverBackground: 'rgba(82, 196, 26, 0.28)',
  iconColor: '#389e0d',
};

export const MeasureShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { measures, addMeasure, removeMeasure, updateMeasure } =
    useVBIMeasures(builder);
  const { fieldTypeMap } = useVBISchemaFields(builder);

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
    const nextName = getNextFieldDuplicateName({
      field: fieldName,
      items: measures,
    });
    const fieldRole = getFieldRole(fieldName, fieldType);
    const aggregate = getDefaultAggregateByFieldRole(fieldRole);

    addMeasure(fieldName, (node) => {
      node.setAggregate(aggregate);
      if (nextName !== fieldName) {
        node.setAlias(nextName);
      }
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

  const buildMeasureMenuItems = (
    measure: (typeof measures)[number],
  ): MenuProps['items'] => {
    const fieldRole = getFieldRole(measure.field);
    const availableAggregates = getAggregateItemsByFieldRole(fieldRole);
    const currentQuantilePercent =
      measure.aggregate?.func === 'quantile'
        ? Math.round((measure.aggregate.quantile ?? 0.5) * 100)
        : undefined;
    const currentAggregateKey = measure.aggregate?.func ?? 'sum';

    const aggregateMenuItems: NonNullable<MenuProps['items']> =
      availableAggregates.map((item) => {
        if (item.key !== 'quantile') {
          const shortLabel = item.label.split(' ')[0] ?? item.label;
          return {
            key: `aggregate:${item.key}`,
            label: `${currentAggregateKey === item.key ? '✓ ' : ''}${shortLabel}`,
            style: SHELF_MENU_ITEM_STYLE,
          };
        }

        return {
          key: 'aggregate:quantile',
          label: `${currentAggregateKey === 'quantile' ? '✓ ' : ''}分位数`,
          style: SHELF_MENU_ITEM_STYLE,
          children: QUANTILE_PERCENT_OPTIONS.map((percent) => ({
            key: `aggregate:quantile:${percent}`,
            label: `${currentQuantilePercent === percent ? '✓ ' : ''}P${percent}`,
            style: SHELF_MENU_ITEM_STYLE,
          })),
        };
      });

    return [
      {
        key: 'aggregate',
        label: '聚合',
        style: SHELF_MENU_ITEM_STYLE,
        children: aggregateMenuItems,
      },
      {
        key: 'rename',
        label: '重命名',
        style: SHELF_MENU_ITEM_STYLE,
      },
      {
        key: 'delete',
        label: <span style={{ color: '#ff4d4f' }}>删除</span>,
        style: SHELF_MENU_ITEM_STYLE,
      },
    ];
  };

  const handleMeasureMenuClick = (
    measure: (typeof measures)[number],
    key: string,
  ) => {
    if (key === 'rename') {
      openShelfRenameModal({
        title: '重命名指标',
        placeholder: '请输入指标名称',
        id: measure.id,
        currentAlias: measure.alias || measure.field,
        items: measures,
        onRename: renameMeasure,
      });
      return;
    }

    if (key === 'delete') {
      removeMeasure(measure.id);
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

    const selectedAggregate = getAggregateItemsByFieldRole(fieldRole).find(
      (item) => item.key === aggregateKey,
    )?.aggregate;

    if (!selectedAggregate) {
      return;
    }

    if (!isAggregateSupportedByFieldRole(selectedAggregate, fieldRole)) {
      message.warning('该字段不支持此聚合方式');
      return;
    }

    changeAggregate(measure.id, selectedAggregate);
  };

  const getMeasureDisplayLabel = (measure: (typeof measures)[number]) => {
    const baseLabel = measure.alias || measure.field;
    const aggregate = formatMeasureAggregate(
      measure.aggregate as MeasureAggregate | undefined,
    );

    if (!aggregate) {
      return baseLabel;
    }

    return `${aggregate}(${baseLabel})`;
  };

  return (
    <FieldShelf
      shelf="measures"
      items={measures}
      placeholder="拖拽度量/维度到此处"
      tone={MEASURE_SHELF_TONE}
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
        const yMeasures = builder.dsl.get('measures') as YArrayLike | undefined;
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
  );
};
