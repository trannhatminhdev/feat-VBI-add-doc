# BarMeasure 约束

## 核心规则

- **禁止修改 ID**：measure 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`xAxis`、`detail`、`color`、`label`、`tooltip`
- **禁止非法 encoding**：不能使用 `yAxis`、`angle`、`radius`、`size`

## 渐变色实现

正确方式：创建**两个同 id 的 measure**，分别映射不同 encoding：

```json
{
  "color": { "linearColorScheme": ["#eff3ff", "#3182bd"] },
  "measures": [
    { "id": "sales", "encoding": "xAxis" },
    { "id": "sales", "encoding": "color" }
  ]
}
```

## 与 Column 图区别

- Bar 图（横向）：measure 映射到 xAxis
- Column 图（竖向）：measure 映射到 yAxis
