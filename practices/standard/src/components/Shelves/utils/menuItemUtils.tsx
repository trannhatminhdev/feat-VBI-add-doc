import { Flex, Typography } from 'antd';

export const SHELF_MENU_SUBMENU_OFFSET: [number, number] = [-10, -4];

export const buildShelfMenuLabel = (label: string, extra?: string) => {
  if (!extra) {
    return label;
  }

  return (
    <Flex
      align="center"
      justify="space-between"
      gap={12}
      style={{ width: '100%' }}
    >
      <span>{label}</span>
      <Typography.Text style={{ fontSize: 10 }} type="secondary">
        {extra}
      </Typography.Text>
    </Flex>
  );
};
