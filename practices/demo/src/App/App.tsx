import { Card, ConfigProvider, Flex, Spin, theme as antdTheme } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { VBIBuilder } from '@visactor/vbi';
import { useEffect, useMemo } from 'react';
import { ShelfDndProvider } from 'src/components/Shelfs/dnd';
import { Toolbar } from 'src/components/Toolbar';
import { useVBIBuilder } from 'src/hooks';
import type { DemoTheme } from 'src/constants/builder';
import { useTranslation } from 'src/i18n';
import { useVBIStore } from 'src/model';
import { useShallow } from 'zustand/shallow';
import { ChartPanel, FieldsPanel, ShelfPanel } from './components';

interface APPProps {
  builder?: VBIBuilder;
}

const DEMO_ANTD_LOCALES = {
  'zh-CN': zhCN,
  'en-US': enUS,
} as const;

const createThemeConfig = (themeMode: DemoTheme) => {
  return {
    algorithm:
      themeMode === 'dark'
        ? antdTheme.darkAlgorithm
        : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: themeMode === 'dark' ? '#6ea8ff' : '#1677ff',
      borderRadius: 14,
      controlHeight: 38,
      fontSize: 13,
    },
  };
};

const DemoWorkbench = ({ themeMode }: { themeMode: DemoTheme }) => {
  const { token } = antdTheme.useToken();

  return (
    <ShelfDndProvider>
      <Flex
        vertical
        style={{
          height: '100%',
          gap: 10,
          padding: 10,
          background:
            themeMode === 'dark'
              ? 'radial-gradient(circle at top left, rgba(110, 168, 255, 0.16), transparent 34%), linear-gradient(180deg, #0f1522 0%, #151b28 100%)'
              : 'radial-gradient(circle at top left, rgba(22, 119, 255, 0.12), transparent 34%), linear-gradient(180deg, #f4f8ff 0%, #eef4fb 100%)',
        }}
      >
        <Card
          size="small"
          style={{
            borderRadius: token.borderRadiusLG + 6,
            overflow: 'hidden',
            borderColor: token.colorBorder,
            background:
              themeMode === 'dark'
                ? 'rgba(20, 28, 42, 0.82)'
                : 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(14px)',
          }}
          styles={{
            body: {
              padding: 0,
            },
          }}
        >
          <Toolbar />
        </Card>

        <Flex
          vertical={false}
          gap={8}
          style={{ flex: 1, minHeight: 0, minWidth: 0 }}
        >
          <FieldsPanel />

          <Flex vertical gap={8} style={{ flex: '1 1 0', minWidth: 0 }}>
            <ShelfPanel />
            <ChartPanel />
          </Flex>
        </Flex>
      </Flex>
    </ShelfDndProvider>
  );
};

const AppContent = ({
  initialized,
  themeMode,
}: {
  initialized: boolean;
  themeMode: DemoTheme;
}) => {
  const { locale, t } = useTranslation();
  const antdLocale = DEMO_ANTD_LOCALES[locale];
  const antdThemeConfig = useMemo(
    () => createThemeConfig(themeMode),
    [themeMode],
  );

  return (
    <ConfigProvider locale={antdLocale} theme={antdThemeConfig}>
      {!initialized ? (
        <Spin tip={t('appInitializing')} fullscreen />
      ) : (
        <DemoWorkbench themeMode={themeMode} />
      )}
    </ConfigProvider>
  );
};

export const APP = ({ builder }: APPProps) => {
  const { initialize, initialized, storeBuilder } = useVBIStore(
    useShallow((state) => ({
      initialize: state.initialize,
      initialized: state.initialized,
      storeBuilder: state.builder,
    })),
  );
  const { theme } = useVBIBuilder(storeBuilder);

  useEffect(() => {
    return initialize(builder);
  }, [builder, initialize]);

  return <AppContent initialized={initialized} themeMode={theme} />;
};
