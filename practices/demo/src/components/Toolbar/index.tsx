import React from 'react';
import { Button, Space, Tooltip, Select, InputNumber } from 'antd';
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';
import { useVBIStore } from 'src/model';
import { useVBIUndoManager, useVBIBuilder, useVBIChartType } from 'src/hooks';

export const Toolbar: React.FC = () => {
  const builder = useVBIStore((state) => state.builder);
  const { canUndo, canRedo, undo, redo } = useVBIUndoManager(builder);
  const { locale, theme, limit, setLocale, setTheme, setLimit } =
    useVBIBuilder(builder);
  const { chartType, changeChartType, getAvailableChartTypes } =
    useVBIChartType(builder);

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  return (
    <Space wrap size="small">
      <Select
        value={chartType}
        onChange={changeChartType}
        style={{ width: 120 }}
        size="small"
      >
        {getAvailableChartTypes().map((type) => (
          <Select.Option key={type} value={type}>
            {type}
          </Select.Option>
        ))}
      </Select>
      <Tooltip title="撤销 (Ctrl+Z)">
        <Button
          icon={<UndoOutlined />}
          onClick={handleUndo}
          disabled={!canUndo}
          size="small"
        />
      </Tooltip>
      <Tooltip title="重做 (Ctrl+Y)">
        <Button
          icon={<RedoOutlined />}
          onClick={handleRedo}
          disabled={!canRedo}
          size="small"
        />
      </Tooltip>
      <Select
        value={locale}
        onChange={setLocale}
        style={{ width: 90 }}
        size="small"
      >
        <Select.Option value="zh-CN">中文</Select.Option>
        <Select.Option value="zh-TW">繁體</Select.Option>
        <Select.Option value="en-US">EN</Select.Option>
        <Select.Option value="ja-JP">日文</Select.Option>
      </Select>
      <Select
        value={theme}
        onChange={setTheme}
        style={{ width: 70 }}
        size="small"
      >
        <Select.Option value="light">浅色</Select.Option>
        <Select.Option value="dark">深色</Select.Option>
      </Select>
      <InputNumber
        min={0}
        max={100000}
        value={limit}
        style={{ width: 80 }}
        onChange={(value) => {
          if (typeof value === 'number') {
            setLimit(value);
          }
        }}
        size="small"
        placeholder="limit"
      />
    </Space>
  );
};
