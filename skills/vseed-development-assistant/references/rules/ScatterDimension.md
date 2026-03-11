# ScatterDimension 约束

## 核心规则

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`color`、`detail`、`tooltip`、`label`、`row`、`column`
- **无轴 encoding**：散点图 dimension **不支持** `xAxis`、`yAxis`（轴由 measure 驱动）
- **color 用于分组**：通过 `color` encoding 区分不同类别的点

## 多维度处理

- 所有 `color` encoding 的 dimension 通过笛卡尔积形成分组

```json
[
  { "id": "category", "encoding": "color" },
  { "id": "segment", "encoding": "color" }
]
```
