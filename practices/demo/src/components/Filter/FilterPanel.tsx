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
  InputNumber,
  Badge,
  Empty,
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
  DIMENSION_OPERATORS,
  MEASURE_OPERATORS,
  getDefaultWhereOperator,
  getWhereDisplayText,
  getWhereFilterFormValue,
  getWhereFilterInputStrategy,
  normalizeWhereOperator,
  normalizeWhereRangeValue,
  serializeWhereFilterValue,
} from './whereFilterUtils';

const { Option = Select.Option } = Select;
const { Text } = Typography;

export interface FilterItem {
  id?: string;
  field: string;
  operator: string;
  value: unknown;
}

export interface FilterField {
  name: string;
  role: 'dimension' | 'measure';
}

interface FilterPanelProps {
  fields: FilterField[];
  activeFields?: string[];
  filters: FilterItem[];
  onAdd?: (filter: FilterItem) => void;
  onRemove?: (id: string) => void;
  onClear?: () => void;
  onChange?: (filters: FilterItem[]) => void;
  onCancel?: () => void;
  embedded?: boolean;
  itemEdit?: boolean;
  open?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  fields,
  activeFields = [],
  filters = [],
  onAdd,
  onRemove,
  onClear,
  onChange,
  onCancel,
  embedded = false,
  itemEdit = false,
  open = false,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const containerRef = useRef<HTMLDivElement>(null);

  const operator = Form.useWatch('operator', form);
  const selectedField = Form.useWatch('field', form);
  const isSingleItemEdit = itemEdit && filters.length === 1;

  // 根据选择的字段自动判断类型
  const selectedFieldRole = selectedField
    ? (fields.find((f) => f.name === selectedField)?.role ?? 'dimension')
    : 'dimension';

  const availableOperators = React.useMemo(() => {
    return selectedFieldRole === 'measure'
      ? MEASURE_OPERATORS
      : DIMENSION_OPERATORS;
  }, [selectedFieldRole]);

  const inputStrategy = React.useMemo(() => {
    return getWhereFilterInputStrategy(operator, selectedFieldRole);
  }, [operator, selectedFieldRole]);

  // Reset form when opening/closing
  useEffect(() => {
    if (itemEdit) {
      return;
    }
    if (!popoverOpen) {
      setIsAdding(false);
      setEditingId(null);
      form.resetFields();
    }
  }, [popoverOpen, form, itemEdit]);

  // itemEdit 模式下，每次打开都从当前 builder 值回填表单
  useEffect(() => {
    if (!isSingleItemEdit || !open) {
      return;
    }

    const item = filters[0];
    form.setFieldsValue({
      field: item.field,
      operator: normalizeWhereOperator(item.operator),
      value: getWhereFilterFormValue(item.operator, item.value),
    });
  }, [isSingleItemEdit, open, filters, form]);

  // Update operator when role changes
  useEffect(() => {
    if (isAdding || editingId || (isSingleItemEdit && open)) {
      const currentOperator = normalizeWhereOperator(
        form.getFieldValue('operator'),
      );
      if (
        currentOperator &&
        !availableOperators.find((op) => op.value === currentOperator)
      ) {
        form.setFieldValue('operator', availableOperators[0]?.value);
      }
    }
  }, [availableOperators, form, isAdding, editingId, isSingleItemEdit, open]);

