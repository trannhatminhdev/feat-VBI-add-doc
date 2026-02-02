import React from 'react';
import { Select } from 'antd';

export interface ChartTypeSelectorProps {
  value: string; // 当前选中的图表类型
  options: string[]; // 可选图表类型
  onChange: (type: string) => void; // 选择变化回调
  style?: React.CSSProperties;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  value,
  options,
  onChange,
  style,
}) => {
  return (
    <div style={style}>
      <Select value={value} onChange={onChange} style={{ width: '100%' }}>
        {options.map((type) => (
          <Select.Option key={type} value={type}>
            {type}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default ChartTypeSelector;
