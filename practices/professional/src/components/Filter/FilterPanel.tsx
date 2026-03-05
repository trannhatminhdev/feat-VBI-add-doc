import React, { useState } from 'react';
import { Select, Input, Button, Space, Card, Modal, Form, List, Typography, Tooltip, Radio, InputNumber } from 'antd';
import { FilterOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, EyeInvisibleOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

export interface FilterItem {
  id: string;
  name: string;
  field: string;
  operator: string;
  value: any;
  isActive: boolean;
  actionType?: 'filter' | 'sort';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface FilterField {
  name: string;
  role: 'dimension' | 'measure';
}

interface FilterPanelProps {
  fields: FilterField[]; // 可供筛选的字段列表
  activeFields?: string[]; // 正在使用的字段
  filters: FilterItem[];
  onChange: (filters: FilterItem[]) => void;
}

const DIMENSION_OPERATORS = [
  { label: '包含 (in)', value: 'in' },
  { label: '不包含 (not in)', value: 'not in' },
];

const MEASURE_OPERATORS = [
  { label: '等于 (=)', value: '=' },
  { label: '不等于 (!=)', value: '!=' },
  { label: '大于 (>)', value: '>' },
  { label: '大于等于 (>=)', value: '>=' },
  { label: '小于 (<)', value: '<' },
  { label: '小于等于 (<=)', value: '<=' },
  { label: '范围 (between)', value: 'between' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({ fields, activeFields = [], filters = [], onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form] = Form.useForm();

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

  const selectedRole = Form.useWatch('role', form);
  const actionType = Form.useWatch('actionType', form);
  const operator = Form.useWatch('operator', form);
  const selectedField = Form.useWatch('field', form);
  const displayFields = React.useMemo(() => {
    return sortedFields.filter(f => f.role === selectedRole);
  }, [sortedFields, selectedRole]);

  const availableOperators = React.useMemo(() => {
    return selectedRole === 'measure' ? MEASURE_OPERATORS : DIMENSION_OPERATORS;
  }, [selectedRole]);

  React.useEffect(() => {
    if (isModalOpen) {
      const currentOperator = form.getFieldValue('operator');
      if (currentOperator && !availableOperators.find(op => op.value === currentOperator)) {
        form.setFieldValue('operator', availableOperators[0]?.value);
      }
    }
  }, [selectedRole, availableOperators, form, isModalOpen]);

  React.useEffect(() => {
    if (isModalOpen && operator) {
      const currentValue = form.getFieldValue('value');
      if (operator === 'between') {
        if (typeof currentValue !== 'object' || Array.isArray(currentValue) || currentValue === null) {
          form.setFieldValue('value', { leftOp: '<=', rightOp: '<=' });
        }
      } else {
        if (typeof currentValue === 'object' && !Array.isArray(currentValue) && currentValue !== null) {
          form.setFieldValue('value', undefined);
        }
      }
    }
  }, [operator, isModalOpen, form]);

  React.useEffect(() => {
    const handleFilterError = (e: any) => {
      const lastFilter = e.detail;
      if (lastFilter) {
        // Find role based on field
        const fieldRole = fields.find(f => f.name === lastFilter.field)?.role || 'dimension';
        const value = lastFilter.operator === 'between' 
          ? lastFilter.value 
          : Array.isArray(lastFilter.value) ? lastFilter.value.join(',') : lastFilter.value;
        form.setFieldsValue({
          role: fieldRole,
          name: lastFilter.name,
          field: lastFilter.field,
          operator: lastFilter.operator,
          value: value,
          actionType: lastFilter.actionType || 'filter',
          sortOrder: lastFilter.sortOrder || 'desc',
          limit: lastFilter.limit,
        });
      }
      setIsModalOpen(true);
    };

    window.addEventListener('vbi-filter-error', handleFilterError);
    return () => window.removeEventListener('vbi-filter-error', handleFilterError);
  }, [form, fields]);

  const handleAddClick = () => {
    setEditingIndex(null);
    form.resetFields();
    form.setFieldsValue({ role: 'dimension', operator: 'in', actionType: 'filter', sortOrder: 'desc' });
    setIsModalOpen(true);
  };

  const handleEdit = (index: number) => {
    const item = filters[index];
    const value = item.operator === 'between'
      ? item.value
      : Array.isArray(item.value) ? item.value.join(',') : item.value;
    const fieldRole = fields.find(f => f.name === item.field)?.role || 'dimension';
    setEditingIndex(index);
    form.setFieldsValue({
      role: fieldRole,
      name: item.name,
      field: item.field,
      operator: item.operator,
      value: value,
      actionType: item.actionType || 'filter',
      sortOrder: item.sortOrder || 'desc',
      limit: item.limit,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const { name, field, operator, value, actionType, sortOrder, limit } = values;
      const finalValue = (operator === 'in' || operator === 'not in' || operator === '=' || operator === '!=') && typeof value === 'string' 
        ? value.split(',').map((v: string) => v.trim()) 
        : value;
      
      if (editingIndex !== null) {
        const newFilters = [...filters];
        newFilters[editingIndex] = {
          ...newFilters[editingIndex],
          name: name,
          field,
          operator,
          value: finalValue,
          actionType: actionType === 'sort' ? 'sort' : 'filter',
          sortOrder: actionType === 'sort' ? sortOrder : undefined,
          limit: actionType === 'sort' ? limit : undefined,
        };
        onChange(newFilters);
      } else {
        const newFilter: FilterItem = {
          id: Date.now().toString(),
          name: name,
          field,
          operator,
          value: finalValue,
          isActive: true,
          actionType: actionType === 'sort' ? 'sort' : 'filter',
          sortOrder: actionType === 'sort' ? sortOrder : undefined,
          limit: actionType === 'sort' ? limit : undefined,
        };
        onChange([...filters, newFilter]);
      }
      
      setIsModalOpen(false);
      setEditingIndex(null);
      form.resetFields();
    });
  };

  const handleToggleActive = (index: number) => {
    const newFilters = [...filters];
    newFilters[index].isActive = !newFilters[index].isActive;
    onChange(newFilters);
  };

  const handleDelete = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    onChange(newFilters);
  };

  return (
    <Card 
      size="small" 
      title={<Space><FilterOutlined />数据筛选器</Space>}
      extra={<Button type="text" size="small" icon={<PlusOutlined />} onClick={handleAddClick} />}
      style={{ marginBottom: 0 }}
      styles={{
        body: {
          padding: '12px',
        },
      }}
    >
      {filters.length === 0 ? (
        <div style={{ color: '#999', fontSize: 12, textAlign: 'center', padding: '10px 0' }}>
          暂无筛选条件
        </div>
      ) : (
        <List
          size="small"
          dataSource={filters}
          renderItem={(item, index) => {
            return (
              <List.Item
                style={{ padding: '8px 0' }}
                actions={[
                  <Tooltip title="编辑" key="edit">
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<EditOutlined />} 
                      onClick={() => handleEdit(index)}
                      style={{ color: '#1890ff' }}
                    />
                  </Tooltip>,
                  <Tooltip title={item.isActive ? '停用' : '启用'} key="toggle">
                    <Button 
                      type="text" 
                      size="small" 
                      icon={item.isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />} 
                      onClick={() => handleToggleActive(index)}
                      style={{ color: item.isActive ? '#1890ff' : '#999' }}
                    />
                  </Tooltip>,
                  <Tooltip title="删除" key="delete">
                    <Button 
                      type="text" 
                      size="small" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleDelete(index)}
                    />
                  </Tooltip>
                ]}
              >
                <div style={{ display: 'flex', flexDirection: 'column', opacity: item.isActive ? 1 : 0.5, maxWidth: '140px' }}>
                  {(() => {
                    const displayLabel = item.actionType === 'sort' 
                      ? `排序: ${item.sortOrder === 'asc' ? '升序' : '降序'}${item.limit ? ` (Top ${item.limit})` : ''}`
                      : item.operator === 'between' && item.value
                        ? `${item.value.min ?? ''} ${item.value.leftOp ?? '<='} 变量 ${item.value.rightOp ?? '<='} ${item.value.max ?? ''}`
                        : `${item.operator} ${String(item.value)}`;
                    return (
                      <>
                        <Text style={{ fontSize: 13 }} ellipsis>
                          {item.name || `${item.field} ${displayLabel}`}
                        </Text>
                        {item.name && (
                          <Text style={{ fontSize: 11, color: '#888' }} ellipsis>
                            {item.field} {displayLabel}
                          </Text>
                        )}
                      </>
                    );
                  })()}
                </div>
              </List.Item>
            );
          }}
        />
      )}

      <Modal
        title={editingIndex !== null ? "编辑筛选器" : "新增筛选器"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => { setIsModalOpen(false); setEditingIndex(null); }}
        okText={editingIndex !== null ? "保存" : "添加"}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ operator: 'in', role: 'dimension', actionType: 'filter', sortOrder: 'desc' }}>
          <Form.Item label="字段类型" name="role">
            <Radio.Group optionType="button" onChange={(e) => {
              form.setFieldsValue({
                field: undefined,
                operator: e.target.value === 'measure' ? '=' : 'in',
                value: undefined,
                actionType: 'filter',
                sortOrder: 'desc',
                limit: undefined,
                name: undefined
              });
            }}>
              <Radio value="dimension">维度 (Dimension)</Radio>
              <Radio value="measure">度量 (Measure)</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item label="字段" name="field" rules={[{ required: true, message: '请选择字段' }]}>
            <Select placeholder="选择要筛选的字段" showSearch onChange={() => {
              form.setFieldsValue({
                actionType: 'filter',
                operator: selectedRole === 'measure' ? '=' : 'in',
                value: undefined,
                sortOrder: 'desc',
                limit: undefined,
                name: undefined
              });
            }}>
              {displayFields.map(f => {
                const isActive = activeFields.includes(f.name);
                return (
                  <Option key={f.name} value={f.name}>
                    <span style={isActive ? { color: '#e39700' , fontWeight: 'bold'} : {}}>
                      {f.name} {isActive ? '(推荐)' : ''}
                    </span>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          
          {selectedRole === 'measure' && (
            <Form.Item label="行为类型" name="actionType">
              <Radio.Group optionType="button" onChange={(e) => {
                form.setFieldsValue({
                  operator: selectedRole === 'measure' ? '=' : 'in',
                  value: undefined,
                  sortOrder: 'desc',
                  limit: undefined,
                  name: undefined
                });
              }}>
                <Radio value="filter">筛选</Radio>
                <Radio value="sort">排序</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          
          {actionType === 'sort' ? (
            <>
              <Form.Item label="排序方向" name="sortOrder" rules={[{ required: true }]}>
                <Radio.Group optionType="button" onChange={() => {
                  form.setFieldsValue({ limit: undefined, name: undefined });
                }}>
                  <Radio value="desc">降序 (DESC)</Radio>
                  <Radio value="asc">升序 (ASC)</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="截断数量 (Top N)" name="limit">
                <InputNumber min={1} placeholder="选填，例如: 10" style={{ width: '100%' }} />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item label="操作符" name="operator" rules={[{ required: true }]}>
                {selectedRole === 'dimension' ? (
                  <Radio.Group optionType="button" onChange={() => {
                    form.setFieldsValue({ value: undefined, name: undefined });
                  }}>
                    {availableOperators.map(op => (
                      <Radio key={op.value} value={op.value}>{op.label}</Radio>
                    ))}
                  </Radio.Group>
                ) : (
                  <Select onChange={() => {
                    form.setFieldsValue({ value: undefined, name: undefined });
                  }}>
                    {availableOperators.map(op => (
                      <Option key={op.value} value={op.value}>{op.label}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              {operator === 'between' ? (
                <Form.Item label="范围设置">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Form.Item name={['value', 'min']} noStyle>
                      <InputNumber placeholder="最小值" style={{ width: '80px' }} controls={false} />
                    </Form.Item>
                    <Form.Item name={['value', 'leftOp']} noStyle>
                      <Select style={{ width: '60px' }}>
                        <Option value="<">&lt;</Option>
                        <Option value="<=">&lt;=</Option>
                      </Select>
                    </Form.Item>
                    <Text ellipsis style={{ maxWidth: '80px', textAlign: 'center' }} title={selectedField || '变量'}>
                      {selectedField || '变量'}
                    </Text>
                    <Form.Item name={['value', 'rightOp']} noStyle>
                      <Select style={{ width: '60px' }}>
                        <Option value="<">&lt;</Option>
                        <Option value="<=">&lt;=</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name={['value', 'max']} noStyle>
                      <InputNumber placeholder="最大值" style={{ width: '80px' }} controls={false} />
                    </Form.Item>
                  </div>
                </Form.Item>
              ) : (
                <Form.Item label="筛选值" name="value" rules={[{ required: true, message: '请输入筛选值' }]}>
                  <Input placeholder={['in', 'not in', '=', '!='].includes(operator) ? "输入筛选值 (如需多选，请用英文逗号分隔)" : "输入筛选值"} />
                </Form.Item>
              )}
            </>
          )}
          <Form.Item label="名称" name="name">
            <Input placeholder=" (选填) 例：华东区客户" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};