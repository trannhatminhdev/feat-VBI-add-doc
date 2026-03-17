import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Flex, Popover } from 'antd';
import { useVBIStore } from 'src/model';
import { useVBIWhereFilter, useVBIHavingFilter } from 'src/hooks';
import {
  FilterPanel,
  HavingFilterPanel,
  type FilterItem,
  type HavingItem,
} from 'src/components/Filter';
import {
  getWhereDisplayText,
  normalizeWhereOperator,
} from 'src/components/Filter/whereFilterUtils';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';

export const WhereShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { flattenFilters } = useVBIWhereFilter(builder);

  const [allFields, setAllFields] = useState<
    { name: string; role: 'dimension' | 'measure' }[]
  >([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const prevFiltersRef = useRef<string[]>([]);

  // 获取所有字段
  useEffect(() => {
    if (builder) {
      builder.getSchema().then((schema: { name: string; type: string }[]) => {
        setAllFields(
          schema.map((s) => ({
            name: s.name,
            role: s.type === 'number' ? 'measure' : 'dimension',
          })),
        );
      });
    }
  }, [builder]);

  // 将 VBIWhereClause 转换为 FilterItem 格式 (扁平化)
  const whereFilterItems = useMemo((): FilterItem[] => {
    return flattenFilters()
      .filter((item) => Boolean(item.id))
      .map((item) => ({
        id: item.id,
        field: item.field,
        operator: normalizeWhereOperator(item.op),
        value: item.value,
      }));
  }, [flattenFilters]);

  const currentEditingItem = useMemo(() => {
    if (!editingItemId) {
      return undefined;
    }
    return whereFilterItems.find((item) => item.id === editingItemId);
  }, [editingItemId, whereFilterItems]);

  // 检测新添加的item并自动打开编辑弹窗
  useEffect(() => {
    const currentIds = whereFilterItems.map((item) => item.id || '');
    const prevIds = prevFiltersRef.current;

    // 找出新增的item
    const newIds = currentIds.filter((id) => !prevIds.includes(id));
    if (newIds.length > 0) {
      // 自动打开最新添加的item的编辑弹窗
      const lastNewId = newIds[newIds.length - 1];
      if (lastNewId) {
        setEditingItemId(lastNewId);
      }
    }

    prevFiltersRef.current = currentIds;
  }, [whereFilterItems]);

  useEffect(() => {
    if (editingItemId && !currentEditingItem) {
      setEditingItemId(null);
    }
  }, [editingItemId, currentEditingItem]);

  // 增量添加 Where 过滤条件 (接收 FilterItem 格式)
  const handleWhereFilterAdd = useCallback(
    (item: FilterItem) => {
      if (builder) {
        builder.doc.transact(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          builder.whereFilter.add(item.field, (node: any) => {
            node.setOperator(item.operator);
            if (item.value !== undefined) {
              node.setValue(item.value);
            }
          });
        });
      }
    },
    [builder],
  );

  // 增量删除 Where 过滤条件
  const handleWhereFilterRemove = useCallback(
    (id: string) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.whereFilter.remove(id);
        });
      }
    },
    [builder],
  );

  // 更新 Where 过滤条件
  const handleWhereFilterUpdate = useCallback(
    (updatedItem: FilterItem) => {
      if (!builder || !updatedItem.id) {
        return;
      }

      const filterId = updatedItem.id as string;
      builder.doc.transact(() => {
        // 直接使用 update 方法更新现有过滤器
        builder.whereFilter.update(filterId, (node) => {
          node.setField(updatedItem.field);
          node.setOperator(updatedItem.operator);
          node.setValue(updatedItem.value);
        });
      });
    },
    [builder],
  );

  // 当前编辑项的面板始终从 builder 的最新值推导
  const renderWhereItemPopover = (
    item: FilterItem | undefined,
    isOpen: boolean,
  ) => {
    if (!item) {
      return null;
    }

    const handleUpdate = (filters: FilterItem[]) => {
      if (filters.length > 0) {
        handleWhereFilterUpdate(filters[0]);
      }
      // 更新完成后关闭 Popover
      setEditingItemId(null);
    };
    return (
      <FilterPanel
        fields={allFields}
        filters={[item]}
        onChange={handleUpdate}
        onCancel={() => setEditingItemId(null)}
        itemEdit
        open={isOpen}
      />
    );
  };

  // 处理拖拽到空白区域
  const handleContainerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const jsonData = e.dataTransfer.getData('application/json');
    if (jsonData) {
      try {
        const data = JSON.parse(jsonData);
        if (data.field) {
          // 检查是否已存在相同 field 的过滤器
          const exists = whereFilterItems.some((f) => f.field === data.field);
          if (!exists) {
            // 拖拽字段时，自动添加一个默认过滤条件
            handleWhereFilterAdd({
              id: '',
              field: data.field,
              operator: '=',
              value: undefined,
            });
          }
        }
      } catch {
        // 忽略解析错误
      }
    }
  };

  return (
    <Flex
      vertical={false}
      gap={8}
      onDrop={handleContainerDrop}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      style={{
        flexBasis: 300,
        minHeight: 32,
        height: 32,
        border: isDragOver ? '2px dashed #fa8c16' : '1px solid #e8e8e8',
        borderRadius: 6,
        padding: '2px 8px',
        backgroundColor: '#fafafa',
        transition: 'all 0.2s',
        alignItems: 'center',
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {whereFilterItems.map((item) =>
        item.id ? (
          <Popover
            key={`where-popover-${item.id}`}
            content={renderWhereItemPopover(
              editingItemId === item.id ? (currentEditingItem ?? item) : item,
              editingItemId === item.id,
            )}
            trigger="click"
            placement="bottom"
            open={editingItemId === item.id}
            onOpenChange={(open) => {
              if (!open) {
                setEditingItemId(null);
              }
            }}
            overlayStyle={{ padding: 0 }}
            overlayInnerStyle={{ padding: '8px' }}
          >
            <div
              onClick={() => item.id && setEditingItemId(item.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 6px',
                backgroundColor: '#fff7e6',
                border: '1px solid #ffd591',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 11,
                color: '#fa8c16',
                height: 24,
              }}
            >
              <DownOutlined style={{ fontSize: 8 }} />
              <span
                style={{
                  maxWidth: 140,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getWhereDisplayText(item)}
              </span>
              <CloseOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.id && !item.id.startsWith('temp_')) {
                    handleWhereFilterRemove(item.id);
                  }
                }}
                style={{
                  fontSize: 9,
                  cursor: 'pointer',
                  color: '#8c8c8c',
                  marginLeft: 2,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ff4d4f')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8c8c')}
              />
            </div>
          </Popover>
        ) : null,
      )}
      {whereFilterItems.length === 0 && (
        <span style={{ color: '#bbb', fontSize: 12, padding: '2px 8px' }}>
          拖拽字段到此处
        </span>
      )}
    </Flex>
  );
};

