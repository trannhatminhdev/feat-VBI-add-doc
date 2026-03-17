import { DownOutlined, HolderOutlined } from '@ant-design/icons';
import { Dropdown, Flex, Input, Modal, message, type MenuProps } from 'antd';
import { useVBIStore } from 'src/model';
import { useVBIMeasures } from 'src/hooks';
import { useState } from 'react';

const AGGREGATE_ITEMS = [
  { key: 'sum', label: '求和 (sum)' },
  { key: 'count', label: '计数 (count)' },
  { key: 'avg', label: '平均值 (avg)' },
  { key: 'min', label: '最小值 (min)' },
  { key: 'max', label: '最大值 (max)' },
] as const;

export const MeasureShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { measures, addMeasure, removeMeasure, updateMeasure } =
    useVBIMeasures(builder);
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
      type YArrayLike = {
        get: (index: number) => unknown;
        delete: (index: number, length: number) => void;
        insert: (index: number, content: unknown[]) => void;
      };
      const yMeasures = builder.dsl.get('measures') as YArrayLike | undefined;
      if (!yMeasures) return;

      builder.doc.transact(() => {
        const draggedYMap = yMeasures.get(dragIndex);
        if (!draggedYMap) return;

        yMeasures.delete(dragIndex, 1);
        const insertIndex = dragIndex < dropIndex ? dropIndex - 1 : dropIndex;
        yMeasures.insert(insertIndex, [draggedYMap]);
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

  const renameMeasure = (id: string, alias: string) => {
    updateMeasure(id, (node) => {
      node.setAlias(alias);
    });
  };

  const changeAggregate = (
    id: string,
    aggregate: 'sum' | 'count' | 'avg' | 'min' | 'max',
  ) => {
    updateMeasure(id, (node) => {
      node.setAggregate({ func: aggregate });
    });
  };

  const openRenameModal = (id: string, currentAlias: string) => {
    let nextAlias = currentAlias;
    Modal.confirm({
      title: '重命名指标',
      okText: '保存',
      cancelText: '取消',
      content: (
        <Input
          autoFocus
          defaultValue={currentAlias}
          placeholder="请输入指标名称"
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
        renameMeasure(id, trimmed);
        return Promise.resolve();
      },
    });
  };

  const buildMeasureMenuItems = (
    measure: (typeof measures)[number],
  ): MenuProps['items'] => {
    const currentAggregate = measure.aggregate?.func ?? 'sum';
    return [
      {
        key: 'aggregate',
        label: '修改聚合方式',
        children: AGGREGATE_ITEMS.map((item) => ({
          key: `aggregate:${item.key}`,
          label: `${currentAggregate === item.key ? '✓ ' : ''}${item.label}`,
        })),
      },
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

  const onMeasureMenuClick = (
    measure: (typeof measures)[number],
    key: string,
  ) => {
    if (key === 'rename') {
      openRenameModal(measure.id, measure.alias || measure.field);
      return;
    }

    if (key === 'delete') {
      removeMeasure(measure.id);
      return;
    }

    if (key.startsWith('aggregate:')) {
      const aggregate = key.replace('aggregate:', '');
      if (
        aggregate === 'sum' ||
        aggregate === 'count' ||
        aggregate === 'avg' ||
        aggregate === 'min' ||
        aggregate === 'max'
      ) {
        changeAggregate(measure.id, aggregate);
      }
    }
  };

  const getMeasureDisplayLabel = (measure: (typeof measures)[number]) => {
    const baseLabel = measure.alias || measure.field;
    const aggregate = measure.aggregate?.func;
    if (!aggregate) {
      return baseLabel;
    }
    return `${aggregate}(${baseLabel})`;
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
          key={`measure-shelf-${measure.id}`}
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
              items: buildMeasureMenuItems(measure),
              onClick: ({ key, domEvent }) => {
                domEvent.stopPropagation();
                onMeasureMenuClick(measure, key);
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
                  maxWidth: 120,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getMeasureDisplayLabel(measure)}
              </span>
              <DownOutlined style={{ fontSize: 9, color: '#8c8c8c' }} />
            </span>
          </Dropdown>
        </div>
      ))}
    </Flex>
  );
};
