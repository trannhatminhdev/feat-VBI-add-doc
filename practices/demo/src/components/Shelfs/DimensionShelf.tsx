import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import { useVBIStore } from 'src/model';
import { useVBIDimensions } from 'src/hooks';
import { useState } from 'react';

export const DimensionShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { dimensions, addDimension, removeDimension } =
    useVBIDimensions(builder);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setIsDragOver(false);
    // 检查是否是从字段列表拖拽
    const jsonData = e.dataTransfer.getData('application/json');
    if (jsonData) {
      try {
        const data = JSON.parse(jsonData);
        if (data.role === 'dimension' && data.field) {
          // 检查是否已存在
          if (!dimensions.some((d) => d.field === data.field)) {
            addDimension(data.field);
          }
          return;
        }
        if (data.role === 'measure' && data.field) {
          // 拖拽指标到维度，保持原始字段名，不添加聚合方式
          if (!dimensions.some((d) => d.field === data.field)) {
            addDimension(data.field);
          }
          return;
        }
      } catch {
        // 忽略解析错误
      }
    }

    // 内部排序
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(dragIndex) || dragIndex === dropIndex) return;

    const draggedDimension = dimensions[dragIndex];
    if (draggedDimension) {
      builder.doc.transact(() => {
        builder.dimensions.remove(draggedDimension.field);
        const newDimensions = [...dimensions];
        newDimensions.splice(dragIndex, 1);
        newDimensions.splice(dropIndex, 0, draggedDimension);

        newDimensions.forEach((d) => {
          builder.dimensions.add(d.field, () => {});
        });
      });
    }
  };

  // 处理拖拽到空白区域
  const handleContainerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const jsonData = e.dataTransfer.getData('application/json');
    if (jsonData) {
      try {
        const data = JSON.parse(jsonData);
        if (data.role === 'dimension' && data.field) {
          // 检查是否已存在
          if (!dimensions.some((d) => d.field === data.field)) {
            addDimension(data.field);
          }
          return;
        }
        if (data.role === 'measure' && data.field) {
          // 拖拽指标到维度，保持原始字段名，不添加聚合方式
          if (!dimensions.some((d) => d.field === data.field)) {
            addDimension(data.field);
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
          key={`dimension-shelf-${dimension.field}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
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
          <DownOutlined style={{ fontSize: 8 }} />
          <span
            style={{
              maxWidth: 100,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {dimension.field}
          </span>
          <CloseOutlined
            onClick={(e) => {
              e.stopPropagation();
              removeDimension(dimension.field);
            }}
            style={{ fontSize: 10, cursor: 'pointer', color: '#8c8c8c' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ff4d4f')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8c8c')}
          />
        </div>
      ))}
    </Flex>
  );
};
