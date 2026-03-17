import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Flex, Popover, Tooltip, Typography } from 'antd';
import { useVBIStore } from 'src/model';
import { useVBIHavingFilter, useVBISchemaFields } from 'src/hooks';
import { useBuilderDocState } from 'src/hooks/useBuilderDocState';
import { HavingFilterPanel, type HavingItem } from 'src/components/Filter';
import {
  getDefaultHavingAggregateByFieldRole,
  getDefaultHavingOperator,
  getHavingDisplayText,
  isHavingNumericAggregate,
  normalizeHavingAggregate,
  normalizeHavingOperator,
  toHavingDslOperator,
} from 'src/components/Filter/havingFilterUtils';
import {
  isVBIHavingFilter,
  isVBIHavingGroup,
  type VBIHavingClause,
} from '@visactor/vbi';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { readFieldDragPayload } from './dragDropUtils';
import type { FieldRole } from 'src/utils/fieldRole';

const flattenHavingFilters = (
  clauses: VBIHavingClause[],
  fieldRoleMap: Record<string, FieldRole>,
): HavingItem[] => {
  const result: HavingItem[] = [];

  const traverse = (items: VBIHavingClause[]) => {
    items.forEach((item) => {
      if (isVBIHavingGroup(item)) {
        traverse(item.conditions);
        return;
      }

      if (isVBIHavingFilter(item) && item.id) {
        const fieldRole = fieldRoleMap[item.field] ?? 'measure';
        result.push({
          id: item.id,
          field: item.field,
          aggregate: normalizeHavingAggregate(item.aggregate, fieldRole),
          operator: normalizeHavingOperator(item.op),
          value: item.value,
        });
      }
    });
  };

  traverse(clauses);
  return result;
};

export const HavingShelf = ({
  style,
  showRootOperator = true,
}: {
  style?: React.CSSProperties;
  showRootOperator?: boolean;
}) => {
  const builder = useVBIStore((state) => state.builder);
  const { filters: havingFilterClauses } = useVBIHavingFilter(builder);
  const { schemaFields, fieldRoleMap } = useVBISchemaFields(builder);
  const havingRootOperator = useBuilderDocState<'and' | 'or'>({
    builder,
    fallback: 'and',
    getSnapshot: (activeBuilder) =>
      activeBuilder.havingFilter.toJSON().op === 'or' ? 'or' : 'and',
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
  const prevHavingFilterRef = useRef<string[]>([]);

  const havingFilterItems = useMemo(() => {
    return flattenHavingFilters(havingFilterClauses, fieldRoleMap);
  }, [havingFilterClauses, fieldRoleMap]);

  const currentEditingItem = useMemo(() => {
    if (!editingItemId) {
      return undefined;
    }
    return havingFilterItems.find((item) => item.id === editingItemId);
  }, [editingItemId, havingFilterItems]);

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

  useEffect(() => {
    if (editingItemId && !currentEditingItem) {
      setEditingItemId(null);
    }
  }, [editingItemId, currentEditingItem]);

  const handleHavingFilterAdd = useCallback(
    (item: HavingItem) => {
      if (!builder) {
        return;
      }

      const fieldRole = fieldRoleMap[item.field] ?? 'measure';
      const aggregate = normalizeHavingAggregate(item.aggregate, fieldRole);

      builder.doc.transact(() => {
        builder.havingFilter.add(item.field, (node) => {
          node.setAggregate(aggregate);
          node.setOperator(toHavingDslOperator(item.operator));
          if (item.value !== undefined) {
            node.setValue(item.value);
          }
        });
      });
    },
    [builder, fieldRoleMap],
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
      const fieldRole = fieldRoleMap[updatedItem.field] ?? 'measure';
      const aggregate = normalizeHavingAggregate(
        updatedItem.aggregate,
        fieldRole,
      );

      builder.doc.transact(() => {
        if (existingField !== updatedItem.field) {
          builder.havingFilter.remove(updatedItem.id as string);
          builder.havingFilter.add(updatedItem.field, (node) => {
            node.setAggregate(aggregate);
            node.setOperator(toHavingDslOperator(updatedItem.operator));
            if (updatedItem.value !== undefined) {
              node.setValue(updatedItem.value);
            }
          });
          return;
        }

        builder.havingFilter.update(updatedItem.id as string, (node) => {
          node.setAggregate(aggregate);
          node.setOperator(toHavingDslOperator(updatedItem.operator));
          node.setValue(updatedItem.value);
        });
      });
    },
    [builder, fieldRoleMap],
  );

  const renderHavingItemPopover = (
    item: HavingItem | undefined,
    isOpen: boolean,
  ) => {
    if (!item) {
      return null;
    }

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

    const defaultAggregate = getDefaultHavingAggregateByFieldRole(payload.role);
    const defaultOperator = getDefaultHavingOperator(
      isHavingNumericAggregate(payload.role, defaultAggregate),
    );

    handleHavingFilterAdd({
      id: '',
      field: payload.field,
      aggregate: defaultAggregate,
      operator: defaultOperator,
      value: undefined,
    });
  };

  const handleRootOperatorChange = (nextOperator: 'and' | 'or') => {
    if (!builder || nextOperator === havingRootOperator) {
      return;
    }

    builder.doc.transact(() => {
      const havingRoot = builder.dsl.get('havingFilter') as
        | { set: (key: string, value: unknown) => void }
        | undefined;
      havingRoot?.set('op', nextOperator);
    });
  };

  const nextHavingRootOperator = havingRootOperator === 'and' ? 'or' : 'and';

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
        backgroundColor: isDragOver ? 'rgba(22, 119, 255, 0.1)' : 'transparent',
        boxShadow: isDragOver
          ? 'inset 0 0 0 1px rgba(22, 119, 255, 0.45)'
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
          title={`当前逻辑 ${havingRootOperator.toUpperCase()}，点击切换为 ${nextHavingRootOperator.toUpperCase()}`}
        >
          <Button
            type="text"
            size="small"
            onClick={() => handleRootOperatorChange(nextHavingRootOperator)}
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
              border: '1px solid #bdd7ff',
              background: '#fff',
              color: '#0958d9',
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
              {havingRootOperator.toUpperCase()}
            </span>
          </Button>
        </Tooltip>
      )}
      {havingFilterItems.map((item) => {
        if (!item.id) {
          return null;
        }

        const displayText = getHavingDisplayText(item);
        const isHovered = hoveredItemId === item.id;

        return (
          <Popover
            key={`having-popover-${item.id}`}
            content={renderHavingItemPopover(
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
                backgroundColor: isHovered ? '#dbeeff' : '#edf5ff',
                border: isHovered ? '1px solid #69b1ff' : '1px solid #91caff',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 10,
                color: '#1677ff',
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
                    ? 'rgba(22, 119, 255, 0.28)'
                    : 'rgba(22, 119, 255, 0.16)',
                  color: '#0958d9',
                  flexShrink: 0,
                }}
              >
                <DownOutlined style={{ fontSize: 8 }} />
              </span>
              <Typography.Text
                ellipsis={{ tooltip: displayText }}
                style={{
                  maxWidth: 124,
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
                    handleHavingFilterRemove(item.id);
                  }
                }}
                style={{ fontSize: 8, cursor: 'pointer', color: '#8c8c8c' }}
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
      {havingFilterItems.length === 0 && (
        <span
          style={{
            color: '#bbb',
            fontSize: 12,
            padding: '2px 8px',
            flexShrink: 0,
          }}
        >
          拖拽字段到此处（支持维度/度量）
        </span>
      )}
    </Flex>
  );
};
