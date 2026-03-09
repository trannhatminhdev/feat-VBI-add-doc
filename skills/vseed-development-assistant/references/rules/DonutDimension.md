# DonutDimension 约束

与 PieDimension 规则相同：

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`color`、`detail`、`tooltip`、`label`、`row`、`column`
- **必须有 color**：至少一个 dimension 需要 `encoding: "color"` 定义扇区分组
- **无轴 encoding**：**不支持** `xAxis`、`yAxis`
