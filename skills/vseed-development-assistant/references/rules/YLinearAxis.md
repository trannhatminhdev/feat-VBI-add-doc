# YLinearAxis 约束

## 核心规则

- **不支持字段格式化**：yAxis 配置**不支持** `formatter`、`format`、`suffix`、`prefix` 等属性
- **字段格式化替代方案**：如需格式化字段值，使用 `fieldFormatMap` 而非 yAxis 配置

## 可用属性

仅支持类型定义中的属性：`visible`、`min`、`max`、`log`、`logBase`、`nice`、`inverse`、`zero`、`label`、`line`、`tick`、`title`、`grid`

## min/max 设置建议

- `min` 应小于 y 轴字段数据的最小值
- `max` 应大于 y 轴字段数据的最大值
- 避免设置会排除数据点的范围