  // 按输入策略维护表单值形状
  useEffect(() => {
    if (isAdding || editingId || (isSingleItemEdit && open)) {
      const currentValue = form.getFieldValue('value');

      if (inputStrategy === 'none') {
        if (currentValue !== undefined) {
          form.setFieldValue('value', undefined);
        }
        return;
      }

      if (inputStrategy === 'range') {
        const normalizedRange = normalizeWhereRangeValue(currentValue);
        const changed =
          currentValue !== normalizedRange &&
          (!currentValue ||
            typeof currentValue !== 'object' ||
            Array.isArray(currentValue) ||
            currentValue.min !== normalizedRange.min ||
            currentValue.max !== normalizedRange.max ||
            currentValue.leftOp !== normalizedRange.leftOp ||
            currentValue.rightOp !== normalizedRange.rightOp);

        if (changed) {
          form.setFieldValue('value', normalizedRange);
        }
        return;
      }

      if (inputStrategy === 'tags') {
        if (!Array.isArray(currentValue)) {
          form.setFieldValue(
            'value',
            getWhereFilterFormValue(operator, currentValue),
          );
        }
        return;
      }

      if (Array.isArray(currentValue)) {
        form.setFieldValue('value', currentValue[0]);
        return;
      }

      if (typeof currentValue === 'object' && currentValue !== null) {
        form.setFieldValue('value', undefined);
      }
    }
  }, [
    form,
    inputStrategy,
    isAdding,
    editingId,
    isSingleItemEdit,
    open,
    operator,
  ]);

