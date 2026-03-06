# HeatmapMeasure 约束

## 核心规则

- **禁止修改 ID**：measure 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`color`、`detail`、`label`、`tooltip`
- **必须有 color**：热力图需要 `encoding: "color"` 来驱动单元格颜色
- **禁止非法 encoding**：不能使用 `xAxis`、`yAxis`、`angle`、`radius`、`size`
