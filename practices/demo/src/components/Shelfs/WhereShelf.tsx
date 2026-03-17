import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Flex, Popover } from 'antd';
import { useVBIStore } from 'src/model';
import { useVBIWhereFilter, useVBISchemaFields } from 'src/hooks';
import { FilterPanel, type FilterItem } from 'src/components/Filter';
import {
  getWhereDisplayText,
  normalizeWhereOperator,
} from 'src/components/Filter/whereFilterUtils';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { readFieldDragPayload } from './dragDropUtils';

export const WhereShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { flattenFilters } = useVBIWhereFilter(builder);
  const { schemaFields } = useVBISchemaFields(builder);

  const allFields = useMemo(() => {
    return schemaFields.map((field) => ({
      name: field.name,
      role: field.role,
    }));
  }, [schemaFields]);

  const [isDragOver, setIsDragOver] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
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

    const exists = whereFilterItems.some(
      (filter) => filter.field === payload.field,
    );
    if (exists) {
      return;
    }

    handleWhereFilterAdd({
      id: '',
      field: payload.field,
      operator: '=',
      value: undefined,
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
                onClick={(event) => {
                  event.stopPropagation();
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
      {whereFilterItems.length === 0 && (
        <span style={{ color: '#bbb', fontSize: 12, padding: '2px 8px' }}>
          拖拽字段到此处
        </span>
      )}
    </Flex>
  );
};
