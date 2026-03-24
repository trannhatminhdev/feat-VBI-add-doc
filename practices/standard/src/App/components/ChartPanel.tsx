import { Card, Empty, Flex, Space, Typography, theme } from 'antd';
import { VSeedRender } from 'src/components/Render';
import { useVBIBuilder } from 'src/hooks';
import { useTranslation } from 'src/i18n';
import { useVBIStore } from 'src/model';

export const ChartPanel = () => {
  const vseed = useVBIStore((state) => state.vseed);
  const loading = useVBIStore((state) => state.loading);
  const builder = useVBIStore((state) => state.builder);
  const isEmptyDsl = builder.isEmpty();
  const { token } = theme.useToken();
  const { theme: themeMode } = useVBIBuilder(builder);
  const { t } = useTranslation();

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
            borderRadius: token.borderRadiusLG,
            border: `1px dashed ${token.colorBorder}`,
            background:
              themeMode === 'light'
                ? 'linear-gradient(180deg, rgba(240, 245, 255, 0.45) 0%, rgba(255, 255, 255, 0.92) 100%)'
                : 'linear-gradient(180deg, rgba(37, 54, 82, 0.55) 0%, rgba(22, 28, 40, 0.92) 100%)',
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Space orientation="vertical" size={2}>
                <Typography.Text strong>{t('appEmptyTitle')}</Typography.Text>
                <Typography.Text type="secondary">
                  {t('appEmptyDescription')}
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
