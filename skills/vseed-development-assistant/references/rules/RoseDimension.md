# RoseDimension 约束

## 核心规则

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`angle`、`color`、`detail`、`tooltip`、`label`、`row`、`column`
- **必须有 angle**：至少一个 dimension 需要 `encoding: "angle"` 定义扇区角度
- **禁止轴 encoding**：**不支持** `xAxis`、`yAxis`、`radius`、`size`
