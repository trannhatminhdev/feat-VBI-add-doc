import { useState, useEffect, useCallback } from 'react';
import { VBIBuilder, VBIWhereClause, VBIFilter } from '@visactor/vbi';

/**
 * VBI Where Filters Hook
 * 提供明细过滤（聚合前）管理
 * 支持响应式同步和增量操作
 */
export const useVBIWhereFilters = (builder: VBIBuilder | undefined) => {
  const [filters, setFilters] = useState<VBIWhereClause[]>([]);

  useEffect(() => {
    if (!builder) {
      return;
    }

    // 初始化
    setFilters(builder.whereFilter.toJson() as VBIWhereClause[]);

    // 监听变化 - 响应式同步
    const updateHandler = () => {
      setFilters(builder.whereFilter.toJson() as VBIWhereClause[]);
    };

    const unobserve = builder.whereFilter.observe(updateHandler);
    return unobserve;
  }, [builder]);

  // 增量添加过滤条件（带初始值）
  const addFilter = useCallback(
    (field: string, operator?: string, value?: any) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.whereFilter.add(field, (node) => {
            if (operator) node.setOperator(operator);
            if (value !== undefined) node.setValue(value);
          });
        });
      }
    },
    [builder],
  );

  // 增量添加过滤分组
  const addGroup = useCallback(
    (op: 'and' | 'or', callback?: (group: any) => void) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.whereFilter.addGroup(op, callback ?? (() => {}));
        });
      }
    },
    [builder],
  );

  // 删除过滤条件
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

  // 清空所有过滤条件
  const clearFilters = useCallback(() => {
    if (builder) {
      builder.doc.transact(() => {
        builder.whereFilter.clear();
      });
    }
  }, [builder]);

  // 增量更新过滤条件
  const updateFilter = useCallback(
    (id: string, updates: { operator?: string; value?: any }) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.whereFilter.update(id, (node: any) => {
            if (updates.operator) node.setOperator(updates.operator);
            if (updates.value !== undefined) node.setValue(updates.value);
          });
        });
      }
    },
    [builder],
  );

  // 查找过滤条件
  const findFilter = useCallback(
    (id: string) => {
      if (builder) {
        return builder.whereFilter.find(id);
      }
      return undefined;
    },
    [builder],
  );

  // 获取扁平化的过滤器列表（用于 UI 显示）
  const flattenFilters = useCallback((): VBIFilter[] => {
    const result: VBIFilter[] = [];
    const traverse = (items: VBIWhereClause[]) => {
      items.forEach((item) => {
        if ('field' in item) {
          result.push(item as VBIFilter);
        } else if ('conditions' in item && Array.isArray(item.conditions)) {
          traverse(item.conditions);
        }
      });
    };
    traverse(filters);
    return result;
  }, [filters]);

  // 增量更新分组
  const updateGroup = useCallback(
    (id: string, updates: { operator?: 'and' | 'or' }) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.whereFilter.updateGroup(id, (group: any) => {
            if (updates.operator) group.setOperator(updates.operator);
          });
        });
      }
    },
    [builder],
  );

  // 添加条件到分组
  const addToGroup = useCallback(
    (groupId: string, field: string, operator?: string, value?: any) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.whereFilter.updateGroup(groupId, (group: any) => {
            group.add(field, (node: any) => {
              if (operator) node.setOperator(operator);
              if (value !== undefined) node.setValue(value);
            });
          });
        });
      }
    },
    [builder],
  );

  // 从分组中删除条件
  const removeFromGroup = useCallback(
    (groupId: string, idOrIndex: string | number) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.whereFilter.updateGroup(groupId, (group: any) => {
            group.remove(idOrIndex);
          });
        });
      }
    },
    [builder],
  );

  // 查找分组
  const findGroup = useCallback(
    (id: string) => {
      if (builder) {
        const result = builder.whereFilter.find(id);
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
