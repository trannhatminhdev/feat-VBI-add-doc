import { Card, ConfigProvider, Flex, Spin, theme as antdTheme } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { VBIChartBuilder } from '@visactor/vbi';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ShelfDndProvider } from 'src/components/Shelves/dnd';
import { Toolbar } from 'src/components/Toolbar';
import { useVBIBuilder } from 'src/hooks';
import type { DemoTheme } from 'src/constants/builder';
import { useTranslation } from 'src/i18n';
import { useVBIStore, VBIStoreProvider } from 'src/model';
import { useShallow } from 'zustand/shallow';
import { ChartPanel, FieldsPanel, ShelfPanel, ViewPanel } from './components';
import './app.css';

type AppMode = 'view' | 'edit';

interface APPProps {
  builder?: VBIChartBuilder;
  mode?: AppMode;
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
      borderRadius: 10,
      borderRadiusLG: 14,
      borderRadiusSM: 8,
      borderRadiusXS: 6,
      borderRadiusOuter: 22,
      controlHeight: 32,
      controlHeightSM: 28,
      fontSize: 12,
      fontSizeSM: 12,
    },
  };
};

const DemoWorkbenchPanels = memo(() => {
  return (
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
  );
});

const DemoWorkbench = ({
  themeMode,
  isFullscreen,
  onToggleFullscreen,
}: {
  themeMode: DemoTheme;
  isFullscreen: boolean;
  onToggleFullscreen: () => void | Promise<void>;
}) => {
  const { token } = antdTheme.useToken();

  return (
    <ShelfDndProvider>
      <Flex
        className="demo-app-workbench"
        vertical
        style={{
          height: '100%',
          gap: 10,
          padding: isFullscreen ? 12 : 10,
          background:
            themeMode === 'dark'
              ? 'radial-gradient(circle at top left, rgba(110, 168, 255, 0.14), transparent 30%), linear-gradient(180deg, #0b1220 0%, #111826 100%)'
              : 'radial-gradient(circle at top left, rgba(22, 119, 255, 0.1), transparent 32%), linear-gradient(180deg, #f3f7fc 0%, #edf2f8 100%)',
        }}
      >
        <Card
          size="small"
          style={{
            borderRadius: token.borderRadiusOuter,
            overflow: 'hidden',
            borderColor: token.colorBorderSecondary,
            background:
              themeMode === 'dark'
                ? 'rgba(12, 19, 31, 0.9)'
                : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
          styles={{
            body: {
              padding: 0,
            },
          }}
        >
          <Toolbar
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
          />
        </Card>
        <DemoWorkbenchPanels />
      </Flex>
    </ShelfDndProvider>
  );
};

const AppContent = ({
  initialized,
  mode,
  themeMode,
}: {
  initialized: boolean;
  mode: AppMode;
  themeMode: DemoTheme;
}) => {
  const logState = useVBIStore((state) => state.logState);
  const { locale, t } = useTranslation();
  const antdLocale = DEMO_ANTD_LOCALES[locale];
  const antdThemeConfig = useMemo(
    () => createThemeConfig(themeMode),
    [themeMode],
  );
  const appRootRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (mode !== 'edit') {
      return;
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === appRootRef.current);
    };

    handleFullscreenChange();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [mode]);

  const toggleFullscreen = useCallback(async () => {
    if (mode !== 'edit') {
      return;
    }

    const target = appRootRef.current;
    if (!target) {
      return;
    }

    try {
      if (document.fullscreenElement === target) {
        await document.exitFullscreen();
        return;
      }

      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      await target.requestFullscreen();
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error);
    }
  }, [mode]);

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={antdThemeConfig}
      componentSize="small"
    >
      <div
        ref={appRootRef}
        className={`demo-app-root demo-app-root--${mode}`}
        onClick={
          mode === 'edit'
            ? () => {
                void logState();
              }
            : undefined
        }
      >
        {!initialized ? (
          mode === 'edit' ? (
            <Spin tip={t('appInitializing')} fullscreen />
          ) : (
            <div className="demo-app-view-loading">
              <Spin spinning tip={t('appInitializing')}>
                <div className="demo-app-view-loading-target" />
              </Spin>
            </div>
          )
        ) : mode === 'edit' ? (
          <DemoWorkbench
            themeMode={themeMode}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        ) : (
          <ViewPanel />
        )}
      </div>
    </ConfigProvider>
  );
};

const AppShell = ({
  builder,
  mode,
}: {
  builder?: VBIChartBuilder;
  mode: AppMode;
}) => {
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

  return <AppContent initialized={initialized} mode={mode} themeMode={theme} />;
};

export const APP = ({ builder, mode = 'edit' }: APPProps) => {
  return (
    <VBIStoreProvider builder={builder}>
      <AppShell builder={builder} mode={mode} />
    </VBIStoreProvider>
  );
};
