import { Flex, theme } from 'antd';

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
  const { token } = theme.useToken();

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        minHeight: 34,
        minWidth: 0,
        width: '100%',
        borderBottom: borderBottom
          ? `1px solid ${token.colorBorderSecondary}`
          : 'none',
      }}
    >
      <Flex
        align="center"
        justify={operator ? 'space-between' : 'flex-start'}
        style={{
          width: 88,
          minWidth: 88,
          paddingLeft: 10,
          boxSizing: 'border-box',
          gap: 6,
        }}
      >
        <div
          style={{
            flex: 1,
            fontWeight: 500,
            fontSize: 11,
            color: token.colorTextSecondary,
            letterSpacing: 0.2,
          }}
        >
          {label}
        </div>
        {operator}
      </Flex>
      <Flex
        style={{
          paddingLeft: 10,
          paddingRight: 8,
          flex: '1 1 0',
          minWidth: 0,
        }}
      >
        {shelf}
      </Flex>
    </Flex>
  );
};