export const HavingShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { filters: havingFilter } = useVBIHavingFilter(builder);

  const [allFields, setAllFields] = useState<
    { name: string; role: 'dimension' | 'measure' }[]
  >([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const prevHavingFilterRef = useRef<string[]>([]);

  // 获取所有字段
  useEffect(() => {
    if (builder) {
      builder.getSchema().then((schema: { name: string; type: string }[]) => {
        setAllFields(
          schema.map((s) => ({
            name: s.name,
            role: s.type === 'number' ? 'measure' : 'dimension',
          })),
        );
      });
    }
  }, [builder]);

  // 将 Having filters 转换为 HavingItem 格式
  const havingFilterItems = useMemo((): HavingItem[] => {
    const result: HavingItem[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const traverse = (items: any[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items.forEach((item: any) => {
        if (item && 'field' in item && item.id) {
          // 操作符格式：gt, lt, eq 等
          const op = item.op || '>';
          // 反向映射操作符
          const reverseOpMap: Record<string, string> = {
            eq: '=',
            ne: '!=',
            gt: '>',
            gte: '>=',
            lt: '<',
            lte: '<=',
          };
          result.push({
            id: item.id,
            field: item.field,
            aggregateFunc: 'sum', // 默认聚合函数
            operator: reverseOpMap[op] || op,
            value: item.value,
          });
        }
      });
    };
    traverse(havingFilter);
    return result;
  }, [havingFilter]);

  // 检测新添加的item并自动打开编辑弹窗
  useEffect(() => {
    const currentIds = havingFilterItems.map((item) => item.id || '');
    const prevIds = prevHavingFilterRef.current;

    const newIds = currentIds.filter((id) => !prevIds.includes(id));
    if (newIds.length > 0) {
      const lastNewId = newIds[newIds.length - 1];
      if (lastNewId) {
        setEditingItemId(lastNewId);
      }
    }

    prevHavingFilterRef.current = currentIds;
  }, [havingFilterItems]);

  // 增量添加 Having 过滤条件 (接收 HavingItem 格式)
  const handleHavingFilterAdd = useCallback(
    (item: HavingItem) => {
      if (builder) {
        // 将 UI 的操作符转换为 VBI 操作符
        const opMap: Record<string, string> = {
          '=': 'eq',
          '!=': 'ne',
          '>': 'gt',
          '>=': 'gte',
          '<': 'lt',
          '<=': 'lte',
        };
        const mappedOperator = opMap[item.operator] || item.operator;

        builder.doc.transact(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          builder.havingFilter.add(item.field, (node: any) => {
            node.setOperator(mappedOperator);
            node.setValue(item.value);
          });
        });
      }
    },
    [builder],
  );

  // 增量删除 Having 过滤条件
  const handleHavingFilterRemove = useCallback(
    (id: string) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.havingFilter.remove(id);
        });
      }
    },
    [builder],
  );

  // 更新 Having 过滤条件
  const handleHavingFilterUpdate = useCallback(
    (updatedItem: HavingItem) => {
      if (!builder || !updatedItem.id) {
        return;
      }

      // 查找现有过滤器以获取原始 field
      const existingFilter = builder.havingFilter.find(
        (entry) => entry.getId() === updatedItem.id,
      );

      const existingField =
        existingFilter && 'getField' in existingFilter
          ? existingFilter.getField()
          : null;

      // 将 UI 的操作符转换为 VBI 操作符
      const opMap: Record<string, string> = {
        '=': 'eq',
        '!=': 'ne',
        '>': 'gt',
        '>=': 'gte',
        '<': 'lt',
        '<=': 'lte',
      };
      const mappedOperator =
        opMap[updatedItem.operator] || updatedItem.operator;

      const filterId = updatedItem.id as string;
      builder.doc.transact(() => {
        // 如果 field 改变了，需要删除旧过滤器并添加新的
        if (existingField !== updatedItem.field) {
          builder.havingFilter.remove(filterId);
          builder.havingFilter.add(updatedItem.field, (node) => {
            node.setOperator(mappedOperator);
            node.setValue(updatedItem.value);
          });
        } else {
          // 使用 update 方法更新现有过滤器，保留 ID
          builder.havingFilter.update(filterId, (node) => {
            node.setOperator(mappedOperator);
            node.setValue(updatedItem.value);
          });
        }
      });
    },
    [builder],
  );

  // 生成 Having 过滤条件显示文本
  const getHavingDisplayText = (item: HavingItem) => {
    return `${item.aggregateFunc}(${item.field}) ${item.operator} ${item.value}`;
  };

  // 单个Having过滤项的编辑面板
  const renderHavingItemPopover = (item: HavingItem) => {
    const handleUpdate = (filters: HavingItem[]) => {
      if (filters.length > 0) {
        handleHavingFilterUpdate(filters[0]);
      }
      // 更新完成后关闭 Popover
      setEditingItemId(null);
    };
    return (
      <HavingFilterPanel
        fields={allFields}
        filters={[item]}
        onChange={handleUpdate}
        onCancel={() => setEditingItemId(null)}
        itemEdit
      />
    );
  };

  // 处理拖拽到空白区域
  const handleContainerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const jsonData = e.dataTransfer.getData('application/json');
    if (jsonData) {
      try {
        const data = JSON.parse(jsonData);
        if (data.role === 'measure' && data.field) {
          // 检查是否已存在相同 field 的 having 过滤器
          const exists = havingFilterItems.some((f) => f.field === data.field);
          if (!exists) {
            // 拖拽度量字段时，自动添加一个默认 having 条件
            handleHavingFilterAdd({
              id: '',
              field: data.field,
              aggregateFunc: 'sum',
              operator: '>',
              value: 0,
            });
          }
        }
      } catch {
        // 忽略解析错误
      }
    }
  };

  return (
    <Flex
      vertical={false}
      gap={8}
      onDrop={handleContainerDrop}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      style={{
        flexBasis: 300,
        minHeight: 32,
        height: 32,
        border: isDragOver ? '2px dashed #722ed1' : '1px solid #e8e8e8',
        borderRadius: 6,
        padding: '2px 8px',
        backgroundColor: '#fafafa',
        transition: 'all 0.2s',
        alignItems: 'center',
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {havingFilterItems.map((item) =>
        item.id ? (
          <Popover
            key={`having-popover-${item.id}`}
            content={renderHavingItemPopover(item)}
            trigger="click"
            placement="bottom"
            open={editingItemId === item.id}
            onOpenChange={(open) => {
              if (!open) {
                setEditingItemId(null);
              }
            }}
            overlayStyle={{ padding: 0 }}
            overlayInnerStyle={{ padding: '8px' }}
          >
            <div
              onClick={() => item.id && setEditingItemId(item.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 6px',
                backgroundColor: '#f9f0ff',
                border: '1px solid #d3adf7',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 11,
                color: '#722ed1',
                height: 24,
              }}
            >
              <DownOutlined style={{ fontSize: 8 }} />
              <span
                style={{
                  maxWidth: 130,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getHavingDisplayText(item)}
              </span>
              <CloseOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.id && !item.id.startsWith('temp_')) {
                    handleHavingFilterRemove(item.id);
                  }
                }}
                style={{ fontSize: 10, cursor: 'pointer', color: '#8c8c8c' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ff4d4f')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8c8c')}
              />
            </div>
          </Popover>
        ) : null,
      )}
      {havingFilterItems.length === 0 && (
        <span style={{ color: '#bbb', fontSize: 12, padding: '2px 8px' }}>
          拖拽度量到此处
        </span>
      )}
    </Flex>
  );
};
