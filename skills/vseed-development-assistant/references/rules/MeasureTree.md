# MeasureTree 约束（仅限 Table 图表）

## 适用范围

- **树结构仅用于 `chartType: 'table'`**
- 其他图表类型使用扁平的 `Measures` 数组

## 核心规则

- **叶节点 ID 必须匹配 dataset 字段**：`TableMeasure` 叶节点的 `id` 必须与 dataset 字段名一致
- **非叶节点 ID 灵活**：`MeasureGroup` 的 `id` 仅需在树内唯一
- **仅支持 column encoding**：`TableMeasure` 只能使用 `encoding: 'column'`

## 禁止的 encoding

`primaryYAxis`、`secondaryYAxis`、`xAxis`、`yAxis`、`angle`、`radius`、`size`、`color`、`detail`、`label`、`tooltip` 在 MeasureTree 中无效

## 结构示例

```json
{
  "id": "销售指标",
  "children": [
    { "id": "sales", "encoding": "column" },
    { "id": "profit", "encoding": "column" }
  ]
}
```

## 非 Table 图表

使用扁平 `Measures` 数组，Pie/Donut 多 measure 时用 `parentId` 创建子图（非树结构）。
