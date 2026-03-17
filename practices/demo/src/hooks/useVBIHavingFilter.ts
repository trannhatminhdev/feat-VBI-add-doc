import { useCallback } from 'react';
import { VBIBuilder, VBIHavingClause } from '@visactor/vbi';
import { useBuilderDocState } from './useBuilderDocState';

const EMPTY_HAVING_CLAUSES: VBIHavingClause[] = [];

/**
 * VBI Having Filter Hook
 * 提供结果过滤（聚合后）管理
 * 支持响应式同步和增量操作
 */
export const useVBIHavingFilter = (builder: VBIBuilder | undefined) => {
  const filters = useBuilderDocState({
    builder,
    fallback: EMPTY_HAVING_CLAUSES,
    getSnapshot: (activeBuilder) =>
      activeBuilder.havingFilter.toJSON().conditions as VBIHavingClause[],
  });

  const addFilter = useCallback(
    (
      field: string,
      aggregateFunc?: string,
      operator?: string,
      value?: unknown,
    ) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.havingFilter.add(field, (node) => {
          if (aggregateFunc && operator) {
            node.setOperator(`${aggregateFunc}(${operator})`);
          }
          if (value !== undefined) {
            node.setValue(value);
          }
        });
      });
    },
    [builder],
  );

  const addGroup = useCallback(
    (op: 'and' | 'or', callback?: (group: unknown) => void) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.havingFilter.addGroup(op, (group) => {
          callback?.(group);
        });
      });
    },
    [builder],
  );

  const removeFilter = useCallback(
    (id: string) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.havingFilter.remove(id);
        });
      }
    },
    [builder],
  );

  const clearFilters = useCallback(() => {
    if (builder) {
      builder.doc.transact(() => {
        builder.havingFilter.clear();
      });
    }
  }, [builder]);

  const updateFilter = useCallback(
    (id: string, updates: { operator?: string; value?: unknown }) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.havingFilter.update(id, (node) => {
          if (updates.operator) {
            node.setOperator(updates.operator);
          }
          if (updates.value !== undefined) {
            node.setValue(updates.value);
          }
        });
      });
    },
    [builder],
  );

  const findFilter = useCallback(
    (id: string) => {
      if (builder) {
        return builder.havingFilter.find((entry) => entry.getId() === id);
      }
      return undefined;
    },
    [builder],
  );

  return {
    filters,
    addFilter,
    addGroup,
    removeFilter,
    clearFilters,
    updateFilter,
    findFilter,
  };
};
