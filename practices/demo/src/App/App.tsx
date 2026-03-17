import {
  Flex,
  Spin,
  Card,
  Empty,
  Typography,
  Space,
  Button,
  Tooltip,
} from 'antd';
import { VSeedRender } from 'src/components/Render';
import { MeasuresList } from 'src/components/Fields/MeasuresList';
import { DimensionsList } from 'src/components/Fields/DimensionsList';
import { VBIBuilder } from '@visactor/vbi';

import {
  MeasureShelf,
  DimensionShelf,
  WhereShelf,
  HavingShelf,
} from 'src/components/Shelfs';
import { Toolbar } from 'src/components/Toolbar';
import { useVBIStore } from 'src/model';
import { useBuilderDocState } from 'src/hooks/useBuilderDocState';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

interface APPProps {
  builder?: VBIBuilder;
}

const ShelfRootOperatorButton = ({ type }: { type: 'where' | 'having' }) => {
  const builder = useVBIStore((state) => state.builder);
  const rootOperator = useBuilderDocState<'and' | 'or'>({
    builder,
    fallback: 'and',
    getSnapshot: (activeBuilder) => {
      if (type === 'where') {
        return activeBuilder.whereFilter.toJSON().op === 'or' ? 'or' : 'and';
      }
      return activeBuilder.havingFilter.toJSON().op === 'or' ? 'or' : 'and';
    },
  });

  const nextRootOperator = rootOperator === 'and' ? 'or' : 'and';
  const colors =
    type === 'where'
      ? {
          border: '#ffd8a8',
          color: '#d46b08',
        }
      : {
          border: '#bdd7ff',
          color: '#0958d9',
        };

  const handleRootOperatorChange = () => {
    if (!builder) {
      return;
    }

    builder.doc.transact(() => {
      const rootKey = type === 'where' ? 'whereFilter' : 'havingFilter';
      const rootNode = builder.dsl.get(rootKey) as
        | { set: (key: string, value: unknown) => void }
        | undefined;
      rootNode?.set('op', nextRootOperator);
    });
  };

  return (
    <Tooltip
      title={`当前逻辑 ${rootOperator.toUpperCase()}，点击切换为 ${nextRootOperator.toUpperCase()}`}
    >
      <Button
        type="text"
        size="small"
        onClick={handleRootOperatorChange}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 22,
          minWidth: 22,
          height: 18,
          padding: 0,
          lineHeight: 1,
          borderRadius: 5,
          border: `1px solid ${colors.border}`,
          background: '#fff',
          color: colors.color,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: 0.2,
            lineHeight: 1,
          }}
        >
          {rootOperator.toUpperCase()}
        </span>
      </Button>
    </Tooltip>
  );
};

export const APP = (props: APPProps) => {
  const { initialize, initialized } = useVBIStore(
    useShallow((state) => ({
      initialize: state.initialize,
      initialized: state.initialized,
      builder: state.builder,
      dsl: state.dsl,
    })),
  );

  useEffect(() => {
    return initialize(props.builder);
  }, []);

  if (!initialized) {
    return <Spin tip="Initializing..." fullscreen />;
  }

  return (
    <Flex
      vertical
      onClick={() => {
        console.group(`selected vbi`);
        console.log('state', useVBIStore.getState());
        console.groupEnd();
      }}
      style={{
        height: '100%',
        gap: '8px',
      }}
    >
      {/* 顶部 Toolbar */}
      <Card
        size="small"
        styles={{
          body: {
            padding: '8px 12px',
          },
        }}
      >
        <Toolbar />
      </Card>

      {/* 主内容区 */}
      <Flex vertical={false} gap={8} style={{ flex: 1, minHeight: 0 }}>
        {/* 左侧：字段列表 */}
        <Flex vertical gap={8} style={{ flexBasis: 220 }}>
          <DimensionsList style={{ flex: 1, minHeight: 0 }} />
          <MeasuresList style={{ flex: 1, minHeight: 0 }} />
        </Flex>

        {/* 右侧：Shelfs + 图表 */}
        <Flex vertical gap={8} style={{ flexGrow: 1 }}>
          <Card
            size="small"
            styles={{
              body: {
                padding: 0,
              },
            }}
          >
            <Flex
              vertical
              gap={0}
              style={{
                padding: '0px',
              }}
            >
              <Flex
                align="center"
                gap={8}
                style={{ minHeight: 38, borderBottom: '1px solid #f0f0f0' }}
              >
                <div
                  style={{
                    width: 80,
                    fontWeight: 500,
                    fontSize: 12,
                    paddingLeft: 12,
                    boxSizing: 'border-box',
                  }}
                >
                  Dimensions
                </div>
                <DimensionShelf
                  style={{
                    minHeight: 38,
                    height: 38,
                    flex: '0 0 calc(100% - 90px)',
                    width: '0 0 calc(100% - 90px)',
                  }}
                />
              </Flex>
              <Flex
                align="center"
                gap={8}
                style={{ minHeight: 38, borderBottom: '1px solid #f0f0f0' }}
              >
                <div
                  style={{
                    width: 80,
                    fontWeight: 500,
                    fontSize: 12,
                    paddingLeft: 12,
                    boxSizing: 'border-box',
                  }}
                >
                  Measures
                </div>
                <MeasureShelf
                  style={{
                    minHeight: 38,
                    height: 38,
                    flex: '0 0 calc(100% - 90px)',
                    width: '0 0 calc(100% - 90px)',
                  }}
                />
              </Flex>
              <Flex
                align="center"
                justify="space-between"
                style={{ minHeight: 38, borderBottom: '1px solid #f0f0f0' }}
              >
                <Flex
                  align="center"
                  justify="space-between"
                  style={{
                    width: 80,
                    minWidth: 80,
                    paddingLeft: 12,
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      fontWeight: 500,
                      fontSize: 12,
                    }}
                  >
                    Where
                  </div>
                  <ShelfRootOperatorButton type="where" />
                </Flex>
                <WhereShelf
                  showRootOperator={false}
                  style={{
                    minHeight: 38,
                    height: 38,
                    flex: '0 0 calc(100% - 90px)',
                    width: '0 0 calc(100% - 90px)',
                  }}
                />
              </Flex>
              <Flex
                align="center"
                justify="space-between"
                style={{ minHeight: 38 }}
              >
                <Flex
                  align="center"
                  justify="space-between"
                  style={{
                    width: 80,
                    minWidth: 80,
                    paddingLeft: 12,
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      fontWeight: 500,
                      fontSize: 12,
                    }}
                  >
                    Having
                  </div>
                  <ShelfRootOperatorButton type="having" />
                </Flex>
                <HavingShelf
                  showRootOperator={false}
                  style={{
                    minHeight: 38,
                    height: 38,
                    flex: '0 0 calc(100% - 90px)',
                    width: '0 0 calc(100% - 90px)',
                  }}
                />
              </Flex>
            </Flex>
          </Card>
          <ChartWrapper />
        </Flex>
      </Flex>
    </Flex>
  );
};

const ChartWrapper = () => {
  const vseed = useVBIStore((state) => state.vseed);
  const loading = useVBIStore((state) => state.loading);
  const builder = useVBIStore((state) => state.builder);
  const isEmptyDsl = builder.isEmpty();
  return (
    <Card
      loading={loading}
      styles={{
        root: {
          height: '100%',
        },
        body: {
          padding: '12px',
          height: '100%',
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
