import {
  isVBIHavingFilter,
  isVBIHavingGroup,
  type VBIHavingClause,
} from '@visactor/vbi';
import { useCallback, useMemo } from 'react';
import { HavingFilterPanel, type HavingItem } from 'src/components/Filter';
import {
  getDefaultHavingAggregateByFieldRole,
  getDefaultHavingOperator,
  getHavingDisplayText,
  isHavingNumericAggregate,
  normalizeHavingAggregate,
  normalizeHavingOperator,
  toHavingDslOperator,
} from 'src/components/Filter/havingFilterUtils';
import { useVBIHavingFilter, useVBISchemaFields } from 'src/hooks';
import { useVBIStore } from 'src/model';
import type { FieldRole } from 'src/utils/fieldRole';
import { FilterShelf, type FilterShelfTone } from '../common/FilterShelf';
import { useFilterRootOperator } from '../hooks/useFilterRootOperator';

type HavingShelfItem = HavingItem & {
  id: string;
};

const HAVING_SHELF_TONE: FilterShelfTone = {
  dragOverBackground: 'rgba(22, 119, 255, 0.1)',
  dragOverBorder: 'rgba(22, 119, 255, 0.45)',
  itemBackground: '#edf5ff',
  itemHoverBackground: '#dbeeff',
  itemBorder: '#91caff',
  itemHoverBorder: '#69b1ff',
  textColor: '#1677ff',
  iconBackground: 'rgba(22, 119, 255, 0.16)',
  iconHoverBackground: 'rgba(22, 119, 255, 0.28)',
  iconColor: '#0958d9',
};

const HAVING_ROOT_OPERATOR_COLORS = {
  border: '#bdd7ff',
  color: '#0958d9',
};

const flattenHavingFilters = (
  clauses: VBIHavingClause[],
  fieldRoleMap: Record<string, FieldRole>,
): HavingShelfItem[] => {
  const result: HavingShelfItem[] = [];

  const traverse = (items: VBIHavingClause[]) => {
    items.forEach((item) => {
      if (isVBIHavingGroup(item)) {
        traverse(item.conditions);
        return;
      }

      if (!isVBIHavingFilter(item) || !item.id) {
        return;
      }

      const fieldRole = fieldRoleMap[item.field] ?? 'measure';
      result.push({
        id: item.id,
        field: item.field,
        aggregate: normalizeHavingAggregate(item.aggregate, fieldRole),
        operator: normalizeHavingOperator(item.op),
        value: item.value,
      });
    });
  };

  traverse(clauses);
  return result;
};

export const HavingShelf = ({
  style,
  showRootOperator = true,
}: {
  style?: React.CSSProperties;
  showRootOperator?: boolean;
}) => {
  const builder = useVBIStore((state) => state.builder);
  const { filters: havingFilterClauses } = useVBIHavingFilter(builder);
  const { schemaFields, fieldRoleMap } = useVBISchemaFields(builder);
  const { operator, setOperator } = useFilterRootOperator({
    builder,
    type: 'having',
  });

  const allFields = useMemo(() => {
    return schemaFields.map((field) => ({
      name: field.name,
      role: field.role,
    }));
  }, [schemaFields]);

  const havingFilterItems = useMemo(() => {
    return flattenHavingFilters(havingFilterClauses, fieldRoleMap);
  }, [havingFilterClauses, fieldRoleMap]);

  const handleHavingFilterAdd = useCallback(
    (item: HavingItem) => {
      if (!builder) {
        return;
      }

      const fieldRole = fieldRoleMap[item.field] ?? 'measure';
      const aggregate = normalizeHavingAggregate(item.aggregate, fieldRole);

      builder.doc.transact(() => {
        builder.havingFilter.add(item.field, (node) => {
          node.setAggregate(aggregate);
          node.setOperator(toHavingDslOperator(item.operator));
          if (item.value !== undefined) {
            node.setValue(item.value);
          }
        });
      });
    },
    [builder, fieldRoleMap],
  );

  const handleHavingFilterRemove = useCallback(
    (id: string) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.havingFilter.remove(id);
      });
    },
    [builder],
  );

  const handleHavingFilterUpdate = useCallback(
    (updatedItem: HavingItem) => {
      if (!builder || !updatedItem.id) {
        return;
      }

      const existingFilter = builder.havingFilter.find(
        (entry) => entry.getId() === updatedItem.id,
      );
      const existingField =
        existingFilter && 'getField' in existingFilter
          ? existingFilter.getField()
          : undefined;
      const fieldRole = fieldRoleMap[updatedItem.field] ?? 'measure';
      const aggregate = normalizeHavingAggregate(
        updatedItem.aggregate,
        fieldRole,
      );

      builder.doc.transact(() => {
        if (existingField !== updatedItem.field) {
          builder.havingFilter.remove(updatedItem.id as string);
          builder.havingFilter.add(updatedItem.field, (node) => {
            node.setAggregate(aggregate);
            node.setOperator(toHavingDslOperator(updatedItem.operator));
            if (updatedItem.value !== undefined) {
              node.setValue(updatedItem.value);
            }
          });
          return;
        }

        builder.havingFilter.update(updatedItem.id as string, (node) => {
          node.setAggregate(aggregate);
          node.setOperator(toHavingDslOperator(updatedItem.operator));
          node.setValue(updatedItem.value);
        });
      });
    },
    [builder, fieldRoleMap],
  );

  return (
    <FilterShelf
      items={havingFilterItems}
      style={style}
      placeholder="拖拽字段到此处（支持维度/度量）"
      tone={HAVING_SHELF_TONE}
      maxLabelWidth={124}
      showRootOperator={showRootOperator}
      rootOperator={operator}
      rootOperatorColors={HAVING_ROOT_OPERATOR_COLORS}
      onRootOperatorChange={setOperator}
      getDisplayText={getHavingDisplayText}
      onDropField={(payload) => {
        if (!payload.field) {
          return;
        }

        const defaultAggregate = getDefaultHavingAggregateByFieldRole(
          payload.role,
        );
        const defaultOperator = getDefaultHavingOperator(
          isHavingNumericAggregate(payload.role, defaultAggregate),
        );

        handleHavingFilterAdd({
          id: '',
          field: payload.field,
          aggregate: defaultAggregate,
          operator: defaultOperator,
          value: undefined,
        });
      }}
      onRemove={(id) => {
        if (id.startsWith('temp_')) {
          return;
        }
        handleHavingFilterRemove(id);
      }}
      renderEditor={({ item, isOpen, close }) => {
        const handleUpdate = (filters: HavingItem[]) => {
          const firstFilter = filters[0];
          if (firstFilter) {
            handleHavingFilterUpdate(firstFilter);
          }
          close();
        };

        return (
          <HavingFilterPanel
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
