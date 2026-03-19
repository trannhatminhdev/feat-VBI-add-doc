import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Popover, Typography, theme } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ShelfItemDropZones,
  createShelfItemDragId,
  type ShelfFieldPayload,
  type ShelfItemDragData,
  type ShelfType,
  useShelfDndRegistration,
  useShelfItemDropTargets,
} from '../dnd';
import {
  ShelfRootOperatorButton,
  type RootOperator,
  type RootOperatorButtonColor,
} from './ShelfRootOperatorButton';
import { ShelfTrack, type ShelfTone } from './ShelfTrack';

const REMOVE_ICON_DEFAULT_COLOR = '#8c8c8c';
const REMOVE_ICON_HOVER_COLOR = '#ff4d4f';
const SHELF_ITEM_SPACING = 6;

export type FilterShelfTone = ShelfTone;

type FilterShelfItem = {
  id: string;
  field: string;
};

type FilterShelfProps<TItem extends FilterShelfItem> = {
  shelf: ShelfType;
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
  getItemPayload: (item: TItem) => ShelfFieldPayload;
  onAddFieldAt: (payload: ShelfFieldPayload, insertIndex: number) => void;
  onReorder: (dragIndex: number, insertIndex: number) => void;
  onRemove: (id: string) => void;
  renderEditor: (params: {
    item: TItem;
    isOpen: boolean;
    close: () => void;
  }) => React.ReactNode;
};

const getItemStyle = (params: {
  isHovered: boolean;
  isDragging: boolean;
  tone: FilterShelfTone;
  transform: string | undefined;
}): React.CSSProperties => {
  const { isHovered, isDragging, tone, transform } = params;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    padding: '0 5px',
    backgroundColor: isHovered ? tone.itemHoverBackground : tone.itemBackground,
    border: isHovered
      ? `1px solid ${tone.itemHoverBorder}`
      : `1px solid ${tone.itemBorder}`,
    borderRadius: 8,
    cursor: isDragging ? 'grabbing' : 'grab',
    fontSize: 11,
    color: tone.textColor,
    height: 20,
    flexShrink: 0,
    transition: 'border-color 0.2s, background-color 0.2s, color 0.2s',
    opacity: isDragging ? 0 : 1,
    visibility: isDragging ? 'hidden' : 'visible',
    transform,
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
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: isHovered ? tone.iconHoverBackground : tone.iconBackground,
    color: tone.iconColor,
    flexShrink: 0,
  };
};

const getRemoveIconWrapperStyle = (isHovered: boolean): React.CSSProperties => {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isHovered ? 10 : 0,
    marginLeft: isHovered ? 2 : 0,
    overflow: 'hidden',
    opacity: isHovered ? 1 : 0,
    transition: 'width 0.2s, margin-left 0.2s, opacity 0.2s',
    flexShrink: 0,
  };
};

