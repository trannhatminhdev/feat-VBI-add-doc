# ColumnMeasure 约束

## 核心规则

- **禁止修改 ID**：measure 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`yAxis`、`detail`、`color`、`label`、`tooltip`
- **禁止非法 encoding**：不能使用 `xAxis`、`angle`、`radius`、`size`、`primaryYAxis`、`secondaryYAxis`

## 渐变色实现

正确方式：创建**两个同 id 的 measure**，分别映射不同 encoding：

```json
{
  "color": { "linearColorScheme": ["#eff3ff", "#3182bd"] },
  "measures": [
    { "id": "sales", "encoding": "yAxis" },
    { "id": "sales", "encoding": "color" }
  ]
}
```

**禁止**在 measure 对象上直接添加 `color`、`gradient` 等属性。

## 数值格式化

支持 `numFormat` 配置：

```json
{
  "id": "revenue",
  "encoding": "yAxis",
  "numFormat": {
    "type": "number",
    "ratio": 10000,
    "symbol": "万",
    "fractionDigits": 1
  }
}
```

## parentId 用法

多系列分组时使用 `parentId` 组织 measure：

```json
[
  { "id": "q1_sales", "encoding": "yAxis", "parentId": "quarterly" },
  { "id": "q2_sales", "encoding": "yAxis", "parentId": "quarterly" }
]
```
