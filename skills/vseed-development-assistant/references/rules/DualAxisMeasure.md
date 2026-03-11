# DualAxisMeasure 约束

## 核心规则

- **禁止修改 ID**：measure 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`primaryYAxis`、`secondaryYAxis`、`detail`、`color`、`label`、`tooltip`
- **禁止非法 encoding**：不能使用 `yAxis`、`xAxis`

## 双轴分配

- `primaryYAxis`：主 y 轴（左侧）
- `secondaryYAxis`：副 y 轴（右侧）

## chartType 属性

双轴图的 measure 可以指定展示形式：

```json
[
  { "id": "sales", "encoding": "primaryYAxis", "chartType": "column" },
  { "id": "growth_rate", "encoding": "secondaryYAxis", "chartType": "line" }
]
```

支持的 chartType：`line`、`column`、`columnParallel`、`area`、`scatter`
