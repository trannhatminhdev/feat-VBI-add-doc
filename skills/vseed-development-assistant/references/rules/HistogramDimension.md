# HistogramDimension 约束

## 核心规则

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`xAxis`、`color`、`detail`、`tooltip`、`label`、`row`、`column`
- **必须有 xAxis**：至少一个 dimension 需要 `encoding: "xAxis"` 定义分箱区间
- **禁止 visible:false**：移除 dimension 应直接从数组删除
