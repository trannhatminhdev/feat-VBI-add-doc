import { Flex } from 'antd';
import { DimensionsList } from 'src/components/Fields/DimensionsList';
import { MeasuresList } from 'src/components/Fields/MeasuresList';

export const FieldsPanel = () => {
  return (
    <Flex
      vertical
      gap={8}
      style={{
        flex: '0 0 220px',
        width: 220,
        minWidth: 220,
        maxWidth: 220,
      }}
    >
      <DimensionsList style={{ flex: 1, minHeight: 0 }} />
      <MeasuresList style={{ flex: 1, minHeight: 0 }} />
    </Flex>
  );
};
