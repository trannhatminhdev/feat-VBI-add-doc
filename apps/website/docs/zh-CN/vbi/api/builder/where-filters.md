# whereFilters

Where 过滤构建器，用于添加、修改、删除行级过滤条件。Where 过滤在数据查询前生效，用于筛选原始数据

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| **dsl** | `Y.Map<any>` | - |
| **doc** | `Y.Doc` | - |
## 方法

### constructor

**定义**:

```typescript
constructor(doc: Y.Doc, dsl: Y.Map<any>)
```

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `doc` | Y.Doc | - |
| `dsl` | Y.Map<any> | - |



### add

添加一个 Where 过滤条件

**定义**:

```typescript
add(field: string, callback: (node: WhereFilterNodeBuilder) => void): WhereFiltersBuilder
```

**返回**: `WhereFiltersBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | string | - 字段名 |
| `callback` | (node: WhereFilterNodeBuilder) => void | - 回调函数 |



### update

更新指定字段的过滤条件

**定义**:

```typescript
update(field: string, callback: (node: WhereFilterNodeBuilder) => void): WhereFiltersBuilder
```

**返回**: `WhereFiltersBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | string | - 字段名 |
| `callback` | (node: WhereFilterNodeBuilder) => void | - 回调函数 |



### remove

删除指定字段的过滤条件

**定义**:

```typescript
remove(field: string): WhereFiltersBuilder
```

**返回**: `WhereFiltersBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | string | - 字段名 |



### find

根据字段名查找过滤条件

**定义**:

```typescript
find(field: string): WhereFilterNodeBuilder | undefined
```

**返回**: `WhereFilterNodeBuilder | undefined`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | string | - 字段名 |



### findAll

获取所有 Where 过滤条件

**定义**:

```typescript
findAll(): WhereFilterNodeBuilder[]
```

**返回**: `WhereFilterNodeBuilder[]`



### clear

清空所有 Where 过滤条件

**定义**:

```typescript
clear()
```



### toJson

导出所有 Where 过滤条件为 JSON 数组

**定义**:

```typescript
toJson(): VBIFilter[]
```

**返回**: `VBIFilter[]`



### observe

监听过滤条件变化

**定义**:

```typescript
observe(callback: ObserveCallback): () => void
```

**返回**: `() => void`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `callback` | ObserveCallback | - 回调函数 |

