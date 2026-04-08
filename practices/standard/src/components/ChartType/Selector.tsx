import React, { useMemo, useState } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { Button, Popover, Typography, theme } from 'antd';
import { useVBIChartType } from 'src/hooks';
import { useTranslation } from 'src/i18n';
import { useVBIStore } from 'src/model';
import {
  getChartTypeGroups,
  getChartTypeMeta,
} from 'src/components/Toolbar/config';

const { Text } = Typography;
const PANEL_CARD_WIDTH = 96;
const PANEL_CARD_HEIGHT = 64;

export const ChartTypeSelector = ({
  compact = false,
  showText = true,
  style,
}: {
  compact?: boolean;
  showText?: boolean;
  style?: React.CSSProperties;
}) => {
  const builder = useVBIStore((state) => state.builder);
  const { chartType, changeChartType, getAvailableChartTypes } =
    useVBIChartType(builder);
  const [open, setOpen] = useState(false);
  const { token } = theme.useToken();
  const { t } = useTranslation();

  const availableChartTypes = getAvailableChartTypes();

  const groupedChartTypes = useMemo(() => {
    return getChartTypeGroups(t)
      .map((group) => ({
        ...group,
        items: availableChartTypes.filter(
          (type) => getChartTypeMeta(type, t).group === group.key,
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [availableChartTypes, t]);

  const currentChartMeta = useMemo(
    () => getChartTypeMeta(chartType, t),
    [chartType, t],
  );
  const triggerTooltip = `${currentChartMeta.label}: ${currentChartMeta.description}`;

  const handleSelect = (type: string) => {
    changeChartType(type);
    setOpen(false);
  };

  const renderChartCard = (type: string) => {
    const meta = getChartTypeMeta(type, t);
    const selected = chartType === type;
    const tooltipText = `${meta.label}: ${meta.description}`;

    return (
      <button
        key={type}
        type="button"
        title={tooltipText}
        aria-label={tooltipText}
        onClick={() => handleSelect(type)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          width: PANEL_CARD_WIDTH,
          height: PANEL_CARD_HEIGHT,
          padding: '8px 6px',
          borderRadius: token.borderRadius,
          border: `1px solid ${
            selected ? token.colorPrimaryBorder : token.colorBorderSecondary
          }`,
          background: selected ? token.colorPrimaryBg : token.colorBgContainer,
          color: selected ? token.colorPrimary : token.colorText,
          cursor: 'pointer',
          textAlign: 'center',
          boxShadow: 'none',
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            fontSize: 13,
            flexShrink: 0,
          }}
        >
          {meta.icon}
        </span>
        <span
          style={{
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 11,
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          {meta.label}
        </span>
      </button>
    );
  };

  const content = (
    <div
      style={{
        width: 'min(540px, calc(100vw - 24px))',
        maxWidth: 'calc(100vw - 24px)',
        maxHeight: 'min(58vh, 420px)',
        overflowY: 'auto',
      }}
    >
      <div style={{ marginBottom: 10 }}>
        <Text strong style={{ fontSize: 13 }}>
          {t('toolbarChartTypePanelTitle')}
        </Text>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {groupedChartTypes.map((group) => (
          <div key={group.key}>
            <div style={{ marginBottom: 6 }}>
              <Text strong style={{ fontSize: 11 }}>
                {group.label}
              </Text>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fill, ${PANEL_CARD_WIDTH}px)`,
                gridAutoRows: `${PANEL_CARD_HEIGHT}px`,
                gap: 6,
                justifyContent: 'start',
              }}
            >
              {group.items.map(renderChartCard)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={style}>
      <Popover
        content={content}
        trigger="click"
        open={open}
        onOpenChange={setOpen}
        placement="bottomLeft"
        styles={{
          root: { padding: 0 },
          container: {
            padding: 14,
            borderRadius: token.borderRadiusLG,
          },
        }}
      >
        <Button
          size={compact ? 'middle' : 'large'}
          title={triggerTooltip}
          aria-label={triggerTooltip}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: compact ? 6 : 12,
            width: compact ? (showText ? 128 : 32) : '100%',
            maxWidth: '100%',
            height: compact ? 28 : 'auto',
            padding: compact ? (showText ? '0 8px' : '0 7px') : '12px 14px',
            borderRadius: token.borderRadiusOuter,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: compact ? 18 : 38,
              height: compact ? 18 : 38,
              borderRadius: token.borderRadius,
              background: token.colorPrimaryBg,
              color: token.colorPrimary,
              fontSize: compact ? 11 : 18,
              flexShrink: 0,
            }}
          >
            {currentChartMeta.icon ?? <AppstoreOutlined />}
          </span>
          {showText ? (
            <span
              style={{
                display: 'flex',
                flex: 1,
                minWidth: 0,
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  fontSize: compact ? 12 : 13,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: token.colorText,
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentChartMeta.label}
              </span>
              {!compact ? (
                <span
                  style={{
                    fontSize: 12,
                    lineHeight: 1.4,
                    color: token.colorTextSecondary,
                    whiteSpace: 'normal',
                  }}
                >
                  {currentChartMeta.description}
                </span>
              ) : null}
            </span>
          ) : null}
        </Button>
      </Popover>
    </div>
  );
};
