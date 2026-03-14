import { useState, useEffect, useCallback } from 'react';
import { VBIBuilder, VBIHavingClause } from '@visactor/vbi';

/**
 * VBI Having Filter Hook
 * 提供结果过滤（聚合后）管理
 * 支持响应式同步和增量操作
 */
export const useVBIHavingFilter = (builder: VBIBuilder | undefined) => {
  const [filters, setFilters] = useState<VBIHavingClause[]>([]);

  useEffect(() => {
    if (!builder) {
      return;
    }

    // 初始化
    setFilters(builder.havingFilter.toJson() as VBIHavingClause[]);

    // 监听变化 - 响应式同步
    const updateHandler = () => {
      setFilters(builder.havingFilter.toJson() as VBIHavingClause[]);
    };

    const unobserve = builder.havingFilter.observe(updateHandler);
    return unobserve;
  }, [builder]);

  // 增量添加过滤条件（带初始值）
  const addFilter = useCallback(
    (field: string, aggregateFunc?: string, operator?: string, value?: any) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.havingFilter.add(field, (node) => {
            // having 的 operator 格式为 "sum(>)"
            if (aggregateFunc && operator) {
              node.setOperator(`${aggregateFunc}(${operator})`);
            }
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
          builder.havingFilter.addGroup(op, callback ?? (() => {}));
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
          builder.havingFilter.remove(id);
        });
      }
    },
    [builder],
  );

  // 清空所有过滤条件
  const clearFilters = useCallback(() => {
    if (builder) {
      builder.doc.transact(() => {
        builder.havingFilter.clear();
      });
    }
  }, [builder]);

  // 增量更新过滤条件
  const updateFilter = useCallback(
    (id: string, updates: { operator?: string; value?: any }) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.havingFilter.update(id, (node: any) => {
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
        return builder.havingFilter.find(id);
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
