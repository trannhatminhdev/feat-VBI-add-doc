import { Flex } from 'antd';

const LABEL_CONTAINER_STYLE: React.CSSProperties = {
  width: 90,
  minWidth: 90,
  paddingLeft: 12,
  boxSizing: 'border-box',
};

const LABEL_TEXT_STYLE: React.CSSProperties = {
  flex: 1,
  fontWeight: 500,
  fontSize: 12,
};

export const ShelfRow = ({
  label,
  shelf,
  borderBottom = true,
  operator,
}: {
  label: string;
  shelf: React.ReactNode;
  borderBottom?: boolean;
  operator?: React.ReactNode;
}) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        minHeight: 38,
        minWidth: 0,
        width: '100%',
        borderBottom: borderBottom ? '1px solid #f0f0f0' : 'none',
      }}
    >
      <Flex
        align="center"
        justify={operator ? 'space-between' : 'flex-start'}
        style={LABEL_CONTAINER_STYLE}
      >
        <div style={LABEL_TEXT_STYLE}>{label}</div>
        {operator}
      </Flex>
      <Flex
        style={{
          paddingLeft: 12,
          flex: '1 1 0',
          minWidth: 0,
        }}
      >
        {shelf}
      </Flex>
    </Flex>
  );
};
