# DualAxisDimension 约束

## 核心规则

- **禁止修改 ID**：dimension 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`xAxis`、`color`、`detail`、`tooltip`、`label`、`row`、`column`
- **必须有 xAxis**：至少一个 dimension 需要 `encoding: "xAxis"`
- **禁止 yAxis encoding**：dimension **不支持** `yAxis`（双轴图有两个 y 轴，由 measure 的 primaryYAxis/secondaryYAxis 控制）

## 特点

- 双轴图的两个 y 轴共享同一个 x 轴 dimension
- 适合对比不同量纲或单位的两组 measure
