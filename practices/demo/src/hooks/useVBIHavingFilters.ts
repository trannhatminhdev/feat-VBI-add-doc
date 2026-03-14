import { useState, useEffect, useCallback } from 'react';
import { VBIBuilder, VBIHavingClause } from '@visactor/vbi';

/**
 * VBI Having Filters Hook
 * 提供结果过滤（聚合后）管理
 * 支持响应式同步和增量操作
 */
export const useVBIHavingFilters = (builder: VBIBuilder | undefined) => {
  const [filters, setFilters] = useState<VBIHavingClause[]>([]);

  useEffect(() => {
    if (!builder) {
      return;
    }

    // 初始化
    setFilters(builder.havingFilters.toJson() as VBIHavingClause[]);

    // 监听变化 - 响应式同步
    const updateHandler = () => {
      setFilters(builder.havingFilters.toJson() as VBIHavingClause[]);
    };

    const unobserve = builder.havingFilters.observe(updateHandler);
    return unobserve;
  }, [builder]);

  // 增量添加过滤条件（带初始值）
  const addFilter = useCallback(
    (field: string, aggregateFunc?: string, operator?: string, value?: any) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.havingFilters.add(field, (node) => {
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
          builder.havingFilters.addGroup(op, callback ?? (() => {}));
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
          builder.havingFilters.remove(id);
        });
      }
    },
    [builder],
  );

  // 清空所有过滤条件
  const clearFilters = useCallback(() => {
    if (builder) {
      builder.doc.transact(() => {
        builder.havingFilters.clear();
      });
    }
  }, [builder]);

  // 增量更新过滤条件
  const updateFilter = useCallback(
    (id: string, updates: { operator?: string; value?: any }) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.havingFilters.update(id, (node: any) => {
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
        return builder.havingFilters.find(id);
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
