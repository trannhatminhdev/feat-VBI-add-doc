import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import {
  Dropdown,
  Flex,
  Input,
  Modal,
  Typography,
  message,
  type MenuProps,
} from 'antd';
import { useVBIStore } from 'src/model';
import { useVBIDimensions } from 'src/hooks';
import { useState } from 'react';
import {
  readFieldDragPayload,
  readShelfDragIndex,
  writeShelfDragIndex,
} from './dragDropUtils';
import { reorderYArray, type YArrayLike } from './reorderUtils';
import {
  getNextFieldDuplicateName,
  hasDuplicateShelfName,
} from './shelfNameUtils';

const MENU_ITEM_STYLE: React.CSSProperties = {
  height: 30,
  lineHeight: '30px',
};

export const DimensionShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { dimensions, addDimension, removeDimension, updateDimension } =
    useVBIDimensions(builder);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const addDraggedFieldToShelf = (
    dragField: ReturnType<typeof readFieldDragPayload>,
  ) => {
    if (!dragField?.field) {
      return false;
    }

    const fieldName = dragField.field;
    const nextName = getNextFieldDuplicateName({
      field: fieldName,
      items: dimensions,
    });

    addDimension(fieldName, (node) => {
      if (nextName !== fieldName) {
        node.setAlias(nextName);
      }
    });
    return true;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    writeShelfDragIndex(e, index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setIsDragOver(false);

    if (addDraggedFieldToShelf(readFieldDragPayload(e))) {
      return;
    }

    const dragIndex = readShelfDragIndex(e);
    if (dragIndex === undefined || dragIndex === dropIndex) {
      return;
    }

    const draggedDimension = dimensions[dragIndex];
    if (!draggedDimension) {
      return;
    }

    const yDimensions = builder.dsl.get('dimensions') as YArrayLike | undefined;
    if (!yDimensions) {
      return;
    }

    builder.doc.transact(() => {
      reorderYArray({ yArray: yDimensions, dragIndex, dropIndex });
    });
  };

  const handleContainerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    addDraggedFieldToShelf(readFieldDragPayload(e));
  };

  const renameDimension = (id: string, alias: string) => {
    updateDimension(id, (node) => {
      node.setAlias(alias);
    });
  };

  const openRenameModal = (id: string, currentAlias: string) => {
    let nextAlias = currentAlias;
    Modal.confirm({
      title: '重命名维度',
      okText: '保存',
      cancelText: '取消',
      content: (
        <Input
          autoFocus
          defaultValue={currentAlias}
          placeholder="请输入维度名称"
          maxLength={50}
          onChange={(e) => {
            nextAlias = e.target.value;
          }}
        />
      ),
      onOk: () => {
        const trimmed = nextAlias.trim();
        if (!trimmed) {
          message.warning('名称不能为空');
          return Promise.reject();
        }
        if (
          hasDuplicateShelfName({
            name: trimmed,
            items: dimensions,
            excludeId: id,
          })
        ) {
          message.error('名称已存在');
          return Promise.reject();
        }
        renameDimension(id, trimmed);
        return Promise.resolve();
      },
    });
  };

  const buildDimensionMenuItems = (): MenuProps['items'] => {
    return [
      {
        key: 'rename',
        label: '重命名',
        style: MENU_ITEM_STYLE,
      },
      {
        key: 'delete',
        label: <span style={{ color: '#ff4d4f' }}>删除</span>,
        style: MENU_ITEM_STYLE,
      },
    ];
  };

  const onDimensionMenuClick = (
    dimension: (typeof dimensions)[number],
    key: string,
  ) => {
    if (key === 'rename') {
      openRenameModal(dimension.id, dimension.alias || dimension.field);
      return;
    }

    if (key === 'delete') {
      removeDimension(dimension.id);
    }
  };

  return (
    <Flex
      vertical={false}
      gap={6}
      onDrop={(e) => {
        handleContainerDrop(e);
        setIsDragOver(false);
      }}
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
          ? 'rgba(22, 119, 255, 0.08)'
          : 'transparent',
        boxShadow: isDragOver
          ? 'inset 0 0 0 1px rgba(22, 119, 255, 0.35)'
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
      {dimensions.length === 0 && (
        <span
          style={{
            color: '#bbb',
            fontSize: 12,
            padding: '2px 8px',
            flexShrink: 0,
          }}
        >
          拖拽维度/指标到此处
        </span>
      )}
      {dimensions.map((dimension, index) => {
        const displayLabel = dimension.alias || dimension.field;
        const isHovered = hoveredItemId === dimension.id;

        return (
          <div
            key={`dimension-shelf-${dimension.id}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onMouseEnter={() => setHoveredItemId(dimension.id)}
            onMouseLeave={() => setHoveredItemId(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '0 6px',
              backgroundColor: isHovered ? '#ddeeff' : '#edf5ff',
              border: isHovered ? '1px solid #91caff' : '1px solid #b7d9ff',
              borderRadius: 6,
              cursor: 'grab',
              fontSize: 10,
              color: '#0958d9',
              height: 22,
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            <Dropdown
              trigger={['click']}
              placement="bottom"
              arrow={{ pointAtCenter: true }}
              menu={{
                items: buildDimensionMenuItems(),
                onClick: ({ key, domEvent }) => {
                  domEvent.stopPropagation();
                  onDimensionMenuClick(dimension, key);
                },
                style: {
                  fontSize: 12,
                  minWidth: 98,
                  paddingBlock: 2,
                },
              }}
            >
              <span
                onClick={(e) => {
                  e.stopPropagation();
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
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    backgroundColor: isHovered
                      ? 'rgba(22, 119, 255, 0.26)'
                      : 'rgba(22, 119, 255, 0.15)',
                    color: '#1677ff',
                    flexShrink: 0,
                  }}
                >
                  <DownOutlined style={{ fontSize: 8 }} />
                </span>
                <Typography.Text
                  ellipsis={{ tooltip: displayLabel }}
                  style={{
                    maxWidth: 92,
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
                removeDimension(dimension.id);
              }}
              style={{ fontSize: 9, cursor: 'pointer', color: '#8c8c8c' }}
              onMouseEnter={(event) => {
                event.currentTarget.style.color = '#ff4d4f';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color = '#8c8c8c';
              }}
            />
          </div>
        );
      })}
    </Flex>
  );
};