const FilterShelfTag = <TItem extends FilterShelfItem>(props: {
  shelf: ShelfType;
  item: TItem;
  index: number;
  displayText: string;
  tone: FilterShelfTone;
  maxLabelWidth: number;
  isHovered: boolean;
  setHoveredItemId: (id: string | null) => void;
  payload: ShelfFieldPayload;
  isOpen: boolean;
  close: () => void;
  setOpen: (open: boolean) => void;
  onRemove: (id: string) => void;
  renderEditor: (params: {
    item: TItem;
    isOpen: boolean;
    close: () => void;
  }) => React.ReactNode;
}) => {
  const { token } = theme.useToken();
  const {
    shelf,
    item,
    index,
    displayText,
    tone,
    maxLabelWidth,
    isHovered,
    setHoveredItemId,
    payload,
    isOpen,
    close,
    setOpen,
    onRemove,
    renderEditor,
  } = props;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: createShelfItemDragId(shelf, item.id),
      data: {
        kind: 'shelf-item',
        shelf,
        itemId: item.id,
        index,
        payload,
        label: displayText,
      } satisfies ShelfItemDragData,
    });
  const dropTargets = useShelfItemDropTargets({
    shelf,
    index,
  });

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexShrink: 0,
        paddingRight: SHELF_ITEM_SPACING,
      }}
    >
      <ShelfItemDropZones
        color={tone.iconColor}
        beforeRef={dropTargets.before.setNodeRef}
        afterRef={dropTargets.after.setNodeRef}
        isBeforeOver={dropTargets.before.isOver}
        isAfterOver={dropTargets.after.isOver}
      />
      <Popover
        content={renderEditor({
          item,
          isOpen,
          close,
        })}
        trigger="click"
        placement="bottom"
        open={isOpen}
        onOpenChange={setOpen}
        arrow={false}
        overlayStyle={{ padding: 0 }}
        overlayInnerStyle={{
          padding: '14px 18px 12px',
          borderRadius: token.borderRadiusLG,
        }}
      >
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          onMouseEnter={() => setHoveredItemId(item.id)}
          onMouseLeave={() => setHoveredItemId(null)}
          style={getItemStyle({
            isHovered: isHovered || dropTargets.isOver,
            isDragging,
            tone,
            transform: isDragging
              ? undefined
              : CSS.Translate.toString(transform),
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
              fontSize: 11,
            }}
          >
            {displayText}
          </Typography.Text>
          <span style={getRemoveIconWrapperStyle(isHovered)}>
            <CloseOutlined
              onClick={(event) => {
                event.stopPropagation();
                onRemove(item.id);
              }}
              style={{
                fontSize: 8,
                cursor: 'pointer',
                color: REMOVE_ICON_DEFAULT_COLOR,
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.color = REMOVE_ICON_HOVER_COLOR;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color = REMOVE_ICON_DEFAULT_COLOR;
              }}
            />
          </span>
        </div>
      </Popover>
    </div>
  );
};

export const FilterShelf = <TItem extends FilterShelfItem>(
  props: FilterShelfProps<TItem>,
) => {
  const {
    shelf,
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
    getItemPayload,
    onAddFieldAt,
    onReorder,
    onRemove,
    renderEditor,
  } = props;

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const prevIdsRef = useRef<string[]>([]);

  const dndItems = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      payload: getItemPayload(item),
    }));
  }, [getItemPayload, items]);

  const dndAdapter = useMemo(() => {
    return {
      shelf,
      items: dndItems,
      addFieldAt: onAddFieldAt,
      removeItem: onRemove,
      reorderWithin: onReorder,
    };
  }, [dndItems, onAddFieldAt, onRemove, onReorder, shelf]);

  useShelfDndRegistration(dndAdapter);

  useEffect(() => {
    const currentIds = Array.isArray(items) ? items.map((item) => item.id) : [];
    const prevIds = Array.isArray(prevIdsRef.current) ? prevIdsRef.current : [];
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

  return (
    <ShelfTrack
      shelf={shelf}
      itemsCount={items.length}
      placeholder={placeholder}
      tone={tone}
      style={style}
      leading={
        showRootOperator &&
        rootOperator &&
        rootOperatorColors &&
        onRootOperatorChange ? (
          <ShelfRootOperatorButton
            operator={rootOperator}
            colors={rootOperatorColors}
            onChange={onRootOperatorChange}
          />
        ) : null
      }
    >
      {items.map((item, index) => {
        const payload = getItemPayload(item);
        const displayText = getDisplayText(item);
        const isHovered = hoveredItemId === item.id;
        const isOpen = editingItemId === item.id;

        return (
          <FilterShelfTag
            key={item.id}
            shelf={shelf}
            item={isOpen && currentEditingItem ? currentEditingItem : item}
            index={index}
            displayText={displayText}
            tone={tone}
            maxLabelWidth={maxLabelWidth}
            isHovered={isHovered}
            setHoveredItemId={setHoveredItemId}
            payload={payload}
            isOpen={isOpen}
            close={() => setEditingItemId(null)}
            setOpen={(open) => {
              setEditingItemId((prev) => {
                if (open) {
                  return item.id;
                }
                return prev === item.id ? null : prev;
              });
            }}
            onRemove={onRemove}
            renderEditor={renderEditor}
          />
        );
      })}
    </ShelfTrack>
  );
};
