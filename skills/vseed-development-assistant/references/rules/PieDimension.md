# PieDimension 约束

## 核心规则

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`color`、`detail`、`tooltip`、`label`、`row`、`column`
- **必须有 color**：至少一个 dimension 需要 `encoding: "color"` 定义扇区分组
- **无轴 encoding**：饼图**不支持** `xAxis`、`yAxis`
- **禁止 visible:false**：移除 dimension 应直接从数组删除

## 多维度处理

- 多个 `color` encoding 会产生笛卡尔积分组
- 饼图适合展示 5-7 个类别的占比关系

```json
[
  { "id": "category", "encoding": "color" },
  { "id": "subcategory", "encoding": "color" }
]
```
