import { Empty, Flex, Space, Spin, Typography, theme } from 'antd';
import { VSeedRender } from 'src/components/Render';
import { useVBIBuilder } from 'src/hooks';
import { useTranslation } from 'src/i18n';
import { useVBIStore } from 'src/model';

export const ViewPanel = () => {
  const vseed = useVBIStore((state) => state.vseed);
  const loading = useVBIStore((state) => state.loading);
  const builder = useVBIStore((state) => state.builder);
  const isEmptyDsl = builder.isEmpty();
  const { token } = theme.useToken();
  const { theme: themeMode } = useVBIBuilder(builder);
  const { t } = useTranslation();

  return (
    <div className="demo-app-view-shell">
      <Spin spinning={loading} wrapperClassName="demo-app-view-spinner">
        <div
          className="demo-app-view-frame"
          style={{
            borderRadius: token.borderRadiusOuter,
            border: `1px solid ${token.colorBorderSecondary}`,
            background:
              themeMode === 'dark'
                ? 'linear-gradient(180deg, rgba(11, 18, 32, 0.92) 0%, rgba(17, 24, 38, 0.98) 100%)'
                : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 247, 252, 0.96) 100%)',
          }}
        >
          {isEmptyDsl ? (
            <Flex
              vertical
              align="center"
              justify="center"
              className="demo-app-view-empty"
              style={{
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
                    <Typography.Text strong>
                      {t('appEmptyTitle')}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      {t('appEmptyDescription')}
                    </Typography.Text>
                  </Space>
                }
              />
            </Flex>
          ) : vseed ? (
            <div className="demo-app-view-renderer">
              <VSeedRender vseed={vseed} />
            </div>
          ) : null}
        </div>
      </Spin>
    </div>
  );
};
