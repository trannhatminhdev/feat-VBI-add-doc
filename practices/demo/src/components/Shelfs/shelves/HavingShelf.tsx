import {
  isVBIHavingFilter,
  isVBIHavingGroup,
  type VBIHavingClause,
} from '@visactor/vbi';
import { theme } from 'antd';
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
import { useTranslation } from 'src/i18n';
import { useVBIStore } from 'src/model';
import type { FieldRole } from 'src/utils/fieldRole';
import { FilterShelf, type FilterShelfTone } from '../common/FilterShelf';
import { useFilterRootOperator } from '../hooks/useFilterRootOperator';
import {
  reorderYArrayByInsertIndex,
  type YArrayLike,
} from '../utils/reorderUtils';

type HavingShelfItem = HavingItem & {
  id: string;
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
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const { filters: havingFilterClauses } = useVBIHavingFilter(builder);
  const { schemaFields, fieldRoleMap, fieldTypeMap } =
    useVBISchemaFields(builder);
  const { operator, setOperator } = useFilterRootOperator({
    builder,
    type: 'having',
  });

  const allFields = useMemo(() => {
    return schemaFields.map((field) => ({
      name: field.name,
      role: field.role,
      type: field.type,
      isDate: field.isDate,
    }));
  }, [schemaFields]);

  const havingFilterItems = useMemo(() => {
    return flattenHavingFilters(havingFilterClauses, fieldRoleMap);
  }, [havingFilterClauses, fieldRoleMap]);

  const havingShelfTone = useMemo<FilterShelfTone>(() => {
    return {
      dragOverBackground: 'rgba(22, 119, 255, 0.1)',
      dragOverBorder: 'rgba(22, 119, 255, 0.45)',
      itemBackground: token.colorPrimaryBg,
      itemHoverBackground: token.colorPrimaryBg,
      itemBorder: token.colorPrimaryBorder,
      itemHoverBorder: token.colorPrimary,
      textColor: token.colorPrimary,
      iconBackground: 'rgba(22, 119, 255, 0.16)',
      iconHoverBackground: 'rgba(22, 119, 255, 0.28)',
      iconColor: token.colorPrimary,
    };
  }, [token]);

  const havingRootOperatorColors = useMemo(() => {
    return {
      border: token.colorPrimaryBorder,
      color: token.colorPrimary,
      background: token.colorBgContainer,
    };
  }, [token]);

  const reorderHavingFilters = useCallback(
    (dragIndex: number, insertIndex: number) => {
      const havingRoot = builder.dsl.get('havingFilter') as
        | { get: (key: string) => unknown }
        | undefined;
      const conditions = havingRoot?.get('conditions') as
        | YArrayLike
        | undefined;
      if (!conditions) {
        return;
      }

      builder.doc.transact(() => {
        reorderYArrayByInsertIndex({
          yArray: conditions,
          dragIndex,
          insertIndex,
        });
      });
    },
    [builder],
  );

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
      shelf="having"
      items={havingFilterItems}
      style={style}
      placeholder={t('shelvesPlaceholdersFilters')}
      tone={havingShelfTone}
      maxLabelWidth={124}
      showRootOperator={showRootOperator}
      rootOperator={operator}
      rootOperatorColors={havingRootOperatorColors}
      onRootOperatorChange={setOperator}
      getDisplayText={(item) => getHavingDisplayText(item, t)}
      getItemPayload={(item) => ({
        field: item.field,
        type: fieldTypeMap[item.field],
        role: fieldRoleMap[item.field] ?? 'measure',
      })}
      onAddFieldAt={(payload, insertIndex) => {
        if (!payload.field) {
          return;
        }

        const currentLength = havingFilterItems.length;
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

        if (insertIndex < currentLength) {
          reorderHavingFilters(currentLength, insertIndex);
        }
      }}
      onReorder={reorderHavingFilters}
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
