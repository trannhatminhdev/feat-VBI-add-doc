# TableDimension 约束

## 核心规则

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **仅支持 row/column encoding**：只能使用 `encoding: 'row'` 或 `encoding: 'column'`
- **无视觉 encoding**：表格**不支持** `color`、`tooltip`、`label`、`detail` 等视觉 encoding

## 禁止的 encoding

`xAxis`、`yAxis`、`angle`、`radius`、`size`、`color`、`detail`、`tooltip`、`label`

## TableDimension vs DimensionTree

- **扁平结构**：直接使用 TableDimension 数组
- **层级分组**：使用 DimensionTree（带 `children` 属性）创建表头分组

```json
// 扁平结构
{ "dimensions": [
  { "id": "region", "encoding": "row" },
  { "id": "product", "encoding": "row" }
]}

// 层级结构（用 DimensionTree）
{ "dimensions": [{
  "id": "地理位置",
  "children": [
    { "id": "region", "encoding": "row" },
    { "id": "city", "encoding": "row" }
  ]
}]}
```
