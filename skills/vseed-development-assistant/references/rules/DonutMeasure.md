# DonutMeasure 约束

与 PieMeasure 规则相同：

- **禁止修改 ID**：measure 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`angle`、`detail`、`label`、`tooltip`
- **禁止 radius encoding**：**不能**使用 `encoding: "radius"`

## 多 Measure 处理

必须为所有 measure 设置不同的 `parentId` 创建子图。
