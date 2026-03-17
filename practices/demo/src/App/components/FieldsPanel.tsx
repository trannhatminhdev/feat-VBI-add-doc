import { Flex } from 'antd';
import { DimensionsList } from 'src/components/Fields/DimensionsList';
import { MeasuresList } from 'src/components/Fields/MeasuresList';

export const FieldsPanel = () => {
  return (
    <Flex vertical gap={8} style={{ flexBasis: 220 }}>
      <DimensionsList style={{ flex: 1, minHeight: 0 }} />
      <MeasuresList style={{ flex: 1, minHeight: 0 }} />
    </Flex>
  );
};
