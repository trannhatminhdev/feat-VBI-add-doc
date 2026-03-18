import { useDraggable } from '@dnd-kit/core';
import { Card, Flex } from 'antd';
import { NumberOutlined } from '@ant-design/icons';
import {
  createSchemaFieldDragId,
  type SchemaFieldDragData,
} from 'src/components/Shelfs/dnd';
import { useVBIMeasures, useVBISchemaFields } from 'src/hooks';
import { useVBIStore } from 'src/model';

const MeasureFieldItem = ({
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
      role: 'measure',
    }),
    data: {
      kind: 'schema-field',
      payload: {
        field: fieldName,
        type: fieldType,
        role: 'measure',
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
        event.currentTarget.style.backgroundColor = 'rgba(82, 196, 26, 0.1)';
        event.currentTarget.style.color = '#52c41a';
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
        <NumberOutlined style={{ color: '#52c41a', fontSize: 12 }} />
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

export const MeasuresList = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { measures: shelfMeasures, addMeasure } = useVBIMeasures(builder);
  const { schemaFields } = useVBISchemaFields(builder);
  const measures = schemaFields.filter((d) => d.role === 'measure');

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 500 }}>Measures</span>}
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
        {measures.map((item) => (
          <div
            key={`measure-field-${item.name}`}
            style={{ padding: 0, marginBottom: 0 }}
          >
            <MeasureFieldItem
              fieldName={item.name}
              fieldType={item.type}
              onClick={() => {
                if (!shelfMeasures.some((m) => m.field === item.name)) {
                  addMeasure(item.name);
                }
              }}
            />
          </div>
        ))}
      </Flex>
    </Card>
  );
};
