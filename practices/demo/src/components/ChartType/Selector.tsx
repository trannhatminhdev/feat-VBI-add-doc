import React, { useState } from 'react';
import { Button, Popover } from 'antd';
import {
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  DotChartOutlined,
  AreaChartOutlined,
  RadarChartOutlined,
  HeatMapOutlined,
} from '@ant-design/icons';
import { useVBIStore } from 'src/model';
import { useVBIChartType } from 'src/hooks';

const CHART_ICONS: Record<string, React.ReactNode> = {
  line: <LineChartOutlined />,
  bar: <BarChartOutlined />,
  column: <BarChartOutlined />,
  pie: <PieChartOutlined />,
  donut: <PieChartOutlined />,
  rose: <PieChartOutlined />,
  dot: <DotChartOutlined />,
  area: <AreaChartOutlined />,
  radar: <RadarChartOutlined />,
  heatmap: <HeatMapOutlined />,
  scatter: <DotChartOutlined />,
  boxplot: <BarChartOutlined />,
  treemap: <BarChartOutlined />,
  sankey: <LineChartOutlined />,
  arcDiagram: <LineChartOutlined />,
  funnel: <BarChartOutlined />,
  table: <div style={{ fontSize: 14 }}>表格</div>,
  pivotTable: <div style={{ fontSize: 14 }}>透视表</div>,
};

const CHART_LABELS: Record<string, string> = {
  line: '折线图',
  bar: '柱状图',
  column: '柱状图',
  pie: '饼图',
  donut: '环形图',
  rose: '玫瑰图',
  dot: '点图',
  area: '面积图',
  radar: '雷达图',
  heatmap: '热力图',
  scatter: '散点图',
  boxplot: '箱线图',
  treemap: '树图',
  sankey: '桑基图',
  arcDiagram: '弧线图',
  funnel: '漏斗图',
  table: '表格',
  pivotTable: '透视表',
};

export const ChartTypeSelector = (props: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const { chartType, changeChartType, getAvailableChartTypes } =
    useVBIChartType(builder);
  const [open, setOpen] = useState(false);

  const { style } = props;
  const chartTypes = getAvailableChartTypes();

  const handleSelect = (type: string) => {
    changeChartType(type);
    setOpen(false);
  };

  const renderChartItem = (type: string) => (
    <div
      key={type}
      onClick={() => handleSelect(type)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 4px',
        cursor: 'pointer',
        borderRadius: 4,
        border: chartType === type ? '2px solid #1890ff' : '1px solid #d9d9d9',
        backgroundColor: chartType === type ? '#e6f7ff' : '#fff',
        transition: 'all 0.2s',
        minWidth: 60,
      }}
      onMouseEnter={(e) => {
        if (chartType !== type) {
          e.currentTarget.style.borderColor = '#1890ff';
          e.currentTarget.style.backgroundColor = '#f5f5f5';
        }
      }}
      onMouseLeave={(e) => {
        if (chartType !== type) {
          e.currentTarget.style.borderColor = '#d9d9d9';
          e.currentTarget.style.backgroundColor = '#fff';
        }
      }}
    >
      <div style={{ fontSize: 20, color: '#1890ff', marginBottom: 4 }}>
        {CHART_ICONS[type] || <DotChartOutlined />}
      </div>
      <div style={{ fontSize: 11, color: '#333', textAlign: 'center' }}>
        {CHART_LABELS[type] || type}
      </div>
    </div>
  );

  const content = (
    <div style={{ width: 280 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
          padding: 4,
        }}
      >
        {chartTypes.map(renderChartItem)}
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
        overlayStyle={{ padding: 0 }}
        overlayInnerStyle={{ padding: '8px' }}
      >
        <Button style={{ minWidth: 100, textAlign: 'left' }}>
          <span style={{ marginRight: 8 }}>
            {CHART_ICONS[chartType] || <DotChartOutlined />}
          </span>
          {CHART_LABELS[chartType] || chartType}
        </Button>
      </Popover>
    </div>
  );
};
