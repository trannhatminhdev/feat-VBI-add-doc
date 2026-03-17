import { Flex, Spin, Card, Empty, Typography, Space } from 'antd';
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
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

interface APPProps {
  builder?: VBIBuilder;
}

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
                padding: '8px',
              },
            }}
          >
            <Flex vertical gap={4}>
              <Flex align="center" gap={8}>
                <div style={{ width: 70, fontWeight: 500, fontSize: 12 }}>
                  Dimensions
                </div>
                <DimensionShelf style={{ flex: 1, minHeight: 28 }} />
              </Flex>
              <Flex align="center" gap={8}>
                <div style={{ width: 70, fontWeight: 500, fontSize: 12 }}>
                  Measures
                </div>
                <MeasureShelf style={{ flex: 1, minHeight: 28 }} />
              </Flex>
              <Flex align="center" gap={8}>
                <div style={{ width: 70, fontWeight: 500, fontSize: 12 }}>
                  Where
                </div>
                <WhereShelf style={{ flex: 1, minHeight: 28 }} />
              </Flex>
              <Flex align="center" gap={8}>
                <div style={{ width: 70, fontWeight: 500, fontSize: 12 }}>
                  Having
                </div>
                <HavingShelf style={{ flex: 1, minHeight: 28 }} />
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
