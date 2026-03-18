import type { MenuProps } from 'antd';
import { useMemo } from 'react';
import { useVBIDimensions, useVBISchemaFields } from 'src/hooks';
import { useVBIStore } from 'src/model';
import { getFieldRoleBySchemaType } from 'src/utils/fieldRole';
import {
  FieldShelf,
  SHELF_MENU_ITEM_STYLE,
  type FieldShelfTone,
} from '../common/FieldShelf';
import { openShelfRenameModal } from '../common/openShelfRenameModal';
import {
  reorderYArrayByInsertIndex,
  type YArrayLike,
} from '../utils/reorderUtils';
import { getNextFieldDuplicateName } from '../utils/shelfNameUtils';

const DIMENSION_SHELF_TONE: FieldShelfTone = {
  dragOverBackground: 'rgba(22, 119, 255, 0.08)',
  dragOverBorder: 'rgba(22, 119, 255, 0.35)',
  itemBackground: '#edf5ff',
  itemHoverBackground: '#ddeeff',
  itemBorder: '#b7d9ff',
  itemHoverBorder: '#91caff',
  textColor: '#0958d9',
  iconBackground: 'rgba(22, 119, 255, 0.15)',
  iconHoverBackground: 'rgba(22, 119, 255, 0.26)',
  iconColor: '#1677ff',
};

export const DimensionShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { dimensions, addDimension, removeDimension, updateDimension } =
    useVBIDimensions(builder);
  const { schemaFields } = useVBISchemaFields(builder);

  const schemaTypeMap = useMemo(() => {
    return Object.fromEntries(
      schemaFields.map((item) => [item.name, item.type]),
    );
  }, [schemaFields]);

  const addFieldAt = (params: { fieldName: string; insertIndex: number }) => {
    const { fieldName, insertIndex } = params;
    const originalLength = dimensions.length;
    const nextName = getNextFieldDuplicateName({
      field: fieldName,
      items: dimensions,
    });

    addDimension(fieldName, (node) => {
      if (nextName !== fieldName) {
        node.setAlias(nextName);
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

  const buildMenuItems = (): MenuProps['items'] => {
    return [
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

  return (
    <FieldShelf
      shelf="dimensions"
      items={dimensions}
      placeholder="拖拽维度/指标到此处"
      tone={DIMENSION_SHELF_TONE}
      style={style}
      maxLabelWidth={92}
      getItemPayload={(item) => ({
        field: item.field,
        type: schemaTypeMap[item.field],
        role: getFieldRoleBySchemaType(schemaTypeMap[item.field]),
      })}
      buildMenuItems={buildMenuItems}
      onMenuClick={(dimension, key) => {
        if (key === 'rename') {
          openShelfRenameModal({
            title: '重命名维度',
            placeholder: '请输入维度名称',
            id: dimension.id,
            currentAlias: dimension.alias || dimension.field,
            items: dimensions,
            onRename: renameDimension,
          });
          return;
        }

        if (key === 'delete') {
          removeDimension(dimension.id);
        }
      }}
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
