import { DownOutlined, HolderOutlined } from '@ant-design/icons';
import { Dropdown, Flex, Input, Modal, message, type MenuProps } from 'antd';
import { useVBIStore } from 'src/model';
import { useVBIMeasures } from 'src/hooks';
import { useEffect, useState } from 'react';
import {
  formatMeasureAggregate,
  getAggregateItemsByFieldRole,
  getDefaultAggregateByFieldRole,
  getMeasureFieldRoleBySchemaType,
  isAggregateSupportedByFieldRole,
  type MeasureAggregate,
} from './measureAggregateUtils';

type DragFieldData = {
  field?: string;
  type?: string;
  role?: 'dimension' | 'measure';
};

export const MeasureShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { measures, addMeasure, removeMeasure, updateMeasure } =
    useVBIMeasures(builder);
  const [isDragOver, setIsDragOver] = useState(false);
  const [schemaTypeMap, setSchemaTypeMap] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    let destroyed = false;
    const run = async () => {
      if (!builder) {
        return;
      }
      const schema = await builder.getSchema();
      if (destroyed) {
        return;
      }
      const typeMap = Object.fromEntries(
        schema.map((item) => [item.name, item.type]),
      );
      setSchemaTypeMap(typeMap);
    };
    run();
    return () => {
      destroyed = true;
    };
  }, [builder]);

  const getFieldRole = (fieldName: string, fieldType?: string) => {
    return getMeasureFieldRoleBySchemaType(
      fieldType ?? schemaTypeMap[fieldName],
    );
  };

  const parseDragFieldData = (
    e: React.DragEvent,
  ): DragFieldData | undefined => {
    const jsonData = e.dataTransfer.getData('application/json');
    if (!jsonData) {
      return undefined;
    }

    try {
      return JSON.parse(jsonData) as DragFieldData;
    } catch {
      return undefined;
    }
  };

  const addDraggedFieldToShelf = (dragField: DragFieldData | undefined) => {
    if (!dragField?.field) {
      return false;
    }

    const fieldName = dragField.field;
    if (measures.some((item) => item.field === fieldName)) {
      return true;
    }

    const fieldRole = getFieldRole(fieldName, dragField.type);
    const aggregate = getDefaultAggregateByFieldRole(fieldRole);
    addMeasure(fieldName, (node) => {
      node.setAggregate(aggregate);
    });
    return true;
  };

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
    if (addDraggedFieldToShelf(parseDragFieldData(e))) {
      return;
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
    addDraggedFieldToShelf(parseDragFieldData(e));
  };

  const renameMeasure = (id: string, alias: string) => {
    updateMeasure(id, (node) => {
      node.setAlias(alias);
    });
  };

  const changeAggregate = (id: string, aggregate: MeasureAggregate) => {
    updateMeasure(id, (node) => {
      node.setAggregate(aggregate);
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
    const fieldRole = getFieldRole(measure.field);
    const availableAggregates = getAggregateItemsByFieldRole(fieldRole);
    const currentAggregateKey = measure.aggregate?.func ?? 'sum';
    return [
      {
        key: 'aggregate',
        label: '修改聚合方式',
        children: availableAggregates.map((item) => ({
          key: `aggregate:${item.key}`,
          label: `${currentAggregateKey === item.key ? '✓ ' : ''}${item.label}`,
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
      const aggregateKey = key.replace('aggregate:', '');
      const fieldRole = getFieldRole(measure.field);
      const selectedAggregate = getAggregateItemsByFieldRole(fieldRole).find(
        (item) => item.key === aggregateKey,
      )?.aggregate;

      if (selectedAggregate) {
        if (!isAggregateSupportedByFieldRole(selectedAggregate, fieldRole)) {
          message.warning('该字段不支持此聚合方式');
          return;
        }
        changeAggregate(measure.id, selectedAggregate);
      }
    }
  };

  const getMeasureDisplayLabel = (measure: (typeof measures)[number]) => {
    const baseLabel = measure.alias || measure.field;
    const aggregate = formatMeasureAggregate(
      measure.aggregate as MeasureAggregate | undefined,
    );
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
