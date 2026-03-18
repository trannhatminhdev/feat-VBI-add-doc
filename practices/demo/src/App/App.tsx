import { Card, Flex, Spin } from 'antd';
import { VBIBuilder } from '@visactor/vbi';
import { useEffect } from 'react';
import { ShelfDndProvider } from 'src/components/Shelfs/dnd';
import { Toolbar } from 'src/components/Toolbar';
import { useVBIStore } from 'src/model';
import { useShallow } from 'zustand/shallow';
import { ChartPanel, FieldsPanel, ShelfPanel } from './components';

interface APPProps {
  builder?: VBIBuilder;
}

export const APP = ({ builder }: APPProps) => {
  const { initialize, initialized } = useVBIStore(
    useShallow((state) => ({
      initialize: state.initialize,
      initialized: state.initialized,
    })),
  );

  useEffect(() => {
    return initialize(builder);
  }, [builder, initialize]);

  if (!initialized) {
    return <Spin tip="Initializing..." fullscreen />;
  }

  return (
    <ShelfDndProvider>
      <Flex
        onClick={() => {
          console.group(`selected vbi`);
          console.log('state', useVBIStore.getState());
          console.log('builder', useVBIStore.getState().builder);
          console.log('vbi dsl', useVBIStore.getState().builder.build());
          console.log(
            'vquery dsl',
            useVBIStore.getState().builder.buildVQuery(),
          );
          console.groupEnd();
        }}
        vertical
        style={{
          height: '100%',
          gap: 8,
        }}
      >
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
