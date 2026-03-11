# TableMeasure 约束

## 核心规则

- **禁止修改 ID**：measure 的 `id` 必须与 dataset 字段名一致
- **仅支持 column encoding**：只能使用 `encoding: 'column'`
- **无视觉 encoding**：表格**不支持** `color`、`tooltip`、`label`、`detail` 等视觉 encoding

## 禁止的 encoding

`primaryYAxis`、`secondaryYAxis`、`xAxis`、`yAxis`、`angle`、`radius`、`size`、`color`、`detail`、`label`、`tooltip`

## TableMeasure vs MeasureTree

- **扁平结构**：直接使用 TableMeasure 数组
- **层级分组**：使用 MeasureTree（带 `children` 属性）创建表头分组

```json
// 扁平结构
{ "measures": [
  { "id": "sales", "encoding": "column" },
  { "id": "profit", "encoding": "column" }
]}

// 层级结构（用 MeasureTree）
{ "measures": [{
  "id": "销售指标",
  "children": [
    { "id": "sales", "encoding": "column" },
    { "id": "profit", "encoding": "column" }
  ]
}]}
```
