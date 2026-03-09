# PieMeasure 约束

## 核心规则

- **禁止修改 ID**：measure 的 `id` 必须与 dataset 字段名一致
- **合法 encoding**：`angle`、`detail`、`label`、`tooltip`
- **禁止 radius encoding**：饼图 measure **不能**使用 `encoding: "radius"`

## 多 Measure 处理

添加多个 measure 时，**必须**为所有 measure（包括已有的）设置不同的 `parentId` 创建子图：

```json
[
  { "id": "sales", "encoding": "angle", "parentId": "sales_group" },
  { "id": "profit", "encoding": "angle", "parentId": "profit_group" }
]
```

**错误示例**（缺少 parentId）：

```json
[
  { "id": "sales", "encoding": "angle" },
  { "id": "profit", "encoding": "angle" }
]
```
