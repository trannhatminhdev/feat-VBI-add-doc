import { DownOutlined, HolderOutlined } from '@ant-design/icons';
import { Dropdown, Flex, Input, Modal, message, type MenuProps } from 'antd';
import { useVBIStore } from 'src/model';
import { useVBIDimensions } from 'src/hooks';
import { useState } from 'react';
import {
  readFieldDragPayload,
  readShelfDragIndex,
  writeShelfDragIndex,
} from './dragDropUtils';
import { reorderYArray, type YArrayLike } from './reorderUtils';

export const DimensionShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { dimensions, addDimension, removeDimension, updateDimension } =
    useVBIDimensions(builder);
  const [isDragOver, setIsDragOver] = useState(false);

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
    const dragPayload = readFieldDragPayload(e);
    if (dragPayload?.field) {
      if (!dimensions.some((d) => d.field === dragPayload.field)) {
        addDimension(dragPayload.field);
      }
      return;
    }

    // 内部排序
    const dragIndex = readShelfDragIndex(e);
    if (dragIndex === undefined || dragIndex === dropIndex) {
      return;
    }

    const draggedDimension = dimensions[dragIndex];
    if (draggedDimension) {
      const yDimensions = builder.dsl.get('dimensions') as
        | YArrayLike
        | undefined;
      if (!yDimensions) return;

      builder.doc.transact(() => {
        reorderYArray({ yArray: yDimensions, dragIndex, dropIndex });
      });
    }
  };

  // 处理拖拽到空白区域
  const handleContainerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const dragPayload = readFieldDragPayload(e);
    if (
      dragPayload?.field &&
      !dimensions.some((d) => d.field === dragPayload.field)
    ) {
      addDimension(dragPayload.field);
    }
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
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: <span style={{ color: '#ff4d4f' }}>删除</span>,
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
      gap={8}
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
        minHeight: 32,
        height: 32,
        border: isDragOver ? '2px dashed #1890ff' : '1px solid #e8e8e8',
        borderRadius: 6,
        padding: '2px 8px',
        backgroundColor: '#fafafa',
        transition: 'all 0.2s',
        alignItems: 'center',
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {dimensions.length === 0 && (
        <span style={{ color: '#bbb', fontSize: 12, padding: '2px 8px' }}>
          拖拽维度/指标到此处
        </span>
      )}
      {dimensions.map((dimension, index) => (
        <div
          key={`dimension-shelf-${dimension.id}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 6px',
            backgroundColor: '#e6f7ff',
            border: '1px solid #91d5ff',
            borderRadius: 4,
            cursor: 'grab',
            fontSize: 11,
            color: '#1890ff',
            height: 24,
          }}
        >
          <HolderOutlined
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: 10, cursor: 'grab', color: '#8c8c8c' }}
          />
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
                flex: 1,
                minWidth: 0,
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  maxWidth: 100,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {dimension.alias || dimension.field}
              </span>
              <DownOutlined style={{ fontSize: 9, color: '#8c8c8c' }} />
            </span>
          </Dropdown>
        </div>
      ))}
    </Flex>
  );
};
