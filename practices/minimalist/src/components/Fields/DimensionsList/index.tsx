import { Dropdown, Button, Space } from 'antd';
import { memo, useEffect, useState } from 'react';
import {
  PlusOutlined,
  DragOutlined,
  DownOutlined,
  UpOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useVBIStore } from 'src/model';

import { FieldItem, DragData } from './types';
import { classifyDimensions } from './dimensionLogic';
import { useDimensionActions } from './useDimensionActions';

export const DimensionsList = memo(
  ({ style }: { style?: React.CSSProperties }) => {
    const builder = useVBIStore((state) => state.builder);
    const {
      groups,
      setGroups,
      standalone,
      setStandalone,
      updateDimensionAlias,
      handleDropOnBar,
    } = useDimensionActions();
    const [expanded, setExpanded] = useState(false);
    const [modification, modify] = useState(0);

    useEffect(() => {
      const run = async () => {
        const schema = await builder.getSchema();
        const dimensions = schema.filter((d) => d.type !== 'number');
        const { groups: g, standalone: s } = classifyDimensions(dimensions);
        setGroups(g);
        setStandalone(s);
      };
      run();
    }, [builder, setGroups, setStandalone]);

    const handleDragStart = (
      e: React.DragEvent,
      source: 'group' | 'standalone',
      name: string,
      groupName?: string,
      alias?: string,
    ) => {
      const data: DragData = {
        name,
        type: 'dimension',
        source,
        groupName,
        alias,
      };
      e.dataTransfer.setData('application/json', JSON.stringify(data));
    };

    const renderDropdownMenu = (category: string, items: FieldItem[]) => ({
      items: items.map((item) => ({
        key: item.name,
        label: (
          <div
            draggable
            onDragStart={(e) =>
              handleDragStart(e, 'group', item.name, category, item.alias)
            }
            style={{
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <DragOutlined style={{ color: '#bfbfbf' }} />{' '}
            {item.alias || item.name}
          </div>
        ),
      })),
    });

    return (
      <div
        style={{
          height: 44,
          position: 'relative',
          width: '100%',
          zIndex: expanded ? 100 : 10,
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
              Dimensions
            </div>

            <Button
              size="small"
              shape="circle"
              type="text"
              icon={
                <PlusOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
              }
              style={{ marginTop: '2px', backgroundColor: '#e6f4ff' }}
            />

            <Button
              size="small"
              shape="circle"
              type="text"
              icon={
                <SettingOutlined
                  style={{ color: '#1890ff', fontSize: '12px' }}
                />
              }
              onClick={() => {
                modify(1);
              }}
              style={{ marginTop: '2px', backgroundColor: '#e6f4ff' }}
            />

            <div
              style={{
                width: '1px',
                height: '16px',
                backgroundColor: '#e8e8e8',
                marginTop: '8px',
                marginLeft: '4px',
                marginRight: '4px',
              }}
            />

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnBar(e, groups, standalone)}
              style={{ flexGrow: 1, minHeight: '28px' }}
            >
              <Space wrap size={[8, 8]} style={{ width: '100%' }}>
                {Object.entries(groups).map(([category, items]) => (
                  <Dropdown
                    key={category}
                    menu={renderDropdownMenu(category, items)}
                    trigger={['click']}
                  >
                    <Button
                      size="small"
                      shape="round"
                      style={{
                        fontSize: '13px',
                        height: '28px',
                        padding: '0 12px',
                      }}
                    >
                      {category} <DownOutlined style={{ fontSize: '10px' }} />
                    </Button>
                  </Dropdown>
                ))}

                {standalone.map((item) => (
                  <div
                    key={item.name}
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, 'standalone', item.name, item.alias)
                    }
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
                      {item.alias || item.name}
                      {modification === 1 && (
                        <SettingOutlined
                          style={{
                            color: '#1890ff',
                            cursor: 'pointer',
                            marginLeft: 4,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const newAlias = prompt(
                              '请输入新的别名',
                              item.alias,
                            );
                            if (newAlias) {
                              updateDimensionAlias(
                                item.name,
                                newAlias,
                                builder,
                              );
                            }
                            modify(0);
                          }}
                        />
                      )}
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
