import { useCallback } from 'react';
import {
  VBIChartBuilder,
  VBIHavingAggregate,
  VBIHavingClause,
} from '@visactor/vbi';
import { useBuilderDocState } from './useBuilderDocState';

const EMPTY_HAVING_CLAUSES: VBIHavingClause[] = [];
type HavingFilterNodeLike = {
  setAggregate: (aggregate: VBIHavingAggregate) => unknown;
  setOperator: (operator: string) => unknown;
  setValue: (value: unknown) => unknown;
  getId?: () => string;
};
type HavingGroupLike = {
  setOperator: (operator: 'and' | 'or') => unknown;
  add: (
    field: string,
    callback: (node: HavingFilterNodeLike) => void,
  ) => unknown;
  remove: (idOrIndex: string | number) => unknown;
};
type UseVBIHavingFilterResult = {
  filters: VBIHavingClause[];
  addFilter: (
    field: string,
    aggregate?: VBIHavingAggregate,
    operator?: string,
    value?: unknown,
  ) => void;
  addGroup: (
    op: 'and' | 'or',
    callback?: (group: HavingGroupLike) => void,
  ) => void;
  removeFilter: (id: string) => void;
  clearFilters: () => void;
  updateFilter: (
    id: string,
    updates: {
      aggregate?: VBIHavingAggregate;
      operator?: string;
      value?: unknown;
    },
  ) => void;
  findFilter: (id: string) => HavingFilterNodeLike | undefined;
};

/**
 * VBI Having Filter Hook
 * 提供结果过滤（聚合后）管理
 * 支持响应式同步和增量操作
 */
export const useVBIHavingFilter = (
  builder: VBIChartBuilder | undefined,
): UseVBIHavingFilterResult => {
  const filters = useBuilderDocState({
    builder,
    fallback: EMPTY_HAVING_CLAUSES,
    getSnapshot: (activeBuilder) =>
      activeBuilder.havingFilter.toJSON().conditions as VBIHavingClause[],
  });

  const addFilter = useCallback(
    (
      field: string,
      aggregate?: VBIHavingAggregate,
      operator?: string,
      value?: unknown,
    ) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.havingFilter.add(field, (node) => {
          if (aggregate) {
            node.setAggregate(aggregate);
          }
          if (operator) {
            node.setOperator(operator);
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
    (op: 'and' | 'or', callback?: (group: HavingGroupLike) => void) => {
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
    (
      id: string,
      updates: {
        aggregate?: VBIHavingAggregate;
        operator?: string;
        value?: unknown;
      },
    ) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.havingFilter.update(id, (node) => {
          if (updates.aggregate) {
            node.setAggregate(updates.aggregate);
          }
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
        const result = builder.havingFilter.find(
          (entry) => entry.getId() === id,
        );
        if (result && 'setAggregate' in result && 'setValue' in result) {
          return result as HavingFilterNodeLike;
        }
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
