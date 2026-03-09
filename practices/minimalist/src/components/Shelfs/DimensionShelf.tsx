import { DeleteOutlined } from '@ant-design/icons';
import { ObserveCallback, VBIDimension } from '@visactor/vbi';
import { Button, Flex, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useVBIStore } from 'src/model';

export const DimensionShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);

  const [dimensions, setDimensions] = useState<VBIDimension[]>(
    builder.dimensions.findAllDimensions(),
  );

  useEffect(() => {
    const updateDimensions: ObserveCallback = () => {
      setDimensions(builder.dimensions.findAllDimensions());
    };
    builder.dimensions.observe(updateDimensions);
    return () => builder.dimensions.unobserve(updateDimensions);
  }, [builder]);

  const deleteDimension = (field: VBIDimension['field']) => {
    builder.dimensions.removeDimension(field);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'dimension') {
        builder.doc.transact(() => {
          builder.dimensions.addDimension(data.name, (node) => {
            node.setAlias(data.alias || data.name);
          });
        });
      }
    } catch (err) {
      console.error('Drop error', err);
    }
  };

  return (
    <Flex
      vertical={true}
      gap={8}
      style={{
        minHeight: '60px',
        padding: '8px',
        border: '1px dashed #d9d9d9',
        borderRadius: '8px',
        ...style,
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {dimensions.length === 0 && (
        <div style={{ color: '#bfbfbf', textAlign: 'center' }}>
          Drop Dimensions Here
        </div>
      )}
      {dimensions.map((dimension) => (
        <Space.Compact
          key={`dimension-shelf-${dimension.field}`}
          style={{ width: '100%' }}
        >
          <Button
            shape="round"
            style={{
              color: '#1890ff',
              flexGrow: 1,
              textAlign: 'left',
              borderRight: 0,
            }}
          >
            {dimension.alias}
          </Button>
          <Button
            shape="round"
            icon={<DeleteOutlined />}
            onClick={() => deleteDimension(dimension.field)}
          />
        </Space.Compact>
      ))}
    </Flex>
  );
};