  const handleAddClick = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      operator: getDefaultWhereOperator('dimension'),
    });
    setIsAdding(true);
  };

  const handleEdit = (id: string) => {
    const item = filters.find((f) => f.id === id);
    if (!item) return;

    setEditingId(id);
    setIsAdding(false);
    form.setFieldsValue({
      field: item.field,
      operator: normalizeWhereOperator(item.operator),
      value: getWhereFilterFormValue(item.operator, item.value),
    });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { field, operator, value } = values;
      const fieldRole =
        fields.find((f) => f.name === field)?.role ??
        selectedFieldRole ??
        'dimension';
      const normalizedOperator = normalizeWhereOperator(operator);
      const finalValue = serializeWhereFilterValue({
        operator: normalizedOperator,
        fieldRole,
        value,
      });

      // 获取原有 filter 的 id（编辑模式）
      const existingFilter = isSingleItemEdit
        ? filters[0]
        : editingId
          ? filters.find((f) => f.id === editingId)
          : undefined;
      const newFilter: FilterItem = {
        id: existingFilter?.id,
        field,
        operator: normalizedOperator,
        value: finalValue,
      };

      if (editingId || isSingleItemEdit) {
        // 编辑模式：优先使用 onChange 回调
        if (onChange) {
          const newFilters = [...filters];
          const targetId = existingFilter?.id;
          const editIndex = newFilters.findIndex((f) => f.id === targetId);
          if (editIndex >= 0) {
            newFilters[editIndex] = { ...newFilters[editIndex], ...newFilter };
            onChange(newFilters);
          }
        } else if (onRemove) {
          // 兼容模式：先删除再添加
          if (existingFilter?.id) {
            onRemove(existingFilter.id);
          }
          onAdd?.(newFilter);
        }
      } else if (onChange) {
        // 添加模式：如果有 onChange 则使用全量更新
        onChange([...filters, newFilter]);
      } else if (onAdd) {
        onAdd(newFilter);
      }

      setIsAdding(false);
      setEditingId(null);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    form.resetFields();
    onCancel?.();
  };

  const handleDelete = (id: string) => {
    // 优先使用 onChange 回调
    if (onChange) {
      const newFilters = filters.filter((f) => f.id !== id);
      onChange(newFilters);
    } else if (onRemove) {
      onRemove(id);
    }
  };

  const handleClearAll = () => {
    // 优先使用 onChange 回调
    if (onChange) {
      onChange([]);
    } else if (onClear) {
      onClear();
    }
  };

  // Generate filter display text
  const getFilterDisplayText = (item: FilterItem) => {
    return getWhereDisplayText(item);
  };

  const renderFilterForm = () => (
    <Form
      form={form}
      layout="vertical"
      style={{ width: 260, marginTop: 8 }}
      initialValues={{
        operator: getDefaultWhereOperator('dimension'),
      }}
    >
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
          onChange={(fieldName) => {
            const nextFieldRole =
              fields.find((f) => f.name === fieldName)?.role ?? 'dimension';
            form.setFieldsValue({
              operator: getDefaultWhereOperator(nextFieldRole),
              value: undefined,
            });
          }}
        >
          {fields.map((f) => {
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
          {availableOperators.map((op) => (
            <Option key={op.value} value={op.value}>
              {op.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {inputStrategy === 'none' ? (
        <div style={{ color: '#999', fontSize: 12, padding: '8px 0' }}>
          此操作符不需要输入值
        </div>
      ) : inputStrategy === 'range' ? (
        <Form.Item label="范围" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Form.Item name={['value', 'min']} noStyle>
              {selectedFieldRole === 'measure' ? (
                <InputNumber
                  placeholder="最小"
                  size="small"
                  style={{ width: 60 }}
                  controls={false}
                />
              ) : (
                <Input placeholder="最小" size="small" style={{ width: 60 }} />
              )}
            </Form.Item>
            <Form.Item name={['value', 'leftOp']} noStyle>
              <Select size="small" style={{ width: 50 }}>
                <Option value="<">&lt;</Option>
                <Option value="<=">&lt;=</Option>
              </Select>
            </Form.Item>
            <Text ellipsis style={{ maxWidth: 60, fontSize: 12 }}>
              {selectedField || '?'}
            </Text>
            <Form.Item name={['value', 'rightOp']} noStyle>
              <Select size="small" style={{ width: 50 }}>
                <Option value="<">&lt;</Option>
                <Option value="<=">&lt;=</Option>
              </Select>
            </Form.Item>
            <Form.Item name={['value', 'max']} noStyle>
              {selectedFieldRole === 'measure' ? (
                <InputNumber
                  placeholder="最大"
                  size="small"
                  style={{ width: 60 }}
                  controls={false}
                />
              ) : (
                <Input placeholder="最大" size="small" style={{ width: 60 }} />
              )}
            </Form.Item>
          </div>
        </Form.Item>
      ) : inputStrategy === 'tags' ? (
        <Form.Item
          label="值"
          name="value"
          rules={[
            {
              validator: (_, value) => {
                if (Array.isArray(value) && value.length > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('请输入至少一个值'));
              },
            },
          ]}
          style={{ marginBottom: 8 }}
        >
          <Select
            mode="tags"
            size="small"
            tokenSeparators={[',']}
            placeholder={
              selectedFieldRole === 'measure'
                ? '输入数值后回车，可添加多个'
                : '输入值后回车，可添加多个'
            }
            style={{ width: '100%' }}
          />
        </Form.Item>
      ) : (
        <Form.Item
          label="值"
          name="value"
          rules={[
            {
              required: !['is null', 'is not null'].includes(operator ?? ''),
              message: '请输入值',
            },
          ]}
          style={{ marginBottom: 8 }}
        >
          {inputStrategy === 'number' ? (
            <InputNumber
              size="small"
              placeholder="输入数值"
              style={{ width: '100%' }}
              controls={false}
            />
          ) : (
            <Input size="small" placeholder="输入值" />
          )}
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
            {editingId || isSingleItemEdit ? '保存' : '添加'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const renderFilterList = () => (
    <div style={{ width: 280 }}>
      {filters.length === 0 && !isAdding ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无筛选条件"
          style={{ margin: '20px 0' }}
        />
      ) : (
        <div style={{ maxHeight: 200, overflow: 'auto' }}>
          {filters.map((item, index) => (
            <div
              key={item.id ?? `where-filter-${index}`}
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
                {getFilterDisplayText(item)}
              </Text>
              <Space size={2}>
                <Tooltip title="编辑">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => item.id && handleEdit(item.id)}
                    style={{ color: '#1890ff' }}
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

      {isAdding && renderFilterForm()}
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
          明细过滤 (Where)
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

      {renderFilterList()}
    </div>
  );

  // itemEdit 模式：只渲染单个 item 的编辑表单
  if (itemEdit && filters.length === 1) {
    return (
      <div ref={containerRef}>
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ fontSize: 13 }}>
            编辑过滤条件
          </Text>
        </div>
        {renderFilterForm()}
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
        <Button icon={<FilterOutlined />}>数据筛选</Button>
      </Badge>
    </Popover>
  );
};
