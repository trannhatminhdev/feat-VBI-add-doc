import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import { useVBIStore } from 'src/model';
import { useVBIMeasures } from 'src/hooks';
import { useState } from 'react';

export const MeasureShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { measures, addMeasure, removeMeasure } = useVBIMeasures(builder);
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
        if (data.role === 'measure' && data.field) {
          // 从字段列表拖拽添加指标，检查是否已存在
          if (!measures.some((m) => m.field === data.field)) {
            addMeasure(data.field);
          }
          return;
        }
        if (data.role === 'dimension' && data.field) {
          // 拖拽维度到指标，维度需要聚合才能作为度量，默认使用 count
          const measureField = `count(${data.field})`;
          if (!measures.some((m) => m.field === measureField)) {
            addMeasure(measureField);
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

    // 通过删除并重新添加来实现排序
    const draggedMeasure = measures[dragIndex];
    if (draggedMeasure) {
      builder.doc.transact(() => {
        builder.measures.remove(draggedMeasure.field);
        // 将元素插入到新位置
        const newMeasures = [...measures];
        newMeasures.splice(dragIndex, 1);
        newMeasures.splice(dropIndex, 0, draggedMeasure);

        newMeasures.forEach((m) => {
          builder.measures.add(m.field, () => {});
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
        if (data.role === 'measure' && data.field) {
          // 检查是否已存在
          if (!measures.some((m) => m.field === data.field)) {
            addMeasure(data.field);
          }
          return;
        }
        if (data.role === 'dimension' && data.field) {
          // 拖拽维度到指标，维度需要聚合才能作为度量，默认使用 count
          const measureField = `count(${data.field})`;
          if (!measures.some((m) => m.field === measureField)) {
            addMeasure(measureField);
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
        border: isDragOver ? '2px dashed #52c41a' : '1px solid #e8e8e8',
        borderRadius: 6,
        padding: '2px 8px',
        backgroundColor: '#fafafa',
        transition: 'all 0.2s',
        alignItems: 'center',
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {measures.length === 0 && (
        <span style={{ color: '#bbb', fontSize: 12, padding: '2px 8px' }}>
          拖拽度量/维度到此处
        </span>
      )}
      {measures.map((measure, index) => (
        <div
          key={`measure-shelf-${measure.field}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 6px',
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: 4,
            cursor: 'grab',
            fontSize: 11,
            color: '#52c41a',
            height: 24,
          }}
        >
          <DownOutlined style={{ fontSize: 8 }} />
          <span
            style={{
              maxWidth: 90,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {measure.field}
          </span>
          <CloseOutlined
            onClick={(e) => {
              e.stopPropagation();
              removeMeasure(measure.field);
            }}
            style={{ fontSize: 9, cursor: 'pointer', color: '#8c8c8c' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ff4d4f')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8c8c')}
          />
        </div>
      ))}
    </Flex>
  );
};
