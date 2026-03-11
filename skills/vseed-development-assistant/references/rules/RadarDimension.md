# RadarDimension 约束

## 核心规则

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`angle`、`color`、`detail`、`tooltip`、`label`、`row`、`column`
- **必须有 angle**：至少一个 dimension 需要 `encoding: "angle"` 定义雷达图辐射轴
- **禁止轴 encoding**：**不支持** `xAxis`、`yAxis`、`radius`、`size`

## 多维度处理

- `angle` encoding 定义雷达图的各个维度轴
- `color` encoding 创建多个雷达系列用于对比

```json
[
  { "id": "metric", "encoding": "angle" },
  { "id": "team", "encoding": "color" }
]
```

建议雷达图保持 3-8 个角度维度以保证可读性。
