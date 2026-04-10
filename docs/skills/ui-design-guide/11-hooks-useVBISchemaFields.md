# 11. useVBISchemaFields — 字段列表

## 签名

```ts
const {
  schemaFields, // VBISchemaField[]，字段列表（带 role/type 分类）
  fieldRoleMap, // Record<string, FieldRole>，字段名→角色映射
  fieldTypeMap, // Record<string, string>，字段名→类型映射
} = useVBISchemaFields(builder)
```

## 源码

`practices/standard/src/hooks/useVBISchemaFields.ts`

## VBISchemaField 类型

```ts
export interface VBISchemaField {
  name: string // 字段名，如 'sales'
  type: string // 字段类型，如 'number'、'string'、'date'
  role: FieldRole // 字段角色：'dimension' | 'measure' | 'unknown'
  isDate: boolean // 是否为日期类型
}
```

## 用法示例

### 获取字段列表并展示

```ts
const { schemaFields } = useVBISchemaFields(builder)

// 按角色分组展示
const dimensions = schemaFields.filter((f) => f.role === 'dimension')
const measures = schemaFields.filter((f) => f.role === 'measure')
```

### 快速查找字段角色

```ts
const { fieldRoleMap } = useVBISchemaFields(builder)

if (fieldRoleMap['sales'] === 'measure') {
  // sales 是度量字段
}
```

### 快速查找字段类型

```ts
const { fieldTypeMap } = useVBISchemaFields(builder)

console.log(fieldTypeMap['order_date']) // 'date'
console.log(fieldTypeMap['category']) // 'string'
console.log(fieldTypeMap['sales']) // 'number'
```

---

## 实现细节

- 字段数据通过 `builder.getSchema()` 异步获取，返回 `DatasetColumn[]`
- 字段角色由 `getFieldRoleBySchemaType(type)` 从 `src/utils/fieldRole.ts` 推导
- 日期类型由 `isDateSchemaType(type)` 判断，类型名包含 'date' 即为日期
- 异步 effect 带 `destroyed` 标志，防止组件卸载后状态更新

---

## 字段角色推导规则

| 字段类型 | 角色        | 示例                               |
| -------- | ----------- | ---------------------------------- |
| `number` | `measure`   | `sales`、`profit`、`amount`        |
| `string` | `dimension` | `category`、`city`、`product_name` |
| `date`   | `dimension` | `order_date`、`delivery_date`      |

---

## 注意事项

- `schemaFields` 是异步获取的，首次渲染可能为空数组
- `fieldRoleMap` 和 `fieldTypeMap` 由 `schemaFields` 派生，用于 O(1) 查找
- 字段角色仅用于 UI 分组展示，不限制实际使用方式
- 建议在 FieldsPanel 组件中展示，配合搜索和角色过滤功能
