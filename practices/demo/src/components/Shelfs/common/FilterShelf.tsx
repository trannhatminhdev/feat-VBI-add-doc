import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Flex, Popover, Typography } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  readFieldDragPayload,
  type FieldDragPayload,
} from '../utils/dragDropUtils';
import {
  ShelfRootOperatorButton,
  type RootOperator,
  type RootOperatorButtonColor,
} from './ShelfRootOperatorButton';

const REMOVE_ICON_DEFAULT_COLOR = '#8c8c8c';
const REMOVE_ICON_HOVER_COLOR = '#ff4d4f';

export type FilterShelfTone = {
  dragOverBackground: string;
  dragOverBorder: string;
  itemBackground: string;
  itemHoverBackground: string;
  itemBorder: string;
  itemHoverBorder: string;
  textColor: string;
  iconBackground: string;
  iconHoverBackground: string;
  iconColor: string;
};

type FilterShelfItem = {
  id: string;
};

type FilterShelfProps<TItem extends FilterShelfItem> = {
  items: TItem[];
  style?: React.CSSProperties;
  placeholder: string;
  tone: FilterShelfTone;
  maxLabelWidth?: number;
  showRootOperator?: boolean;
  rootOperator?: RootOperator;
  rootOperatorColors?: RootOperatorButtonColor;
  onRootOperatorChange?: (nextOperator: RootOperator) => void;
  getDisplayText: (item: TItem) => string;
  onDropField: (payload: FieldDragPayload) => void;
  onRemove: (id: string) => void;
  renderEditor: (params: {
    item: TItem;
    isOpen: boolean;
    close: () => void;
  }) => React.ReactNode;
};

const getContainerStyle = (params: {
  isDragOver: boolean;
  tone: FilterShelfTone;
  style?: React.CSSProperties;
}): React.CSSProperties => {
  const { isDragOver, tone, style } = params;

  return {
    flexBasis: 300,
    minHeight: 30,
    height: 30,
    border: 'none',
    borderRadius: 6,
    padding: '1px 0',
    backgroundColor: isDragOver ? tone.dragOverBackground : 'transparent',
    boxShadow: isDragOver ? `inset 0 0 0 1px ${tone.dragOverBorder}` : 'none',
    transition: 'all 0.2s',
    alignItems: 'center',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'thin',
    ...style,
  };
};

const getItemStyle = (params: {
  isHovered: boolean;
  tone: FilterShelfTone;
}): React.CSSProperties => {
  const { isHovered, tone } = params;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '0 6px',
    backgroundColor: isHovered ? tone.itemHoverBackground : tone.itemBackground,
    border: isHovered
      ? `1px solid ${tone.itemHoverBorder}`
      : `1px solid ${tone.itemBorder}`,
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 10,
    color: tone.textColor,
    height: 22,
    flexShrink: 0,
    transition: 'all 0.2s',
  };
};

const getIconStyle = (params: {
  isHovered: boolean;
  tone: FilterShelfTone;
}): React.CSSProperties => {
  const { isHovered, tone } = params;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: isHovered ? tone.iconHoverBackground : tone.iconBackground,
    color: tone.iconColor,
    flexShrink: 0,
  };
};

export const FilterShelf = <TItem extends FilterShelfItem>(
  props: FilterShelfProps<TItem>,
) => {
  const {
    items,
    style,
    placeholder,
    tone,
    maxLabelWidth = 132,
    showRootOperator = true,
    rootOperator,
    rootOperatorColors,
    onRootOperatorChange,
    getDisplayText,
    onDropField,
    onRemove,
    renderEditor,
  } = props;

  const [isDragOver, setIsDragOver] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const prevIdsRef = useRef<string[]>([]);

  useEffect(() => {
    const currentIds = items.map((item) => item.id);
    const prevIds = prevIdsRef.current;
    const newIds = currentIds.filter((id) => !prevIds.includes(id));

    if (newIds.length > 0) {
      setEditingItemId(newIds[newIds.length - 1] ?? null);
    }

    prevIdsRef.current = currentIds;
  }, [items]);

  const currentEditingItem = useMemo(() => {
    if (!editingItemId) {
      return undefined;
    }

    return items.find((item) => item.id === editingItemId);
  }, [editingItemId, items]);

  useEffect(() => {
    if (editingItemId && !currentEditingItem) {
      setEditingItemId(null);
    }
  }, [editingItemId, currentEditingItem]);

  const handleContainerDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const payload = readFieldDragPayload(event);
    if (!payload?.field) {
      return;
    }

    onDropField(payload);
  };

  return (
    <Flex
      vertical={false}
      gap={6}
      onDrop={handleContainerDrop}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      style={getContainerStyle({
        isDragOver,
        tone,
        style,
      })}
    >
      {showRootOperator &&
        rootOperator &&
        rootOperatorColors &&
        onRootOperatorChange && (
          <ShelfRootOperatorButton
            operator={rootOperator}
            colors={rootOperatorColors}
            onChange={onRootOperatorChange}
          />
        )}
      {items.map((item) => {
        const displayText = getDisplayText(item);
        const isHovered = hoveredItemId === item.id;
        const isOpen = editingItemId === item.id;

        return (
          <Popover
            key={item.id}
            content={renderEditor({
              item: isOpen && currentEditingItem ? currentEditingItem : item,
              isOpen,
              close: () => setEditingItemId(null),
            })}
            trigger="click"
            placement="bottom"
            open={isOpen}
            onOpenChange={(open) => {
              setEditingItemId((prev) => {
                if (open) {
                  return item.id;
                }
                return prev === item.id ? null : prev;
              });
            }}
            overlayStyle={{ padding: 0 }}
            overlayInnerStyle={{ padding: '14px', borderRadius: 10 }}
          >
            <div
              onMouseEnter={() => setHoveredItemId(item.id)}
              onMouseLeave={() => setHoveredItemId(null)}
              style={getItemStyle({
                isHovered,
                tone,
              })}
            >
              <span
                style={getIconStyle({
                  isHovered,
                  tone,
                })}
              >
                <DownOutlined style={{ fontSize: 8 }} />
              </span>
              <Typography.Text
                ellipsis={{ tooltip: displayText }}
                style={{
                  maxWidth: maxLabelWidth,
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
                  onRemove(item.id);
                }}
                style={{
                  fontSize: 8,
                  cursor: 'pointer',
                  color: REMOVE_ICON_DEFAULT_COLOR,
                  marginLeft: 2,
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = REMOVE_ICON_HOVER_COLOR;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = REMOVE_ICON_DEFAULT_COLOR;
                }}
              />
            </div>
          </Popover>
        );
      })}
      {items.length === 0 && (
        <span
          style={{
            color: '#bbb',
            fontSize: 12,
            padding: '2px 8px',
            flexShrink: 0,
          }}
        >
          {placeholder}
        </span>
      )}
    </Flex>
  );
};
