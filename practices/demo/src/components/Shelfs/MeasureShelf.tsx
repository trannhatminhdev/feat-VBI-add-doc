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
import { useVBIMeasures, useVBISchemaFields } from 'src/hooks';
import { useMemo, useState } from 'react';
import {
  formatMeasureAggregate,
  getAggregateItemsByFieldRole,
  getDefaultAggregateByFieldRole,
  getMeasureFieldRoleBySchemaType,
  isAggregateSupportedByFieldRole,
  type MeasureAggregate,
} from './measureAggregateUtils';
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

const QUANTILE_PERCENT_OPTIONS = [1, 5, 25, 50, 75, 90, 95, 99] as const;
const MENU_ITEM_STYLE: React.CSSProperties = {
  height: 30,
  lineHeight: '30px',
};

export const MeasureShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { measures, addMeasure, removeMeasure, updateMeasure } =
    useVBIMeasures(builder);
  const { schemaFields } = useVBISchemaFields(builder);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const schemaTypeMap = useMemo(() => {
    return Object.fromEntries(
      schemaFields.map((item) => [item.name, item.type]),
    );
  }, [schemaFields]);

  const getFieldRole = (fieldName: string, fieldType?: string) => {
    return getMeasureFieldRoleBySchemaType(
      fieldType ?? schemaTypeMap[fieldName],
    );
  };

  const addDraggedFieldToShelf = (
    dragField: ReturnType<typeof readFieldDragPayload>,
  ) => {
    if (!dragField || !dragField.field) {
      return false;
    }

    const fieldName = dragField.field;
    const nextName = getNextFieldDuplicateName({
      field: fieldName,
      items: measures,
    });
    const fieldRole = getFieldRole(fieldName, dragField.type);
    const aggregate = getDefaultAggregateByFieldRole(fieldRole);
    addMeasure(fieldName, (node) => {
      node.setAggregate(aggregate);
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

    // 内部排序
    const dragIndex = readShelfDragIndex(e);
    if (dragIndex === undefined || dragIndex === dropIndex) {
      return;
    }

    const draggedMeasure = measures[dragIndex];
    if (draggedMeasure) {
      const yMeasures = builder.dsl.get('measures') as YArrayLike | undefined;
      if (!yMeasures) {
        return;
      }

      builder.doc.transact(() => {
        reorderYArray({ yArray: yMeasures, dragIndex, dropIndex });
      });
    }
  };

  // 处理拖拽到空白区域
  const handleContainerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    addDraggedFieldToShelf(readFieldDragPayload(e));
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
        if (
          hasDuplicateShelfName({
            name: trimmed,
            items: measures,
            excludeId: id,
          })
        ) {
          message.error('名称已存在');
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
    const currentQuantilePercent =
      measure.aggregate?.func === 'quantile'
        ? Math.round((measure.aggregate.quantile ?? 0.5) * 100)
        : undefined;
    const currentAggregateKey = measure.aggregate?.func ?? 'sum';

    const aggregateMenuItems: NonNullable<MenuProps['items']> =
      availableAggregates.map((item) => {
        if (item.key !== 'quantile') {
          const shortLabel = item.label.split(' ')[0] ?? item.label;
          return {
            key: `aggregate:${item.key}`,
            label: `${currentAggregateKey === item.key ? '✓ ' : ''}${shortLabel}`,
            style: MENU_ITEM_STYLE,
          };
        }

        return {
          key: 'aggregate:quantile',
          label: `${currentAggregateKey === 'quantile' ? '✓ ' : ''}分位数`,
          style: MENU_ITEM_STYLE,
          children: QUANTILE_PERCENT_OPTIONS.map((percent) => ({
            key: `aggregate:quantile:${percent}`,
            label: `${currentQuantilePercent === percent ? '✓ ' : ''}P${percent}`,
            style: MENU_ITEM_STYLE,
          })),
        };
      });

    return [
      {
        key: 'aggregate',
        label: '聚合',
        style: MENU_ITEM_STYLE,
        children: aggregateMenuItems,
      },
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

      if (aggregateKey === 'quantile') {
        changeAggregate(measure.id, { func: 'quantile', quantile: 0.5 });
        return;
      }

      if (aggregateKey.startsWith('quantile:')) {
        const percentValue = Number(aggregateKey.replace('quantile:', ''));
        if (!Number.isFinite(percentValue)) {
          return;
        }
        const quantileValue = Math.max(0, Math.min(100, percentValue)) / 100;
        changeAggregate(measure.id, {
          func: 'quantile',
          quantile: quantileValue,
        });
        return;
      }

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
        backgroundColor: isDragOver ? 'rgba(82, 196, 26, 0.1)' : 'transparent',
        boxShadow: isDragOver
          ? 'inset 0 0 0 1px rgba(82, 196, 26, 0.4)'
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
      {measures.length === 0 && (
        <span
          style={{
            color: '#bbb',
            fontSize: 12,
            padding: '2px 8px',
            flexShrink: 0,
          }}
        >
          拖拽度量/维度到此处
        </span>
      )}
      {measures.map((measure, index) => {
        const displayLabel = getMeasureDisplayLabel(measure);
        const isHovered = hoveredItemId === measure.id;

        return (
          <div
            key={`measure-shelf-${measure.id}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onMouseEnter={() => setHoveredItemId(measure.id)}
            onMouseLeave={() => setHoveredItemId(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '0 6px',
              backgroundColor: isHovered ? '#e9f9df' : '#f3fff0',
              border: isHovered ? '1px solid #95de64' : '1px solid #c8efbb',
              borderRadius: 6,
              cursor: 'grab',
              fontSize: 10,
              color: '#389e0d',
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
                items: buildMeasureMenuItems(measure),
                onClick: ({ key, domEvent }) => {
                  domEvent.stopPropagation();
                  onMeasureMenuClick(measure, key);
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
                      ? 'rgba(82, 196, 26, 0.28)'
                      : 'rgba(82, 196, 26, 0.18)',
                    color: '#389e0d',
                    flexShrink: 0,
                  }}
                >
                  <DownOutlined style={{ fontSize: 8 }} />
                </span>
                <Typography.Text
                  ellipsis={{ tooltip: displayLabel }}
                  style={{
                    maxWidth: 112,
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
                removeMeasure(measure.id);
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
