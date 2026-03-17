import { Card, Flex } from 'antd';
import { memo } from 'react';
import { CalendarOutlined, FontSizeOutlined } from '@ant-design/icons';
import { useVBIDimensions, useVBISchemaFields } from 'src/hooks';
import { useVBIStore } from 'src/model';
import {
  createFieldDragPayload,
  writeFieldDragPayload,
} from 'src/components/Shelfs/dragDropUtils';

export const DimensionsList = memo(
  ({ style }: { style?: React.CSSProperties }) => {
    const builder = useVBIStore((state) => state.builder);
    const { dimensions: shelfDimensions, addDimension } =
      useVBIDimensions(builder);
    const { schemaFields } = useVBISchemaFields(builder);
    const dimensions = schemaFields.filter((d) => d.role === 'dimension');

    const getIcon = (type: string) => {
      if (type === 'date') {
        return <CalendarOutlined style={{ color: '#1890ff', fontSize: 12 }} />;
      }
      return <FontSizeOutlined style={{ color: '#1890ff', fontSize: 12 }} />;
    };

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
          role: 'dimension',
        }),
      );
    };

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
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, item.name, item.type)}
                onClick={() => {
                  // 检查是否已存在
                  if (!shelfDimensions.some((d) => d.field === item.name)) {
                    addDimension(item.name);
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
                    'rgba(24, 144, 255, 0.1)';
                  e.currentTarget.style.color = '#1890ff';
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
                  {getIcon(item.type)}
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
  },
);
