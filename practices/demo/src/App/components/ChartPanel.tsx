import { Card, Empty, Flex, Space, Typography } from 'antd';
import { VSeedRender } from 'src/components/Render';
import { useVBIStore } from 'src/model';

export const ChartPanel = () => {
  const vseed = useVBIStore((state) => state.vseed);
  const loading = useVBIStore((state) => state.loading);
  const builder = useVBIStore((state) => state.builder);
  const isEmptyDsl = builder.isEmpty();

  return (
    <Card
      loading={loading}
      style={{
        minWidth: 0,
      }}
      styles={{
        root: {
          height: '100%',
          minWidth: 0,
        },
        body: {
          padding: '12px',
          height: '100%',
          minWidth: 0,
        },
      }}
    >
      {isEmptyDsl ? (
        <Flex
          vertical
          align="center"
          justify="center"
          style={{
            height: '100%',
            minHeight: 300,
            padding: 24,
            borderRadius: 12,
            border: '1px dashed rgba(5, 5, 5, 0.15)',
            background:
              'linear-gradient(180deg, rgba(240, 245, 255, 0.45) 0%, rgba(255, 255, 255, 0.92) 100%)',
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space orientation="vertical" size={2}>
                <Typography.Text strong>暂时为空</Typography.Text>
                <Typography.Text type="secondary">
                  请先拖拽至少一个 Dimensions 或 Measures 字段到右侧分析区
                </Typography.Text>
              </Space>
            }
          />
        </Flex>
      ) : (
        vseed && <VSeedRender vseed={vseed} />
      )}
    </Card>
  );
};
