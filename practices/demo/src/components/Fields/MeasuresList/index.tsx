import { Card, Flex } from 'antd';
import { NumberOutlined } from '@ant-design/icons';
import { useVBIMeasures, useVBISchemaFields } from 'src/hooks';
import { useVBIStore } from 'src/model';
import {
  createFieldDragPayload,
  writeFieldDragPayload,
} from 'src/components/Shelfs/dragDropUtils';

export const MeasuresList = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { measures: shelfMeasures, addMeasure } = useVBIMeasures(builder);
  const { schemaFields } = useVBISchemaFields(builder);
  const measures = schemaFields.filter((d) => d.role === 'measure');

  // 处理拖拽开始
  const handleDragStart = (
    e: React.DragEvent,
    fieldName: string,
    fieldType: string,
  ) => {
    writeFieldDragPayload(
      e,
      createFieldDragPayload({
        field: fieldName,
        type: fieldType,
        role: 'measure',
      }),
    );
  };

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
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, item.name, item.type)}
              onClick={() => {
                // 检查是否已存在
                if (!shelfMeasures.some((m) => m.field === item.name)) {
                  addMeasure(item.name);
                }
              }}
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
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(82, 196, 26, 0.1)';
                e.currentTarget.style.color = '#52c41a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#333';
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
                {item.name}
              </span>
            </div>
          </div>
        ))}
      </Flex>
    </Card>
  );
};
