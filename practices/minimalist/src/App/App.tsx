import { Flex, Spin, Card, Collapse, theme } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { VSeedRender } from 'src/components/Render';
import { MeasuresList } from 'src/components/Fields/MeasuresList';
import { DimensionsList } from 'src/components/Fields/DimensionsList';
import { VBIBuilder } from '@visactor/vbi';
import { ChartTypeSelector } from 'src/components/ChartType';
import {
  FilterPanel,
  type FilterItem,
} from 'src/components/Filter/FilterPanel';
import { MeasureShelf } from 'src/components/Shelfs/MeasureShelf';
import { DimensionShelf } from 'src/components/Shelfs/DimensionShelf';
import { useVBIStore } from 'src/model';
import { useEffect, useState, useMemo } from 'react';
import { useShallow } from 'zustand/shallow';

interface APPProps {
  builder?: VBIBuilder;
}

export const APP = (props: APPProps) => {
  const { initialize, initialized, builder, dsl } = useVBIStore(
    useShallow((state) => ({
      initialize: state.initialize,
      initialized: state.initialized,
      builder: state.builder,
      dsl: state.dsl,
    })),
  );

  const activeFields = useMemo(() => {
    if (!dsl) return [];
    const fields = new Set<string>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extractFields = (items: any[]) => {
      items?.forEach((item) => {
        if (item && typeof item === 'object') {
          if ('field' in item && typeof item.field === 'string') {
            fields.add(item.field);
          }
          if ('children' in item && Array.isArray(item.children)) {
            extractFields(item.children);
          }
        }
      });
    };

    extractFields(dsl.dimensions || []);
    extractFields(dsl.measures || []);
    return Array.from(fields);
  }, [dsl]);

  const [allFields, setAllFields] = useState<
    { name: string; role: 'dimension' | 'measure' }[]
  >([]);
  const [filters, setFilters] = useState<FilterItem[]>([]);

  useEffect(() => {
    const handleFilterError = () => {
      setFilters((prev) => prev.slice(0, -1));
    };
    window.addEventListener('vbi-filter-error', handleFilterError);
    return () =>
      window.removeEventListener('vbi-filter-error', handleFilterError);
  }, []);

  useEffect(() => {
    if (initialized && builder) {
      const fetchSchema = async () => {
        const schema = await builder.getSchema();
        setAllFields(
          schema.map((s: { name: string; type: string }) => ({
            name: s.name,
            role: s.type === 'number' ? 'measure' : 'dimension',
          })),
        );
      };
      fetchSchema();
    }
  }, [initialized, builder]);

  const handleFilterChange = (newFilters: FilterItem[]) => {
    setFilters(newFilters);
    if (builder) {
      builder.doc.transact(() => {
        builder.filters.clearFilters();
        newFilters.forEach((f) => {
          if (f.isActive) {
            builder.filters.addFilter({
              field: f.field,
              operator: f.operator,
              value: f.value,
              actionType: f.actionType,
              sortOrder: f.sortOrder,
              limit: f.limit,
              enabled: true,
            });
          }
        });
      });
    }
  };

  // --- 彻底修复：只调用 Hook，不接收任何变量 ---
  theme.useToken();

  useEffect(() => {
    return initialize(props.builder);
  }, []);

  if (!initialized) {
    return <Spin tip="Initializing..." fullscreen />;
  }

  // 侧边栏菜单配置
  const sidebarItems = [
    {
      key: '1',
      label: '图表类型',
      children: <ChartTypeSelector />,
      forceRender: true,
    },
    {
      key: '2',
      label: '筛选器',
      children: (
        <FilterPanel
          fields={allFields}
          activeFields={activeFields}
          filters={filters}
          onChange={handleFilterChange}
        />
      ),
      forceRender: true,
    },
    {
      key: '3',
      label: '维度',
      children: <DimensionsList />,
      forceRender: true,
    },
    {
      key: '4',
      label: '指标',
      children: <MeasuresList />,
      forceRender: true,
    },
  ];

  const styles = {
    container: {
      height: '100%',
      width: '100%',
      background: '#fff',
      overflow: 'hidden',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    },
    sidebar: {
      width: 220,
      background: '#fff',
      borderRight: '1px solid #f0f0f0',
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      flexShrink: 0,
    },
    sidebarScrollArea: {
      flex: 1,
      overflowY: 'auto' as const,
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%',
      minWidth: 0,
    },
    shelfHeader: {
      background: '#fff',
      borderBottom: '1px solid #f0f0f0',
      padding: '8px 16px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 8,
      flexShrink: 0,
      zIndex: 10,
    },
    canvasArea: {
      flex: 1,
      padding: '20px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      background: '#fff',
    },
    shelfLabel: {
      width: 60,
      fontSize: 12,
      color: '#86909c',
      fontWeight: 500,
    },
  };

  return (
    <div style={styles.container}>
      <Flex vertical={false} style={{ height: '100%' }}>
        {/* --- 左侧侧边栏 --- */}
        <div style={styles.sidebar}>
          <div
            style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}
          >
            <div style={{ fontWeight: 700, color: '#1d2129' }}>
              DataWind{' '}
              <span style={{ fontWeight: 400, fontSize: 12 }}>Lite</span>
            </div>
          </div>

          <div style={styles.sidebarScrollArea}>
            <Collapse
              ghost
              defaultActiveKey={['1', '2', '3', '4']}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              items={sidebarItems}
              size="small"
              style={{ borderRadius: 0 }}
            />
          </div>
        </div>

        {/* --- 右侧主区域 --- */}
        <div style={styles.main}>
          {/* 顶部配置栏 */}
          <div style={styles.shelfHeader}>
            <Flex align="center">
              <div style={styles.shelfLabel}>行 / Dim</div>
              <DimensionShelf style={{ flex: 1 }} />
            </Flex>
            <Flex align="center">
              <div style={styles.shelfLabel}>列 / Meas</div>
              <MeasureShelf style={{ flex: 1 }} />
            </Flex>
          </div>

          {/* 中部画布区 */}
          <div style={styles.canvasArea}>
            <ChartWrapper />
          </div>
        </div>
      </Flex>
    </div>
  );
};

const ChartWrapper = () => {
  const vseed = useVBIStore((state) => state.vseed);
  const loading = useVBIStore((state) => state.loading);

  return (
    <Card
      loading={loading}
      bordered={false}
      styles={{
        root: {
          width: '600px',
          maxWidth: '100%',
          height: '400px',
          boxShadow: 'none',
          border: '1px solid #e5e6eb',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          marginTop: 20,
          marginLeft: 20,
        },
        body: {
          padding: '24px',
          flex: 1,
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        },
      }}
    >
      {vseed ? (
        <VSeedRender vseed={vseed} />
      ) : (
        <Flex
          justify="center"
          align="center"
          style={{
            height: '100%',
            color: '#ccc',
            fontSize: 12,
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div>暂无数据</div>
          <div style={{ fontSize: 10, color: '#f0f0f0' }}>请从左侧拖拽字段</div>
        </Flex>
      )}
    </Card>
  );
};
