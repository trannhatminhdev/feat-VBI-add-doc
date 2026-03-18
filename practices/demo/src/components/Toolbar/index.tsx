import React from 'react';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  InfoCircleOutlined,
  MoonOutlined,
  RedoOutlined,
  SunOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Button, InputNumber, Segmented, Space, Tooltip, theme } from 'antd';
import { ChartTypeSelector } from 'src/components/ChartType';
import type { DemoLocale, DemoTheme } from 'src/constants/builder';
import { useVBIBuilder, useVBIUndoManager } from 'src/hooks';
import { useTranslation } from 'src/i18n';
import { useVBIStore } from 'src/model';
import { formatDefaultLimit } from './config';

const normalizeLimitValue = (value: number) => {
  return Math.max(1, Math.round(value));
};

const ToolbarDivider = () => {
  const { token } = theme.useToken();

  return (
    <span
      style={{
        width: 1,
        height: 18,
        background: token.colorBorderSecondary,
        flexShrink: 0,
      }}
    />
  );
};

export const Toolbar: React.FC = () => {
  const builder = useVBIStore((state) => state.builder);
  const { token } = theme.useToken();
  const { canUndo, canRedo, undo, redo } = useVBIUndoManager(builder);
  const { t, locale, setLocale } = useTranslation();
  const {
    theme: themeMode,
    limit,
    setTheme,
    setLimit,
  } = useVBIBuilder(builder);
  const defaultLimitText = formatDefaultLimit(locale);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    handleFullscreenChange();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const formatNumber = (value: string | number | undefined | null) => {
    if (value === undefined || value === null || value === '') {
      return '';
    }

    const numericValue =
      typeof value === 'number'
        ? value
        : Number(String(value).replace(/[^\d.-]/g, ''));

    if (!Number.isFinite(numericValue)) {
      return '';
    }

    return new Intl.NumberFormat(locale).format(numericValue);
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        padding: '6px 8px',
        background:
          themeMode === 'dark'
            ? 'linear-gradient(90deg, rgba(17, 24, 39, 0.92) 0%, rgba(22, 30, 46, 0.82) 100%)'
            : 'linear-gradient(90deg, rgba(240, 247, 255, 0.92) 0%, rgba(255, 255, 255, 0.96) 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          minWidth: 'max-content',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
          }}
        >
          <ChartTypeSelector compact />

          <ToolbarDivider />

          <Space.Compact size="small">
            <Tooltip title={`${t('toolbarHistoryUndo')} (Ctrl/Cmd+Z)`}>
              <Button
                icon={<UndoOutlined style={{ fontSize: 12 }} />}
                onClick={undo}
                disabled={!canUndo}
                size="small"
              />
            </Tooltip>
            <Tooltip
              title={`${t('toolbarHistoryRedo')} (Ctrl+Y / Cmd+Shift+Z)`}
            >
              <Button
                icon={<RedoOutlined style={{ fontSize: 12 }} />}
                onClick={redo}
                disabled={!canRedo}
                size="small"
              />
            </Tooltip>
          </Space.Compact>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
          }}
        >
          <InputNumber
            min={1}
            step={50}
            value={limit}
            style={{ width: 110 }}
            onChange={(value) => {
              if (typeof value === 'number') {
                setLimit(normalizeLimitValue(value));
              }
            }}
            size="small"
            placeholder={t('toolbarLimitPlaceholder', {
              defaultLimit: defaultLimitText,
            })}
            formatter={(value) => formatNumber(value)}
            parser={(value) => Number(value?.replace(/[^\d]/g, '') || 0)}
          />
          <Tooltip
            title={t('toolbarLimitTooltip', {
              defaultLimit: defaultLimitText,
            })}
          >
            <InfoCircleOutlined
              style={{
                fontSize: 12,
                color: token.colorTextTertiary,
                cursor: 'help',
              }}
            />
          </Tooltip>

          <ToolbarDivider />

          <Tooltip
            title={`${t('toolbarLocaleLabel')}: ${t('toolbarLocaleDescription')}`}
          >
            <Segmented
              size="small"
              value={locale}
              options={[
                { label: t('toolbarLocaleSwitchZh'), value: 'zh-CN' },
                { label: t('toolbarLocaleSwitchEn'), value: 'en-US' },
              ]}
              onChange={(value) => setLocale(value as DemoLocale)}
            />
          </Tooltip>

          <ToolbarDivider />

          <Tooltip
            title={`${t('toolbarThemeLabel')}: ${t('toolbarThemeDescription')}`}
          >
            <Segmented
              size="small"
              value={themeMode}
              options={[
                {
                  label: <SunOutlined style={{ fontSize: 12 }} />,
                  value: 'light',
                },
                {
                  label: <MoonOutlined style={{ fontSize: 12 }} />,
                  value: 'dark',
                },
              ]}
              onChange={(value) => setTheme(value as DemoTheme)}
            />
          </Tooltip>

          <ToolbarDivider />

          <Tooltip
            title={t(
              isFullscreen ? 'toolbarFullscreenExit' : 'toolbarFullscreenEnter',
            )}
          >
            <Button
              icon={
                isFullscreen ? (
                  <FullscreenExitOutlined style={{ fontSize: 12 }} />
                ) : (
                  <FullscreenOutlined style={{ fontSize: 12 }} />
                )
              }
              onClick={toggleFullscreen}
              size="small"
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
