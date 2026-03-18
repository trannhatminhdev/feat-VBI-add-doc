import { useDraggable } from '@dnd-kit/core';
import { Card, Flex } from 'antd';
import { memo } from 'react';
import { CalendarOutlined, FontSizeOutlined } from '@ant-design/icons';
import {
  createSchemaFieldDragId,
  type SchemaFieldDragData,
} from 'src/components/Shelfs/dnd';
import { getDefaultDimensionDateAggregate } from 'src/components/Shelfs/dimensionDateAggregateUtils';
import { useVBIDimensions, useVBISchemaFields } from 'src/hooks';
import { useVBIStore } from 'src/model';

const DimensionFieldItem = ({
  fieldName,
  fieldType,
  onClick,
}: {
  fieldName: string;
  fieldType: string;
  onClick: () => void;
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: createSchemaFieldDragId({
      field: fieldName,
      role: 'dimension',
    }),
    data: {
      kind: 'schema-field',
      payload: {
        field: fieldName,
        type: fieldType,
        role: 'dimension',
      },
      label: fieldName,
    } satisfies SchemaFieldDragData,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '4px 8px',
        cursor: 'grab',
        borderRadius: '4px',
        transition: 'all 0.2s',
        fontSize: 12,
        color: '#333',
        opacity: isDragging ? 0.5 : 1,
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.backgroundColor = 'rgba(24, 144, 255, 0.1)';
        event.currentTarget.style.color = '#1890ff';
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.backgroundColor = 'transparent';
        event.currentTarget.style.color = '#333';
      }}
    >
      <span
        style={{
          marginRight: 6,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {fieldType === 'date' ? (
          <CalendarOutlined style={{ color: '#1890ff', fontSize: 12 }} />
        ) : (
          <FontSizeOutlined style={{ color: '#1890ff', fontSize: 12 }} />
        )}
      </span>
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: 12,
        }}
      >
        {fieldName}
      </span>
    </div>
  );
};

export const DimensionsList = memo(
  ({ style }: { style?: React.CSSProperties }) => {
    const builder = useVBIStore((state) => state.builder);
    const { dimensions: shelfDimensions, addDimension } =
      useVBIDimensions(builder);
    const { schemaFields } = useVBISchemaFields(builder);
    const dimensions = schemaFields.filter((d) => d.role === 'dimension');

    return (
      <Card
        title={
          <span style={{ fontSize: 13, fontWeight: 500 }}>Dimensions</span>
        }
        size="small"
        style={{ ...style }}
        styles={{
          body: {
            padding: '4px 8px',
            flex: 1,
            overflowY: 'auto',
            minHeight: 0,
            height: 'calc(100% - 32px)',
          },
          header: {
            minHeight: 32,
            padding: '6px 12px',
            borderBottom: '1px solid #f0f0f0',
          },
        }}
      >
        <Flex vertical gap={0}>
          {dimensions.map((item) => (
            <div
              key={`dimension-field-${item.name}`}
              style={{ padding: 0, marginBottom: 0 }}
            >
              <DimensionFieldItem
                fieldName={item.name}
                fieldType={item.type}
                onClick={() => {
                  if (!shelfDimensions.some((d) => d.field === item.name)) {
                    addDimension(item.name, (node) => {
                      if (item.isDate) {
                        node.setAggregate(getDefaultDimensionDateAggregate());
                      }
                    });
                  }
                }}
              />
            </div>
          ))}
        </Flex>
      </Card>
    );
  },
);
