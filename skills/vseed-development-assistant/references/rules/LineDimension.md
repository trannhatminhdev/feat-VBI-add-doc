# LineDimension 约束

## 核心规则

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`xAxis`、`color`、`detail`、`tooltip`、`label`、`row`、`column`
- **必须有 xAxis**：至少一个 dimension 需要 `encoding: "xAxis"`
- **禁止 visible:false**：移除 dimension 应直接从数组删除
- **禁止重复**：同一 `id + encoding` 组合不能重复

## 多维度处理

- 多个 `color` encoding 创建多条折线系列（笛卡尔积分组）
- 适合时序数据展示趋势变化

```json
[
  { "id": "date", "encoding": "xAxis" },
  { "id": "region", "encoding": "color" },
  { "id": "product_line", "encoding": "color" }
]
```
