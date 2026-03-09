# ScatterMeasure 约束

## 核心规则

- **禁止修改 ID**：measure 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`xAxis`、`yAxis`、`size`、`color`、`detail`、`label`、`tooltip`
- **需要双轴**：散点图通常需要 x 和 y 两个 measure 定义点的位置
- **x 轴字段**：对应 `measures` 数组中的第一个字段

## 渐变色 / 气泡大小

```json
{
  "measures": [
    { "id": "x_value", "encoding": "xAxis" },
    { "id": "y_value", "encoding": "yAxis" },
    { "id": "amount", "encoding": "size" },
    { "id": "amount", "encoding": "color" }
  ]
}
```
