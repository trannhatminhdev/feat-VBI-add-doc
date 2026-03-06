import { Button, Space } from 'antd';
import { memo, useEffect, useState } from 'react';
import {
  PlusOutlined,
  DragOutlined,
  DownOutlined,
  UpOutlined,
  SettingOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useVBIStore } from 'src/model';

type FieldItem = { name: string; type: string };

export const MeasuresList = memo(
  ({ style }: { style?: React.CSSProperties }) => {
    const builder = useVBIStore((state) => state.builder);
    const [standalone, setStandalone] = useState<FieldItem[]>([]);

    // 悬浮展开状态
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
      const run = async () => {
        const schema = await builder.getSchema();
        const measures = schema.filter((d) => d.type === 'number');
        setStandalone(measures);
      };
      run();
    }, [builder]);

    const handleDragStart = (e: React.DragEvent, fieldName: string) => {
      e.dataTransfer.setData(
        'application/json',
        JSON.stringify({ name: fieldName, type: 'measure' }),
      );
    };

    return (
      <div
        style={{
          height: 44,
          position: 'relative',
          width: '100%',
          zIndex: expanded ? 90 : 5,
          ...style,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #e8e8e8',
            boxShadow: expanded ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
            height: expanded ? 'auto' : 44,
            overflow: expanded ? 'visible' : 'hidden',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}
          >
            <div
              style={{
                fontWeight: 600,
                color: '#555',
                marginTop: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              Measures
            </div>

            <Button
              size="small"
              shape="circle"
              type="text"
              icon={
                <PlusOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
              }
              onClick={() => console.log('Trigger custom measure logic')}
              style={{ marginTop: '2px', backgroundColor: '#f6ffed' }}
            />
            <Button
              size="small"
              shape="circle"
              type="text"
              icon={
                <SettingOutlined
                  style={{ color: '#52c41a', fontSize: '12px' }}
                />
              }
              //onClick={() => handleAddCustomDimension(builder, 'Custom')}
              style={{ marginTop: '2px', backgroundColor: '#f6ffed' }}
            />
            <Button
              size="small"
              shape="circle"
              type="text"
              icon={
                <DeleteOutlined
                  style={{ color: '#52c41a', fontSize: '12px' }}
                />
              }
              //onClick={() => handleAddCustomDimension(builder, 'Custom')}
              style={{ marginTop: '2px', backgroundColor: '#f6ffed' }}
            />

            <div
              style={{
                width: '1px',
                backgroundColor: '#e8e8e8',
                height: '24px',
                margin: '2px 4px 0 4px',
              }}
            />

            <div style={{ flexGrow: 1, minHeight: '28px' }}>
              <Space wrap size={[8, 8]} style={{ width: '100%' }}>
                {standalone.map((item) => (
                  <div
                    key={item.name}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.name)}
                    style={{ cursor: 'grab' }}
                  >
                    <Button
                      size="small"
                      shape="round"
                      icon={<DragOutlined style={{ color: '#bfbfbf' }} />}
                      style={{
                        fontSize: '13px',
                        height: '28px',
                        padding: '0 12px',
                      }}
                    >
                      {item.name}
                    </Button>
                  </div>
                ))}
              </Space>
            </div>

            <Button
              size="small"
              type="text"
              icon={expanded ? <UpOutlined /> : <DownOutlined />}
              onClick={() => setExpanded(!expanded)}
              style={{ marginTop: '2px', color: '#888' }}
            />
          </div>
        </div>
      </div>
    );
  },
);
