import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Flex, Popover, Tooltip, Typography } from 'antd';
import { useVBIStore } from 'src/model';
import { useVBIWhereFilter, useVBISchemaFields } from 'src/hooks';
import { useBuilderDocState } from 'src/hooks/useBuilderDocState';
import { FilterPanel, type FilterItem } from 'src/components/Filter';
import {
  getWhereDisplayText,
  normalizeWhereOperator,
} from 'src/components/Filter/whereFilterUtils';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { readFieldDragPayload } from './dragDropUtils';

export const WhereShelf = ({
  style,
  showRootOperator = true,
}: {
  style?: React.CSSProperties;
  showRootOperator?: boolean;
}) => {
  const builder = useVBIStore((state) => state.builder);
  const { flattenFilters } = useVBIWhereFilter(builder);
  const { schemaFields } = useVBISchemaFields(builder);
  const whereRootOperator = useBuilderDocState<'and' | 'or'>({
    builder,
    fallback: 'and',
    getSnapshot: (activeBuilder) =>
      activeBuilder.whereFilter.toJSON().op === 'or' ? 'or' : 'and',
  });

  const allFields = useMemo(() => {
    return schemaFields.map((field) => ({
      name: field.name,
      role: field.role,
    }));
  }, [schemaFields]);

  const [isDragOver, setIsDragOver] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const prevFiltersRef = useRef<string[]>([]);

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

  useEffect(() => {
    const currentIds = whereFilterItems.map((item) => item.id || '');
    const prevIds = prevFiltersRef.current;

    const newIds = currentIds.filter((id) => !prevIds.includes(id));
    if (newIds.length > 0) {
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

  const handleWhereFilterAdd = useCallback(
    (item: FilterItem) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.whereFilter.add(item.field, (node) => {
          node.setOperator(item.operator);
          if (item.value !== undefined) {
            node.setValue(item.value);
          }
        });
      });
    },
    [builder],
  );

  const handleWhereFilterRemove = useCallback(
    (id: string) => {
      if (!builder) {
        return;
      }

      builder.doc.transact(() => {
        builder.whereFilter.remove(id);
      });
    },
    [builder],
  );

  const handleWhereFilterUpdate = useCallback(
    (updatedItem: FilterItem) => {
      if (!builder || !updatedItem.id) {
        return;
      }

      const filterId = updatedItem.id;
      builder.doc.transact(() => {
        builder.whereFilter.update(filterId, (node) => {
          node.setField(updatedItem.field);
          node.setOperator(updatedItem.operator);
          node.setValue(updatedItem.value);
        });
      });
    },
    [builder],
  );

  const renderWhereItemPopover = (
    item: FilterItem | undefined,
    isOpen: boolean,
  ) => {
    if (!item) {
      return null;
    }

    const handleUpdate = (filters: FilterItem[]) => {
      const firstFilter = filters[0];
      if (firstFilter) {
        handleWhereFilterUpdate(firstFilter);
      }
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
        fixedField={item.field}
      />
    );
  };

  const handleContainerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const payload = readFieldDragPayload(e);
    if (!payload?.field) {
      return;
    }

    handleWhereFilterAdd({
      id: '',
      field: payload.field,
      operator: '=',
      value: undefined,
    });
  };

  const handleRootOperatorChange = (nextOperator: 'and' | 'or') => {
    if (!builder || nextOperator === whereRootOperator) {
      return;
    }

    builder.doc.transact(() => {
      const whereRoot = builder.dsl.get('whereFilter') as
        | { set: (key: string, value: unknown) => void }
        | undefined;
      whereRoot?.set('op', nextOperator);
    });
  };

  const nextWhereRootOperator = whereRootOperator === 'and' ? 'or' : 'and';

  return (
    <Flex
      vertical={false}
      gap={6}
      onDrop={handleContainerDrop}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      style={{
        flexBasis: 300,
        minHeight: 30,
        height: 30,
        border: 'none',
        borderRadius: 6,
        padding: '1px 0',
        backgroundColor: isDragOver
          ? 'rgba(250, 140, 22, 0.11)'
          : 'transparent',
        boxShadow: isDragOver
          ? 'inset 0 0 0 1px rgba(250, 140, 22, 0.45)'
          : 'none',
        transition: 'all 0.2s',
        alignItems: 'center',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'thin',
        ...style,
      }}
    >
      {showRootOperator && (
        <Tooltip
          title={`当前逻辑 ${whereRootOperator.toUpperCase()}，点击切换为 ${nextWhereRootOperator.toUpperCase()}`}
        >
          <Button
            type="text"
            size="small"
            onClick={() => handleRootOperatorChange(nextWhereRootOperator)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 22,
              minWidth: 22,
              height: 18,
              padding: 0,
              lineHeight: 1,
              borderRadius: 5,
              border: '1px solid #ffd8a8',
              background: '#fff',
              color: '#d46b08',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: 0.2,
                lineHeight: 1,
              }}
            >
              {whereRootOperator.toUpperCase()}
            </span>
          </Button>
        </Tooltip>
      )}
      {whereFilterItems.map((item) => {
        if (!item.id) {
          return null;
        }

        const displayText = getWhereDisplayText(item);
        const isHovered = hoveredItemId === item.id;

        return (
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
              setEditingItemId((prev) => {
                if (open) {
                  return item.id ?? null;
                }
                return prev === item.id ? null : prev;
              });
            }}
            overlayStyle={{ padding: 0 }}
            overlayInnerStyle={{ padding: '14px', borderRadius: 10 }}
          >
            <div
              onMouseEnter={() => setHoveredItemId(item.id ?? null)}
              onMouseLeave={() => setHoveredItemId(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '0 6px',
                backgroundColor: isHovered ? '#ffe7cc' : '#fff8ee',
                border: isHovered ? '1px solid #ffbb96' : '1px solid #ffd591',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 10,
                color: '#fa8c16',
                height: 22,
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: isHovered
                    ? 'rgba(250, 140, 22, 0.28)'
                    : 'rgba(250, 140, 22, 0.16)',
                  color: '#d46b08',
                  flexShrink: 0,
                }}
              >
                <DownOutlined style={{ fontSize: 8 }} />
              </span>
              <Typography.Text
                ellipsis={{ tooltip: displayText }}
                style={{
                  maxWidth: 132,
                  marginBottom: 0,
                  color: 'inherit',
                  fontSize: 10,
                }}
              >
                {displayText}
              </Typography.Text>
              <CloseOutlined
                onClick={(event) => {
                  event.stopPropagation();
                  if (item.id && !item.id.startsWith('temp_')) {
                    handleWhereFilterRemove(item.id);
                  }
                }}
                style={{
                  fontSize: 8,
                  cursor: 'pointer',
                  color: '#8c8c8c',
                  marginLeft: 2,
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = '#ff4d4f';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = '#8c8c8c';
                }}
              />
            </div>
          </Popover>
        );
      })}
      {whereFilterItems.length === 0 && (
        <span
          style={{
            color: '#bbb',
            fontSize: 12,
            padding: '2px 8px',
            flexShrink: 0,
          }}
        >
          拖拽字段到此处
        </span>
      )}
    </Flex>
  );
};
