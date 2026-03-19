import { theme } from 'antd';
import type { MenuProps } from 'antd';
import { useMemo } from 'react';
import { useVBIBuilder, useVBIDimensions, useVBISchemaFields } from 'src/hooks';
import { useTranslation } from 'src/i18n';
import { useVBIStore } from 'src/model';
import { getFieldRoleBySchemaType } from 'src/utils/fieldRole';
import {
  FieldShelf,
  SHELF_MENU_ITEM_STYLE,
  type FieldShelfTone,
} from '../common/FieldShelf';
import { openShelfRenameModal } from '../common/openShelfRenameModal';
import {
  formatDimensionDateAggregate,
  getDefaultDimensionDateAggregate,
  getDimensionDateAggregateItems,
  isDateDimensionField,
  normalizeDimensionDateAggregate,
  type DimensionDateAggregate,
} from '../utils/dimensionDateAggregateUtils';
import {
  reorderYArrayByInsertIndex,
  type YArrayLike,
} from '../utils/reorderUtils';

const DELETE_DIVIDER_STYLE: React.CSSProperties = {
  marginBlock: 0,
};

export const DimensionShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { token } = theme.useToken();
  const { theme: themeMode } = useVBIBuilder(builder);
  const { t } = useTranslation();
  const {
    dimensions,
    addDimension,
    removeDimension,
    updateDimension,
    findDimension,
  } = useVBIDimensions(builder);
  const { fieldTypeMap } = useVBISchemaFields(builder);
  const dimensionShelfTone = useMemo<FieldShelfTone>(() => {
    const accent = themeMode === 'dark' ? '#91caff' : '#0958d9';
    const border =
      themeMode === 'dark' ? 'rgba(145, 202, 255, 0.34)' : '#b7d9ff';
    const hoverBackground =
      themeMode === 'dark' ? 'rgba(32, 79, 183, 0.18)' : '#eef5ff';
    const iconBackground =
      themeMode === 'dark'
        ? 'rgba(145, 202, 255, 0.14)'
        : 'rgba(22, 119, 255, 0.12)';

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

  const isDateField = (fieldName: string) => {
    return isDateDimensionField(fieldTypeMap[fieldName]);
  };

  const addFieldAt = (params: { fieldName: string; insertIndex: number }) => {
    const { fieldName, insertIndex } = params;
    const originalLength = dimensions.length;

    addDimension(fieldName, (node) => {
      if (isDateField(fieldName)) {
        node.setAggregate(getDefaultDimensionDateAggregate());
      }
    });

    if (insertIndex < originalLength) {
      const yDimensions = builder.dsl.get('dimensions') as
        | YArrayLike
        | undefined;
      if (!yDimensions) {
        return;
      }

      builder.doc.transact(() => {
        reorderYArrayByInsertIndex({
          yArray: yDimensions,
          dragIndex: originalLength,
          insertIndex,
        });
      });
    }
  };

  const renameDimension = (id: string, alias: string) => {
    updateDimension(id, (node) => {
      node.setAlias(alias);
    });
  };

  const changeAggregate = (
    id: string,
    aggregate: DimensionDateAggregate | undefined,
  ) => {
    if (!aggregate) {
      const dimensionNode = findDimension(id) as
        | { clearAggregate?: () => unknown }
        | undefined;

      if (typeof dimensionNode?.clearAggregate === 'function') {
        builder.doc.transact(() => {
          dimensionNode.clearAggregate?.();
        });
        return;
      }

      const targetIndex = dimensions.findIndex(
        (dimension) => dimension.id === id,
      );
      const yDimensions = builder.dsl.get('dimensions') as
        | YArrayLike<{ delete: (key: string) => void }>
        | undefined;
      const yDimension = yDimensions?.get(targetIndex);
      if (!yDimension) {
        return;
      }

      builder.doc.transact(() => {
        yDimension.delete('aggregate');
      });
      return;
    }

    updateDimension(id, (node) => {
      node.setAggregate(aggregate);
    });
  };

  const buildMenuItems = (
    dimension: (typeof dimensions)[number],
  ): MenuProps['items'] => {
    const currentAggregate = normalizeDimensionDateAggregate(
      dimension.aggregate,
      fieldTypeMap[dimension.field],
    );
    const items: NonNullable<MenuProps['items']> = [];

    if (isDateField(dimension.field)) {
      items.push({
        key: 'aggregate',
        label: t('shelvesMenuDateAggregate'),
        children: [
          ...getDimensionDateAggregateItems(t).map((item) => ({
            key: `aggregate:${item.key}`,
            label: `${currentAggregate?.func === item.key ? '✓ ' : ''}${
              item.shortLabel
            }`,
            style: SHELF_MENU_ITEM_STYLE,
          })),
          {
            key: 'aggregate:none',
            label: `${!currentAggregate ? '✓ ' : ''}${t(
              'shelvesMenuRawValue',
            )}`,
            style: SHELF_MENU_ITEM_STYLE,
          },
        ],
      });
    }

    items.push(
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
    );

    return items;
  };

  const handleMenuClick = (
    dimension: (typeof dimensions)[number],
    key: string,
  ) => {
    if (key.startsWith('aggregate:')) {
      const aggregateKey = key.replace('aggregate:', '');

      if (aggregateKey === 'none') {
        changeAggregate(dimension.id, undefined);
        return;
      }

      const nextAggregate = getDimensionDateAggregateItems(t).find(
        (item) => item.key === aggregateKey,
      )?.aggregate;

      if (nextAggregate) {
        changeAggregate(dimension.id, nextAggregate);
      }
      return;
    }

    if (key === 'rename') {
      openShelfRenameModal({
        title: t('shelvesRenameModalDimensionTitle'),
        placeholder: t('shelvesRenameModalDimensionPlaceholder'),
        okText: t('shelvesRenameModalSave'),
        cancelText: t('shelvesRenameModalCancel'),
        emptyNameMessage: t('shelvesRenameModalEmptyName'),
        id: dimension.id,
        currentAlias: dimension.alias || dimension.field,
        onRename: renameDimension,
      });
      return;
    }

    if (key === 'delete') {
      removeDimension(dimension.id);
    }
  };

  const getDimensionDisplayLabel = (dimension: (typeof dimensions)[number]) => {
    const baseLabel = dimension.alias || dimension.field;
    const aggregate = formatDimensionDateAggregate(
      normalizeDimensionDateAggregate(
        dimension.aggregate,
        fieldTypeMap[dimension.field],
      ),
      t,
    );

    if (!aggregate) {
      return baseLabel;
    }

    return `${aggregate}(${baseLabel})`;
  };

  return (
    <FieldShelf
      shelf="dimensions"
      items={dimensions}
      placeholder={t('shelvesPlaceholdersDimensions')}
      tone={dimensionShelfTone}
      style={style}
      maxLabelWidth={124}
      getDisplayLabel={getDimensionDisplayLabel}
      getItemPayload={(item) => ({
        field: item.field,
        type: fieldTypeMap[item.field],
        role: getFieldRoleBySchemaType(fieldTypeMap[item.field]),
      })}
      buildMenuItems={buildMenuItems}
      onMenuClick={handleMenuClick}
      onRemove={removeDimension}
      onAddFieldAt={(payload, insertIndex) => {
        if (!payload.field) {
          return;
        }

        addFieldAt({
          fieldName: payload.field,
          insertIndex,
        });
      }}
      onReorder={(dragIndex, insertIndex) => {
        const yDimensions = builder.dsl.get('dimensions') as
          | YArrayLike
          | undefined;
        if (!yDimensions) {
          return;
        }

        builder.doc.transact(() => {
          reorderYArrayByInsertIndex({
            yArray: yDimensions,
            dragIndex,
            insertIndex,
          });
        });
      }}
    />
  );
};
