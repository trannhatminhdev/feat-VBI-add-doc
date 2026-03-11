# Sort 约束

## 核心规则

- **customOrder 值必须匹配数据**：`customOrder` 中指定的所有值必须**精确匹配** dataset 中类别轴（dimension）字段的实际值
- **禁止使用不存在的值**：不要在 customOrder 中添加数据中不存在的值
