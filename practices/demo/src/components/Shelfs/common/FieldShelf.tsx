import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Dropdown, Flex, Typography, type MenuProps } from 'antd';
import { useState } from 'react';
import {
  readFieldDragPayload,
  readShelfDragIndex,
  writeShelfDragIndex,
  type FieldDragPayload,
} from '../utils/dragDropUtils';

const REMOVE_ICON_DEFAULT_COLOR = '#8c8c8c';
const REMOVE_ICON_HOVER_COLOR = '#ff4d4f';

export const SHELF_MENU_ITEM_STYLE: React.CSSProperties = {
  height: 30,
  lineHeight: '30px',
};

export type FieldShelfTone = {
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

type FieldShelfItem = {
  id: string;
  field: string;
  alias?: string | null;
};

type FieldShelfProps<TItem extends FieldShelfItem> = {
  items: TItem[];
  placeholder: string;
  tone: FieldShelfTone;
  style?: React.CSSProperties;
  maxLabelWidth?: number;
  getDisplayLabel?: (item: TItem) => string;
  buildMenuItems: (item: TItem) => MenuProps['items'];
  onMenuClick: (item: TItem, key: string) => void;
  onRemove: (id: string) => void;
  onAddFromPayload: (payload: FieldDragPayload) => boolean;
  onReorder: (dragIndex: number, dropIndex: number) => void;
};

const getContainerStyle = (params: {
  isDragOver: boolean;
  tone: FieldShelfTone;
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
  tone: FieldShelfTone;
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
    cursor: 'grab',
    fontSize: 10,
    color: tone.textColor,
    height: 22,
    flexShrink: 0,
    transition: 'all 0.2s',
  };
};

const getIconStyle = (params: {
  isHovered: boolean;
  tone: FieldShelfTone;
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

export const FieldShelf = <TItem extends FieldShelfItem>(
  props: FieldShelfProps<TItem>,
) => {
  const {
    items,
    placeholder,
    tone,
    style,
    maxLabelWidth = 112,
    getDisplayLabel,
    buildMenuItems,
    onMenuClick,
    onRemove,
    onAddFromPayload,
    onReorder,
  } = props;

  const [isDragOver, setIsDragOver] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const handleDropOnItem = (event: React.DragEvent, dropIndex: number) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);

    const payload = readFieldDragPayload(event);
    if (payload && onAddFromPayload(payload)) {
      return;
    }

    const dragIndex = readShelfDragIndex(event);
    if (dragIndex === undefined || dragIndex === dropIndex) {
      return;
    }

    onReorder(dragIndex, dropIndex);
  };

  const handleContainerDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const payload = readFieldDragPayload(event);
    if (!payload) {
      return;
    }

    onAddFromPayload(payload);
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
      {items.map((item, index) => {
        const displayLabel = getDisplayLabel
          ? getDisplayLabel(item)
          : item.alias || item.field;
        const isHovered = hoveredItemId === item.id;

        return (
          <div
            key={item.id}
            draggable
            onDragStart={(event) => writeShelfDragIndex(event, index)}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              event.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(event) => handleDropOnItem(event, index)}
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
            style={getItemStyle({
              isHovered,
              tone,
            })}
          >
            <Dropdown
              trigger={['click']}
              placement="bottom"
              arrow={{ pointAtCenter: true }}
              menu={{
                items: buildMenuItems(item),
                onClick: ({ key, domEvent }) => {
                  domEvent.stopPropagation();
                  onMenuClick(item, String(key));
                },
                style: {
                  fontSize: 12,
                  minWidth: 98,
                  paddingBlock: 2,
                },
              }}
            >
              <span
                onClick={(event) => {
                  event.stopPropagation();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  flex: '1 1 auto',
                  minWidth: 0,
                  justifyContent: 'center',
                }}
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
                  ellipsis={{ tooltip: displayLabel }}
                  style={{
                    maxWidth: maxLabelWidth,
                    marginBottom: 0,
                    color: 'inherit',
                    fontSize: 10,
                  }}
                >
                  {displayLabel}
                </Typography.Text>
              </span>
            </Dropdown>
            <CloseOutlined
              onClick={(event) => {
                event.stopPropagation();
                onRemove(item.id);
              }}
              style={{
                fontSize: 9,
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
          </div>
        );
      })}
    </Flex>
  );
};
