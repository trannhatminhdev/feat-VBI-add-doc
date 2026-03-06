# Measure 通用约束

## 核心规则

- **禁止修改 ID**：measure 的 `id` 必须与 dataset 字段名一致
- **允许格式化**：可修改 `alias`、`numFormat`/`format` 等格式化属性
- **允许添加 color encoding**：可创建同 id 的新 measure 用于渐变色映射

## 渐变色实现（通用模式）

创建**同 id 的两个 measure**，分别映射到主 encoding 和 `color`：

```json
{
  "color": { "linearColorScheme": ["red", "green"] },
  "measures": [
    { "id": "count", "alias": "数量", "encoding": "yAxis" },
    { "id": "count", "alias": "数量", "encoding": "color" }
  ]
}
```

**禁止**在 measure 对象上添加 `color`、`gradient` 等属性。

## Pie/Donut 多 Measure 规则

添加多个 measure 时，**必须**为所有 measure 设置不同的 `parentId`：

```json
[
  { "id": "sales", "encoding": "angle", "parentId": "sales_group" },
  { "id": "profit", "encoding": "angle", "parentId": "profit_group" }
]
```
