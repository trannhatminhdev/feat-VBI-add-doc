# ColumnDimension 约束

## 核心规则

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`xAxis`、`color`、`detail`、`tooltip`、`label`、`row`、`column`
- **必须有 xAxis**：至少一个 dimension 需要 `encoding: "xAxis"`
- **禁止 visible:false**：移除 dimension 应直接从数组删除，而非设置 `visible: false`
- **禁止重复**：同一 `id + encoding` 组合不能重复

## 多维度处理

- 支持多个 dimension 使用相同 encoding
- 多个 `color` encoding 会产生笛卡尔积分组
- 同一字段可同时用于 `xAxis` 和 `color`

## 与 Bar 图区别

- Column 图（竖向）：dimension 映射到 xAxis
- Bar 图（横向）：dimension 映射到 yAxis
