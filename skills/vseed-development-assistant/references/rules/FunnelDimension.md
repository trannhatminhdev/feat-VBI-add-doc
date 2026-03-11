# FunnelDimension 约束

## 核心规则

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`color`、`detail`、`tooltip`、`label`、`row`、`column`
- **仅支持单个 color dimension**：漏斗图**只能有一个** dimension 使用 `encoding: "color"`
- **无轴 encoding**：**不支持** `xAxis`、`yAxis`

## 正确示例

```json
[{ "id": "conversion_stage", "encoding": "color" }]
```

确保 dimension 值代表有序的漏斗阶段（如 "认知"、"兴趣"、"决策"、"行动"）。
