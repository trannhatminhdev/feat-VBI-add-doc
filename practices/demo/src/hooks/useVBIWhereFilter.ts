import { useCallback } from 'react';
import {
  VBIChartBuilder,
  VBIWhereClause,
  VBIWhereFilter,
  isVBIFilter,
  isVBIWhereGroup,
} from '@visactor/vbi';
import { useBuilderDocState } from './useBuilderDocState';

const EMPTY_WHERE_CLAUSES: VBIWhereClause[] = [];

type WhereNodeMutator = (node: {
  setOperator: (operator: string) => unknown;
  setValue: (value: unknown) => unknown;
  setField: (field: string) => unknown;
}) => void;

type WhereGroupMutator = (group: {
  setOperator: (operator: 'and' | 'or') => unknown;
  add: (field: string, callback: (node: unknown) => void) => unknown;
  remove: (idOrIndex: string | number) => unknown;
}) => void;

const flattenWhereClauses = (items: VBIWhereClause[]): VBIWhereFilter[] => {
  const result: VBIWhereFilter[] = [];

  const traverse = (clauses: VBIWhereClause[]) => {
    clauses.forEach((item) => {
      if (isVBIFilter(item)) {
        result.push(item);
        return;
      }

      if (isVBIWhereGroup(item)) {
        traverse(item.conditions);
      }
    });
  };

  traverse(items);
  return result;
};

/**
 * VBI Where Filter Hook
 * 提供明细过滤（聚合前）管理
 * 支持响应式同步和增量操作
 */
export const useVBIWhereFilter = (builder: VBIChartBuilder | undefined) => {
  const filters = useBuilderDocState({
    builder,
    fallback: EMPTY_WHERE_CLAUSES,
    getSnapshot: (activeBuilder) =>
      activeBuilder.whereFilter.toJSON().conditions as VBIWhereClause[],
  });

  const addFilter = useCallback(
    (field: string, operator?: string, value?: unknown) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.whereFilter.add(field, (node) => {
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
    (op: 'and' | 'or', callback?: WhereGroupMutator) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.whereFilter.addGroup(op, (group) => {
          callback?.(group as unknown as Parameters<WhereGroupMutator>[0]);
        });
      });
    },
    [builder],
  );

  const removeFilter = useCallback(
    (id: string) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.whereFilter.remove(id);
        });
      }
    },
    [builder],
  );

  const clearFilters = useCallback(() => {
    if (builder) {
      builder.doc.transact(() => {
        builder.whereFilter.clear();
      });
    }
  }, [builder]);

  const updateFilter = useCallback(
    (id: string, updates: { operator?: string; value?: unknown }) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.whereFilter.update(id, (node) => {
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
        return builder.whereFilter.find((entry) => entry.getId() === id);
      }
      return undefined;
    },
    [builder],
  );

  const flattenFilters = useCallback((): VBIWhereFilter[] => {
    return flattenWhereClauses(filters);
  }, [filters]);

  const updateGroup = useCallback(
    (id: string, updates: { operator?: 'and' | 'or' }) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.whereFilter.updateGroup(id, (group) => {
          if (updates.operator) {
            group.setOperator(updates.operator);
          }
        });
      });
    },
    [builder],
  );

  const addToGroup = useCallback(
    (groupId: string, field: string, operator?: string, value?: unknown) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.whereFilter.updateGroup(groupId, (group) => {
          group.add(field, (node) => {
            const filterNode = node as Parameters<WhereNodeMutator>[0];
            if (operator) {
              filterNode.setOperator(operator);
            }
            if (value !== undefined) {
              filterNode.setValue(value);
            }
          });
        });
      });
    },
    [builder],
  );

  const removeFromGroup = useCallback(
    (groupId: string, idOrIndex: string | number) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.whereFilter.updateGroup(groupId, (group) => {
          group.remove(idOrIndex);
        });
      });
    },
    [builder],
  );

  const findGroup = useCallback(
    (id: string) => {
      if (builder) {
        const result = builder.whereFilter.find(
          (entry) => entry.getId() === id,
        );
        if (result && 'getOperator' in result) {
          return result;
        }
      }
      return undefined;
    },
    [builder],
  );

  return {
    filters,
    flattenFilters,
    addFilter,
    addGroup,
    removeFilter,
    clearFilters,
    updateFilter,
    findFilter,
    updateGroup,
    addToGroup,
    removeFromGroup,
    findGroup,
  };
};
