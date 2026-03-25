import { Flex } from 'antd';
import { FieldList } from 'src/components/Fields/FieldList';

export const FieldsPanel = () => {
  return (
    <Flex
      vertical
      style={{
        flex: '0 0 236px',
        width: 236,
        minWidth: 236,
        maxWidth: 236,
      }}
    >
      <FieldList style={{ flex: 1, minHeight: 0 }} />
    </Flex>
  );
};
