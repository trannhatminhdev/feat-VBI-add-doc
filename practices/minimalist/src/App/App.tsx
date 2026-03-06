import { Flex, Spin, Card, Typography } from 'antd';
import { VSeedRender } from 'src/components/Render';
import { MeasuresList } from 'src/components/Fields/MeasuresList';
import { DimensionsList } from 'src/components/Fields/DimensionsList';
import { VBIBuilder } from '@visactor/vbi';
import { ChartTypeSelector } from 'src/components/ChartType';

import { MeasureShelf } from 'src/components/Shelfs/MeasureShelf';
import { DimensionShelf } from 'src/components/Shelfs/DimensionShelf';
import { useVBIStore } from 'src/model';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

  

const { Title } = Typography;

interface APPProps {
  builder?: VBIBuilder;
}

export const APP = (props: APPProps) => {
  const { initialize, initialized } = useVBIStore(
    useShallow((state) => ({
      initialize: state.initialize,
      initialized: state.initialized,
    })),
  );



  useEffect(() => {
    return initialize(props.builder);
  }, []);

  if (!initialized) {
    return <Spin tip="Initializing..." fullscreen />;
  }

  return (
    <Flex vertical style={{ height: '100vh', padding: '16px', backgroundColor: '#f5f5f5' }}>
      {/* 1. Webpage Title */}
      <Title level={3} style={{ margin: '0 0 16px 0', color: '#333' }}>
        Minimalist
      </Title>

      <Flex style={{ height: 'calc(100% - 48px)', gap: '20px' }}>
        {/* Left Column: Chart Selector & Selected Shelves */}
        <Flex vertical gap={20} style={{ width: '250px', flexShrink: 0 }}>
          <ChartTypeSelector />
          
          <Card title="Selected Dimensions" styles={{ body: { padding: '12px', overflowY: 'auto', maxHeight: '30vh' } }}>
            <DimensionShelf style={{ flexDirection: 'column' }} />
          </Card>

          <Card title="Selected Measures" styles={{ body: { padding: '12px', overflowY: 'auto', maxHeight: '30vh' } }}>
            <MeasureShelf style={{ flexDirection: 'column' }} />
          </Card>
        </Flex>

        {/* Right Column: Available Lists & Chart Wrapper */}
        <Flex vertical gap={20} style={{ flexGrow: 1, minWidth: 0 }}>
          {/* Top of Chart: Horizontal Options */}
          <Card styles={{ body: { padding: '12px' } }}>
            <Flex vertical gap={12}>
              <DimensionsList />
              <MeasuresList />
            </Flex>
          </Card>

          {/* Bottom: Chart Result */}
          <ChartWrapper />
        </Flex>
      </Flex>
    </Flex>
  );
};

const ChartWrapper = () => {
  const vseed = useVBIStore((state) => state.vseed);
  const loading = useVBIStore((state) => state.loading);
  return (
    <Card
      loading={loading}
      styles={{
        root: { height: '100%' },
        body: { padding: '12px', height: '100%' },
      }}
    >
      {vseed && <VSeedRender vseed={vseed} />}
    </Card>
  );
};



