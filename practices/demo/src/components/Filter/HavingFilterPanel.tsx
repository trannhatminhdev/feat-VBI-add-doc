import React, { useState, useRef, useEffect } from 'react';
import {
  Select,
  Input,
  Button,
  Space,
  Popover,
  Form,
  Typography,
  Tooltip,
  Radio,
  InputNumber,
  Empty,
  Badge,
} from 'antd';
import {
  FilterOutlined,
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  ClearOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import {
  HAVING_AGGREGATE_OPTIONS,
  HAVING_OPERATOR_OPTIONS,
} from './havingFilterUtils';

const { Option = Select.Option } = Select;
const { Text } = Typography;

export interface HavingItem {
  id?: string; // 可选的 ID，用于增量操作
  field: string;
  aggregateFunc: string;
  operator: string;
  value: unknown;
}

export interface HavingField {
  name: string;
  role: 'dimension' | 'measure';
}

interface HavingFilterPanelProps {
  fields: HavingField[];
  activeFields?: string[];
  filters: HavingItem[];
  onChange?: (filters: HavingItem[]) => void;
  onAdd?: (filter: HavingItem) => void; // 增量添加回调
  onRemove?: (id: string) => void; // 增量删除回调
  onCancel?: () => void;
  embedded?: boolean;
  itemEdit?: boolean;
}

export const HavingFilterPanel: React.FC<HavingFilterPanelProps> = ({
  fields,
  activeFields = [],
  filters = [],
  onChange,
  onAdd,
  onRemove,
  onCancel,
  embedded = false,
  itemEdit = false,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const containerRef = useRef<HTMLDivElement>(null);

  const sortedFields = React.useMemo(() => {
    const activeSet = new Set(activeFields);
    return [...fields].sort((a, b) => {
      const aActive = activeSet.has(a.name);
      const bActive = activeSet.has(b.name);
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      return 0;
    });
  }, [fields, activeFields]);

  const selectedField = Form.useWatch('field', form);
  const operator = Form.useWatch('operator', form);
  const aggregateFunc = Form.useWatch('aggregateFunc', form);

  // Reset form when opening/closing
  useEffect(() => {
    if (!popoverOpen) {
      setIsAdding(false);
      setEditingId(null);
      form.resetFields();
    }
  }, [popoverOpen, form]);

  React.useEffect(() => {
    if (popoverOpen) {
      const currentOperator = form.getFieldValue('operator');
      if (
        currentOperator &&
        !HAVING_OPERATOR_OPTIONS.find((op) => op.value === currentOperator)
      ) {
        form.setFieldValue('operator', HAVING_OPERATOR_OPTIONS[0]?.value);
      }
    }
  }, [popoverOpen, form]);

  React.useEffect(() => {
    if (popoverOpen && operator) {
      const currentValue = form.getFieldValue('value');
      if (operator === 'between') {
        if (
          typeof currentValue !== 'object' ||
          Array.isArray(currentValue) ||
          currentValue === null
        ) {
          form.setFieldValue('value', {
            min: undefined,
            max: undefined,
            leftOp: '<=',
            rightOp: '<=',
          });
        }
      } else {
        if (
          typeof currentValue === 'object' &&
          !Array.isArray(currentValue) &&
          currentValue !== null
        ) {
          form.setFieldValue('value', undefined);
        }
      }
    }
  }, [operator, popoverOpen, form]);

  // itemEdit 模式下，自动进入编辑模式
  React.useEffect(() => {
    if (itemEdit && filters.length === 1 && !editingId && !isAdding) {
      const item = filters[0];
      setEditingId(item.id || null);
      const value =
        item.operator === 'between'
          ? item.value
          : Array.isArray(item.value)
            ? item.value.join(',')
            : item.value;
      form.setFieldsValue({
        field: item.field,
        aggregateFunc: item.aggregateFunc,
        operator: item.operator,
        value: value,
      });
    }
  }, [itemEdit, filters, form, editingId, isAdding]);

  const handleAddClick = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      aggregateFunc: 'sum',
      operator: '>',
    });
    setIsAdding(true);
  };

  const handleEdit = (id: string) => {
    const item = filters.find((f) => f.id === id);
    if (!item) return;

    const value =
      item.operator === 'between'
        ? item.value
        : Array.isArray(item.value)
          ? item.value.join(',')
          : item.value;
    setEditingId(id);
    setIsAdding(false);
    form.setFieldsValue({
      field: item.field,
      aggregateFunc: item.aggregateFunc,
      operator: item.operator,
      value: value,
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    form.resetFields();
    onCancel?.();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { field, aggregateFunc, operator, value } = values;
      const finalValue =
        (operator === 'in' ||
          operator === 'not in' ||
          operator === '=' ||
          operator === '!=') &&
        typeof value === 'string'
          ? value.split(',').map((v: string) => v.trim())
          : value;

      // 获取原有 filter 的 id（编辑模式）
      const existingFilter = editingId
        ? filters.find((f) => f.id === editingId)
        : undefined;
      const newFilter: HavingItem = {
        id: existingFilter?.id,
        field,
        aggregateFunc,
        operator,
        value: finalValue,
      };

      // 优先使用增量回调
      if (editingId) {
        // 编辑模式：需要 onChange
        if (onChange) {
          const newFilters = [...filters];
          const editIndex = newFilters.findIndex((f) => f.id === editingId);
          if (editIndex >= 0) {
            newFilters[editIndex] = {
              ...newFilters[editIndex],
              field,
              aggregateFunc,
              operator,
              value: finalValue,
            };
            onChange(newFilters);
          }
        } else if (onRemove && onAdd) {
          // 兼容模式：先删除再添加
          onRemove(editingId);
          onAdd(newFilter);
        }
      } else if (onAdd) {
        // 增量添加模式
        onAdd(newFilter);
      } else if (onChange) {
        // 全量添加模式
        onChange([...filters, newFilter]);
      }

      setIsAdding(false);
      setEditingId(null);
      form.resetFields();
    });
  };

  const handleDelete = (id: string) => {
    // 如果有 onRemove 回调和 ID，使用增量删除
    if (onRemove && id) {
      onRemove(id);
    } else if (onChange) {
      // 否则使用全量更新（兼容模式）
      const newFilters = filters.filter((f) => f.id !== id);
      onChange(newFilters);
    }
  };

  const handleClearAll = () => {
    if (onChange) {
      onChange([]);
    }
  };

  // 生成 Having 过滤条件显示文本
  const getHavingDisplayText = (item: HavingItem) => {
    if (
      item.operator === 'between' &&
      item.value &&
      typeof item.value === 'object'
    ) {
      const v = item.value as {
        min?: string;
        max?: string;
        leftOp?: string;
        rightOp?: string;
      };
      return `${v.min ?? ''} ${v.leftOp ?? '<='} ${item.aggregateFunc}(${item.field}) ${v.rightOp ?? '<='} ${v.max ?? ''}`;
    }
    return `${item.aggregateFunc}(${item.field}) ${item.operator} ${item.value}`;
  };

  const renderHavingForm = () => (
    <Form
      form={form}
      layout="vertical"
      style={{ width: 260, marginTop: 8 }}
      initialValues={{
        operator: '>',
        aggregateFunc: 'sum',
      }}
    >
      <Form.Item
        label="聚合函数"
        name="aggregateFunc"
        rules={[{ required: true, message: '请选择聚合函数' }]}
        style={{ marginBottom: 8 }}
      >
        <Radio.Group size="small" optionType="button">
          {HAVING_AGGREGATE_OPTIONS.map((func) => (
            <Radio key={func.value} value={func.value}>
              {func.label.split(' ')[0]}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="字段"
        name="field"
        rules={[{ required: true, message: '请选择字段' }]}
        style={{ marginBottom: 8 }}
      >
        <Select
          placeholder="选择字段"
          size="small"
          showSearch
          onChange={() => {
            form.setFieldsValue({
              value: undefined,
            });
          }}
        >
          {sortedFields.map((f) => {
            const isActive = activeFields.includes(f.name);
            return (
              <Option key={f.name} value={f.name}>
                <span
                  style={
                    isActive ? { color: '#e39700', fontWeight: 'bold' } : {}
                  }
                >
                  {f.name} ({f.role === 'measure' ? '度量' : '维度'}){' '}
                  {isActive ? '(推荐)' : ''}
                </span>
              </Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item
        label="操作符"
        name="operator"
        rules={[{ required: true }]}
        style={{ marginBottom: 8 }}
      >
        <Select
          size="small"
          onChange={() => {
            form.setFieldsValue({ value: undefined });
          }}
        >
          {HAVING_OPERATOR_OPTIONS.map((op) => (
            <Option key={op.value} value={op.value}>
              {op.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {operator === 'between' ? (
        <Form.Item label="范围" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Form.Item name={['value', 'min']} noStyle>
              <InputNumber
                placeholder="最小"
                size="small"
                style={{ width: 50 }}
                controls={false}
              />
            </Form.Item>
            <Form.Item name={['value', 'leftOp']} noStyle>
              <Select size="small" style={{ width: 45 }}>
                <Option value="<">&lt;</Option>
                <Option value="<=">&lt;=</Option>
              </Select>
            </Form.Item>
            <Text ellipsis style={{ maxWidth: 60, fontSize: 12 }}>
              {aggregateFunc}({selectedField || '?'})
            </Text>
            <Form.Item name={['value', 'rightOp']} noStyle>
              <Select size="small" style={{ width: 45 }}>
                <Option value="<">&lt;</Option>
                <Option value="<=">&lt;=</Option>
              </Select>
            </Form.Item>
            <Form.Item name={['value', 'max']} noStyle>
              <InputNumber
                placeholder="最大"
                size="small"
                style={{ width: 50 }}
                controls={false}
              />
            </Form.Item>
          </div>
        </Form.Item>
      ) : (
        <Form.Item
          label="值"
          name="value"
          rules={[{ required: true, message: '请输入值' }]}
          style={{ marginBottom: 8 }}
        >
          <Input size="small" placeholder="输入值" />
        </Form.Item>
      )}

      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Space>
          <Button size="small" onClick={handleCancel}>
            取消
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={handleSubmit}
            icon={<CheckOutlined />}
          >
            {editingId ? '保存' : '添加'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const renderHavingList = () => (
    <div style={{ width: 280 }}>
      {filters.length === 0 && !isAdding ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无分组过滤条件"
          style={{ margin: '20px 0' }}
        />
      ) : (
        <div style={{ maxHeight: 200, overflow: 'auto' }}>
          {filters.map((item, index) => (
            <div
              key={item.id ?? `having-filter-${index}`}
              style={{
                padding: '4px 8px',
                opacity: editingId === item.id ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 12, minWidth: 0, flex: 1 }} ellipsis>
                {getHavingDisplayText(item)}
              </Text>
              <Space size={2}>
                <Tooltip title="编辑">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => item.id && handleEdit(item.id)}
                    style={{ color: '#722ed1' }}
                  />
                </Tooltip>
                <Tooltip title="删除">
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => item.id && handleDelete(item.id)}
                  />
                </Tooltip>
              </Space>
            </div>
          ))}
        </div>
      )}

      {isAdding && renderHavingForm()}
    </div>
  );

  const popoverContent = (
    <div ref={containerRef}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Text strong style={{ fontSize: 13 }}>
          分组过滤 (Having)
        </Text>
        <Space size={4}>
          {!isAdding && !editingId && (
            <>
              <Tooltip title="添加条件">
                <Button
                  type="text"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={handleAddClick}
                />
              </Tooltip>
              {filters.length > 0 && (
                <Tooltip title="清空全部">
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<ClearOutlined />}
                    onClick={handleClearAll}
                  />
                </Tooltip>
              )}
            </>
          )}
        </Space>
      </div>

      {renderHavingList()}
    </div>
  );

  // itemEdit 模式：只渲染单个 item 的编辑表单
  if (itemEdit && filters.length === 1) {
    return (
      <div ref={containerRef}>
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ fontSize: 13 }}>
            编辑分组过滤
          </Text>
        </div>
        {renderHavingForm()}
      </div>
    );
  }

  // embedded 模式下直接渲染内容，不显示按钮
  if (embedded) {
    return popoverContent;
  }

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
      placement="left"
      overlayStyle={{ padding: 0 }}
      overlayInnerStyle={{ padding: '12px' }}
    >
      <Badge count={filters.length} size="small" offset={[8, 0]}>
        <Button icon={<FilterOutlined />}>分组过滤</Button>
      </Badge>
    </Popover>
  );
};
