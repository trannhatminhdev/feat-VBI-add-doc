# havingFilters

Having 过滤构建器，用于添加、修改、删除分组后过滤条件。Having 过滤在数据聚合后生效，用于筛选分组结果

## 属性

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

### getRoot

**定义**:

```typescript
getRoot(): Y.Map<any>
```

**返回**: `Y.Map<any>`

### getConditions

**定义**:

```typescript
getConditions(): Y.Array<any>
```

**返回**: `Y.Array<any>`

### add

添加一个 Having 过滤条件

**定义**:

```typescript
add(field: string, callback: (node: HavingFiltersNodeBuilder) => void): HavingFiltersBuilder
```

**返回**: `HavingFiltersBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | string | - 字段名 |
| `callback` | (node: HavingFiltersNodeBuilder) => void | - 回调函数 |

### addGroup

添加一个 Having 分组

**定义**:

```typescript
addGroup(op: 'and' | 'or', callback: (group: HavingGroupBuilder) => void): HavingFiltersBuilder
```

**返回**: `HavingFiltersBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `op` | 'and' \| 'or' | - 逻辑操作符 |
| `callback` | (group: HavingGroupBuilder) => void | - 回调函数 |

### update

更新指定 ID 的过滤条件

**定义**:

```typescript
update(id: string, callback: (node: HavingFiltersNodeBuilder) => void): HavingFiltersBuilder
```

**返回**: `HavingFiltersBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | - 过滤条件 ID |
| `callback` | (node: HavingFiltersNodeBuilder) => void | - 回调函数 |

### updateGroup

更新指定 ID 的分组

**定义**:

```typescript
updateGroup(id: string, callback: (group: HavingGroupBuilder) => void): HavingFiltersBuilder
```

**返回**: `HavingFiltersBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | - 分组 ID |
| `callback` | (group: HavingGroupBuilder) => void | - 回调函数 |

### remove

删除指定 ID 的条件或指定索引的项

**定义**:

```typescript
remove(idOrIndex: string | number): HavingFiltersBuilder
```

**返回**: `HavingFiltersBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `idOrIndex` | string \| number | - ID 或索引 |

### find

根据 ID 查找条件（过滤或分组）

**定义**:

```typescript
find(id: string): HavingFiltersNodeBuilder | HavingGroupBuilder | undefined
```

**返回**: `HavingFiltersNodeBuilder \| HavingGroupBuilder \| undefined`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | - ID |

### clear

清空所有 Having 过滤条件

**定义**:

```typescript
clear()
```

### toJson

导出所有 Having 过滤条件为 JSON 数组

**定义**:

```typescript
toJson(): VBIHavingClause[]
```

**返回**: `VBIHavingClause[]`

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

### static isGroup

判断是否为分组节点

**定义**:

```typescript
static isGroup(yMap: Y.Map<any>): boolean
```

**返回**: `boolean`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `yMap` | Y.Map<any> | - |

### static isNode

判断是否为叶子节点

**定义**:

```typescript
static isNode(yMap: Y.Map<any>): boolean
```

**返回**: `boolean`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `yMap` | Y.Map<any> | - |