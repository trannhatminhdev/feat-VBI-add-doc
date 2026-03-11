# Dimensions 通用约束

## 核心规则

- **id + encoding 唯一**：`id` + `encoding` 组合在整个 dimensions 数组和跨 dimensions/measures 必须唯一
- **同字段多 encoding 允许**：同一 `id` 可以使用不同 `encoding` 创建多个映射
- **禁止 visible:false**：移除 dimension 应直接删除，而非设置 `visible: false`

## 通用合法 encoding

- **空间定位**：`xAxis`、`yAxis`
- **视觉分组**：`color`
- **布局控制**：`row`、`column`（分面图）
- **附加通道**：`tooltip`、`label`、`detail`

## 禁止的 encoding

`size`、`radius`、`primaryYAxis`、`secondaryYAxis`、`x`、`y`（这些仅用于 measure 或无效）

## 各图表类型要求

| 图表类型         | 必须的 encoding   | 特殊说明      |
| ---------------- | ----------------- | ------------- |
| Line/Area/Column | `xAxis`           | 至少一个      |
| Bar              | `yAxis`           | 注意不是 "y"  |
| Pie/Donut/Funnel | `color`           | 定义分组      |
| Scatter          | `color`（可选）   | 无轴 encoding |
| Radar/Rose       | `angle`           | 定义辐射轴    |
| Heatmap          | `xAxis` + `yAxis` | 必须同时有    |
