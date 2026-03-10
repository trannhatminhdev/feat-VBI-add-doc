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



### addGroup

添加一个 Where 分组

**定义**:

```typescript
addGroup(op: 'and' | 'or', callback: (group: WhereGroupBuilder) => void): WhereFiltersBuilder
```

**返回**: `WhereFiltersBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `op` | 'and' | 'or' | - 逻辑操作符 |
| `callback` | (group: WhereGroupBuilder) => void | - 回调函数 |



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



### updateGroup

更新指定索引的分组

**定义**:

```typescript
updateGroup(index: number, callback: (group: WhereGroupBuilder) => void): WhereFiltersBuilder
```

**返回**: `WhereFiltersBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `index` | number | - 索引 |
| `callback` | (group: WhereGroupBuilder) => void | - 回调函数 |



### remove

删除指定字段的过滤条件或指定索引的项

**定义**:

```typescript
remove(fieldOrIndex: string | number): WhereFiltersBuilder
```

**返回**: `WhereFiltersBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `fieldOrIndex` | string | number | - 字段名或索引 |



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
toJson(): VBIWhereClause[]
```

**返回**: `VBIWhereClause[]`



### observe

监听过滤条件变化，返回取消监听的函数

**定义**:

```typescript
observe(callback: ObserveCallback): () => void
```

**返回**: `() => void`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `callback` | ObserveCallback | - 回调函数 |



### isGroup

判断是否为分组节点

**定义**:

```typescript
isGroup(yMap: Y.Map<any>): boolean
```

**返回**: `boolean`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `yMap` | Y.Map<any> | - |



### isNode

判断是否为叶子节点

**定义**:

```typescript
isNode(yMap: Y.Map<any>): boolean
```

**返回**: `boolean`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `yMap` | Y.Map<any> | - |

