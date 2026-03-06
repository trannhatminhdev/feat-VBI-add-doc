import { Select } from 'antd';
import { useVBIStore } from 'src/model';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined, 
  TableOutlined,
  DotChartOutlined
} from '@ant-design/icons';

export const ChartTypeSelector = (props: { style?: React.CSSProperties }) => {
  const builder = useVBIStore((state) => state.builder);
  const chartType = useVBIStore((state) => state.dsl.chartType);
  const { style } = props;

  const changeChartType = (chartType: string) => {
    builder.chartType.changeChartType(chartType);
  };

  const availableChartTypes = builder.chartType.getAvailableChartTypes();

  // Helper to map chart types to icons
  const getChartIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('bar') || t.includes('column')) return <BarChartOutlined />;
    if (t.includes('line') || t.includes('area')) return <LineChartOutlined />;
    if (t.includes('pie') || t.includes('donut')) return <PieChartOutlined />;
    if (t.includes('table')) return <TableOutlined />;
    return <DotChartOutlined />;
  };

  return (
    <div style={{ ...style, backgroundColor: '#fff', padding: '12px', borderRadius: '8px' }}>
      <div style={{ marginBottom: '8px', fontWeight: 500 }}>Chart Type</div>
      <Select
        defaultValue={builder.chartType.getChartType()}
        value={chartType}
        onChange={changeChartType}
        style={{ width: '100%' }}
        optionLabelProp="label"
      >
        {availableChartTypes.map((type) => (
          <Select.Option key={type} value={type} label={type}>
            <span style={{ marginRight: 8 }}>{getChartIcon(type)}</span>
            {type}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};