import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Flex, Popover } from 'antd';
import { useVBIStore } from 'src/model';
import { useVBIHavingFilter, useVBISchemaFields } from 'src/hooks';
import { HavingFilterPanel, type HavingItem } from 'src/components/Filter';
import {
  buildHavingOperator,
  getHavingDisplayText,
  parseHavingOperator,
} from 'src/components/Filter/havingFilterUtils';
import {
  isVBIHavingFilter,
  isVBIHavingGroup,
  type VBIHavingClause,
} from '@visactor/vbi';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { readFieldDragPayload } from './dragDropUtils';

const flattenHavingFilters = (clauses: VBIHavingClause[]): HavingItem[] => {
  const result: HavingItem[] = [];

  const traverse = (items: VBIHavingClause[]) => {
    items.forEach((item) => {
      if (isVBIHavingGroup(item)) {
        traverse(item.conditions);
        return;
      }

      if (isVBIHavingFilter(item) && item.id) {
        const parsedOperator = parseHavingOperator(item.op);
        result.push({
          id: item.id,
          field: item.field,
          aggregateFunc: parsedOperator.aggregateFunc,
          operator: parsedOperator.operator,
          value: item.value,
        });
      }
    });
  };

  traverse(clauses);
  return result;
};

export const HavingShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { filters: havingFilterClauses } = useVBIHavingFilter(builder);
  const { schemaFields } = useVBISchemaFields(builder);

  const allFields = useMemo(() => {
    return schemaFields.map((field) => ({
      name: field.name,
      role: field.role,
    }));
  }, [schemaFields]);

  const [isDragOver, setIsDragOver] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const prevHavingFilterRef = useRef<string[]>([]);

  const havingFilterItems = useMemo(() => {
    return flattenHavingFilters(havingFilterClauses);
  }, [havingFilterClauses]);

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

  const handleHavingFilterAdd = useCallback(
    (item: HavingItem) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.havingFilter.add(item.field, (node) => {
          node.setOperator(
            buildHavingOperator({
              aggregateFunc: item.aggregateFunc,
              operator: item.operator,
            }),
          );
          node.setValue(item.value);
        });
      });
    },
    [builder],
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
      const nextOperator = buildHavingOperator({
        aggregateFunc: updatedItem.aggregateFunc,
        operator: updatedItem.operator,
      });

      builder.doc.transact(() => {
        if (existingField !== updatedItem.field) {
          builder.havingFilter.remove(updatedItem.id as string);
          builder.havingFilter.add(updatedItem.field, (node) => {
            node.setOperator(nextOperator);
            node.setValue(updatedItem.value);
          });
          return;
        }

        builder.havingFilter.update(updatedItem.id as string, (node) => {
          node.setOperator(nextOperator);
          node.setValue(updatedItem.value);
        });
      });
    },
    [builder],
  );

  const renderHavingItemPopover = (item: HavingItem) => {
    const handleUpdate = (filters: HavingItem[]) => {
      const firstFilter = filters[0];
      if (firstFilter) {
        handleHavingFilterUpdate(firstFilter);
      }
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

  const handleContainerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const payload = readFieldDragPayload(e);
    if (!payload?.field || payload.role !== 'measure') {
      return;
    }

    const exists = havingFilterItems.some(
      (filter) => filter.field === payload.field,
    );
    if (exists) {
      return;
    }

    handleHavingFilterAdd({
      id: '',
      field: payload.field,
      aggregateFunc: 'sum',
      operator: '>',
      value: 0,
    });
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
                {getHavingDisplayText({
                  aggregateFunc: item.aggregateFunc,
                  field: item.field,
                  operator: item.operator,
                  value: item.value,
                })}
              </span>
              <CloseOutlined
                onClick={(event) => {
                  event.stopPropagation();
                  if (item.id && !item.id.startsWith('temp_')) {
                    handleHavingFilterRemove(item.id);
                  }
                }}
                style={{ fontSize: 10, cursor: 'pointer', color: '#8c8c8c' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = '#ff4d4f';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = '#8c8c8c';
                }}
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
