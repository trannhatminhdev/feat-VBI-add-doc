# DimensionTree 约束（仅限 Table 图表）

## 适用范围

- **仅用于 `chartType: 'table'`**
- 其他图表类型使用扁平的 `Dimensions` 数组

## 核心规则

- **叶节点 ID 必须匹配 dataset 字段**：`TableDimension` 叶节点的 `id` 必须与 dataset 字段名一致
- **非叶节点 ID 灵活**：`DimensionGroup` 的 `id` 仅需在树内唯一
- **仅支持 row/column encoding**：`TableDimension` 只能使用 `encoding: 'row'` 或 `encoding: 'column'`

## 禁止的 encoding

`xAxis`、`yAxis`、`angle`、`color`、`detail`、`tooltip`、`label` 在 DimensionTree 中无效

## 结构示例

```json
{
  "id": "时间维度",
  "children": [
    { "id": "year", "encoding": "column" },
    { "id": "month", "encoding": "column" }
  ]
}
```

`DimensionGroup` 的 alias 影响表头分组显示。
