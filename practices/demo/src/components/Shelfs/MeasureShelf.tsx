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
    const updateMeasures: ObserveCallback = (event, transaction) => {
      console.info('[observe] measures', event, transaction);
      setMeasures(builder.measures.toJson());
    };

    const unobserve = builder.measures.observe(updateMeasures);
    return unobserve;
  }, [builder]);

  const deleteMeasure = (field: VBIMeasure['field']) => {
    builder.measures.remove(field);
  };

  return (
    <Flex vertical={false} gap={5} style={{ flexBasis: 300, ...style }}>
      {measures.map((measure) => (
        <Space.Compact key={`measure-shelf-${measure.field}`}>
          <Button style={{ color: 'green' }}>{measure.field}</Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => deleteMeasure(measure.field)}
          />
        </Space.Compact>
      ))}
    </Flex>
  );
};
