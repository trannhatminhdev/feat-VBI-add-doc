# BarParallelDimension 约束

与 BarDimension 规则相同，特点是**并排布局**用于对比：

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`yAxis`、`color`、`detail`、`tooltip`、`label`、`row`、`column`
- **必须有 yAxis**：至少一个 dimension 需要 `encoding: "yAxis"`
