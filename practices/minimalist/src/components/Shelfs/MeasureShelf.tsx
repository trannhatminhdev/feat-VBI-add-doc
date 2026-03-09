import { DeleteOutlined } from '@ant-design/icons';
import { ObserveCallback, VBIMeasure } from '@visactor/vbi';
import { Button, Flex, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useVBIStore } from 'src/model';

export const MeasureShelf = ({ style }: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const [measures, setMeasures] = useState<VBIMeasure[]>(
    builder.measures.toJson(),
  );

  useEffect(() => {
    const updateMeasures: ObserveCallback = () => {
      setMeasures(builder.measures.toJson());
    };
    const unobserve = builder.measures.observe(updateMeasures);
    return unobserve;
  }, [builder]);

  const deleteMeasure = (field: VBIMeasure['field']) => {
    builder.measures.remove(field);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'measure') {
        builder.doc.transact(() => {
          builder.measures.add(data.name, (node) => {
            node.setAlias(data.name);
            node.setAggregate({ func: 'sum' });
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
      {measures.length === 0 && (
        <div style={{ color: '#bfbfbf', textAlign: 'center' }}>
          Drop Measures Here
        </div>
      )}
      {measures.map((measure) => (
        <Space.Compact
          key={`measure-shelf-${measure.field}`}
          style={{ width: '100%' }}
        >
          <Button
            shape="round"
            style={{
              color: '#52c41a',
              flexGrow: 1,
              textAlign: 'left',
              borderRight: 0,
            }}
          >
            {measure.field}
          </Button>
          <Button
            shape="round"
            icon={<DeleteOutlined />}
            onClick={() => deleteMeasure(measure.field)}
          />
        </Space.Compact>
      ))}
    </Flex>
  );
};
