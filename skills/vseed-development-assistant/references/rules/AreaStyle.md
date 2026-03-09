# AreaStyle 约束

## selector 规则

- **field 必须存在**：`field` 必须是 dataset 中存在的字段 id，或特殊标记 `__Dim_ColorId__`
- **value 必须匹配**：`value` 必须与 field 的数据类型和实际值匹配
  - 离散字段：使用数据中存在的分类值
  - 数值字段：使用合理的数值或范围

## **Dim_ColorId** 特殊用法

当 `field` 为 `__Dim_ColorId__` 时，用于引用视觉颜色通道：

- `value` 必须是现有 measure 的 `id`
- 仅支持 `=`、`in`、`not in` 操作符
