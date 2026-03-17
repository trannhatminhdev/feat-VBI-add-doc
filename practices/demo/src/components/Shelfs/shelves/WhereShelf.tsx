import { useCallback, useMemo } from 'react';
import { FilterPanel, type FilterItem } from 'src/components/Filter';
import {
  getWhereDisplayText,
  normalizeWhereOperator,
} from 'src/components/Filter/whereFilterUtils';
import { useVBISchemaFields, useVBIWhereFilter } from 'src/hooks';
import { useVBIStore } from 'src/model';
import { FilterShelf, type FilterShelfTone } from '../common/FilterShelf';
import { useFilterRootOperator } from '../hooks/useFilterRootOperator';

type WhereShelfItem = FilterItem & {
  id: string;
};

const WHERE_SHELF_TONE: FilterShelfTone = {
  dragOverBackground: 'rgba(250, 140, 22, 0.11)',
  dragOverBorder: 'rgba(250, 140, 22, 0.45)',
  itemBackground: '#fff8ee',
  itemHoverBackground: '#ffe7cc',
  itemBorder: '#ffd591',
  itemHoverBorder: '#ffbb96',
  textColor: '#fa8c16',
  iconBackground: 'rgba(250, 140, 22, 0.16)',
  iconHoverBackground: 'rgba(250, 140, 22, 0.28)',
  iconColor: '#d46b08',
};

const WHERE_ROOT_OPERATOR_COLORS = {
  border: '#ffd8a8',
  color: '#d46b08',
};

export const WhereShelf = ({
  style,
  showRootOperator = true,
}: {
  style?: React.CSSProperties;
  showRootOperator?: boolean;
}) => {
  const builder = useVBIStore((state) => state.builder);
  const { flattenFilters } = useVBIWhereFilter(builder);
  const { schemaFields } = useVBISchemaFields(builder);
  const { operator, setOperator } = useFilterRootOperator({
    builder,
    type: 'where',
  });

  const allFields = useMemo(() => {
    return schemaFields.map((field) => ({
      name: field.name,
      role: field.role,
    }));
  }, [schemaFields]);

  const whereFilterItems = useMemo((): WhereShelfItem[] => {
    return flattenFilters()
      .filter((item): item is typeof item & { id: string } => Boolean(item.id))
      .map((item) => ({
        id: item.id,
        field: item.field,
        operator: normalizeWhereOperator(item.op),
        value: item.value,
      }));
  }, [flattenFilters]);

  const handleWhereFilterAdd = useCallback(
    (item: FilterItem) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.whereFilter.add(item.field, (node) => {
          node.setOperator(item.operator);
          if (item.value !== undefined) {
            node.setValue(item.value);
          }
        });
      });
    },
    [builder],
  );

  const handleWhereFilterRemove = useCallback(
    (id: string) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.whereFilter.remove(id);
      });
    },
    [builder],
  );

  const handleWhereFilterUpdate = useCallback(
    (updatedItem: FilterItem) => {
      if (!builder || !updatedItem.id) {
        return;
      }

      builder.doc.transact(() => {
        builder.whereFilter.update(updatedItem.id as string, (node) => {
          node.setField(updatedItem.field);
          node.setOperator(updatedItem.operator);
          node.setValue(updatedItem.value);
        });
      });
    },
    [builder],
  );

  return (
    <FilterShelf
      items={whereFilterItems}
      style={style}
      placeholder="拖拽字段到此处"
      tone={WHERE_SHELF_TONE}
      maxLabelWidth={132}
      showRootOperator={showRootOperator}
      rootOperator={operator}
      rootOperatorColors={WHERE_ROOT_OPERATOR_COLORS}
      onRootOperatorChange={setOperator}
      getDisplayText={getWhereDisplayText}
      onDropField={(payload) => {
        if (!payload.field) {
          return;
        }

        handleWhereFilterAdd({
          id: '',
          field: payload.field,
          operator: '=',
          value: undefined,
        });
      }}
      onRemove={(id) => {
        if (id.startsWith('temp_')) {
          return;
        }
        handleWhereFilterRemove(id);
      }}
      renderEditor={({ item, isOpen, close }) => {
        const handleUpdate = (filters: FilterItem[]) => {
          const firstFilter = filters[0];
          if (firstFilter) {
            handleWhereFilterUpdate(firstFilter);
          }
          close();
        };

        return (
          <FilterPanel
            fields={allFields}
            filters={[item]}
            onChange={handleUpdate}
            onCancel={close}
            itemEdit
            open={isOpen}
            fixedField={item.field}
          />
        );
      }}
    />
  );
};
