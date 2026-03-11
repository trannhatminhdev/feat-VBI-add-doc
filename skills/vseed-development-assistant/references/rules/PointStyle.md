# PointStyle 约束

## selector 规则

- **field 必须存在**：`field` 必须是 dataset 中存在的字段 id
- **value 必须匹配**：`value` 必须与 field 的数据类型和实际值匹配
  - 离散字段：使用数据中存在的分类值
  - 数值字段：使用合理的数值或范围
