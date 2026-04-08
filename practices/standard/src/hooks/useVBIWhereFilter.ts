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
  getId?: () => string;
}) => void;

type WhereGroupLike = {
  setOperator: (operator: 'and' | 'or') => unknown;
  add: (field: string, callback: (node: unknown) => void) => unknown;
  remove: (idOrIndex: string | number) => unknown;
};
type WhereGroupMutator = (group: WhereGroupLike) => void;
type WhereNodeLike = Parameters<WhereNodeMutator>[0];
type UseVBIWhereFilterResult = {
  filters: VBIWhereClause[];
  flattenFilters: () => VBIWhereFilter[];
  addFilter: (field: string, operator?: string, value?: unknown) => void;
  addGroup: (op: 'and' | 'or', callback?: WhereGroupMutator) => void;
  removeFilter: (id: string) => void;
  clearFilters: () => void;
  updateFilter: (
    id: string,
    updates: { operator?: string; value?: unknown },
  ) => void;
  findFilter: (id: string) => WhereNodeLike | undefined;
  updateGroup: (id: string, updates: { operator?: 'and' | 'or' }) => void;
  addToGroup: (
    groupId: string,
    field: string,
    operator?: string,
    value?: unknown,
  ) => void;
  removeFromGroup: (groupId: string, idOrIndex: string | number) => void;
  findGroup: (id: string) => WhereGroupLike | undefined;
};

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
export const useVBIWhereFilter = (
  builder: VBIChartBuilder | undefined,
): UseVBIWhereFilterResult => {
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
          callback?.(group as WhereGroupLike);
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
        const result = builder.whereFilter.find(
          (entry) => entry.getId() === id,
        );
        if (result && 'setValue' in result && 'setField' in result) {
          return result as WhereNodeLike;
        }
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
            const filterNode = node as WhereNodeLike;
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
        if (result && 'add' in result && 'remove' in result) {
          return result as WhereGroupLike;
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
