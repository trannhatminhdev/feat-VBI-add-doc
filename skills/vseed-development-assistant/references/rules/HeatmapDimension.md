# HeatmapDimension 约束

## 核心规则

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`xAxis`、`yAxis`、`tooltip`、`label`、`row`、`column`
- **必须有双轴**：热力图**必须同时有** `xAxis` 和 `yAxis` 两个 dimension
- **禁止 color encoding**：热力图 dimension **不支持** `color`（颜色由 measure 值驱动）

## 正确示例

```json
[
  { "id": "day_of_week", "encoding": "xAxis" },
  { "id": "hour", "encoding": "yAxis" }
]
```

热力图适合展示两个维度交叉形成的矩阵数据。
