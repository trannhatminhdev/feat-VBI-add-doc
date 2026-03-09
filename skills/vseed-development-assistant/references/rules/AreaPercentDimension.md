# AreaPercentDimension 约束

与 AreaDimension 规则相同，特点是**百分比堆叠**显示占比关系：

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`xAxis`、`color`、`detail`、`tooltip`、`label`、`row`、`column`
- **必须有 xAxis**：至少一个 dimension 需要 `encoding: "xAxis"`
