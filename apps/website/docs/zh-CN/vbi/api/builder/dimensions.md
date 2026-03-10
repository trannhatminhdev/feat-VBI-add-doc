# dimensions

维度构建器，用于添加、修改、删除维度配置。维度是数据的分类字段，如：时间、地区、产品类别

## 属性

## 方法

### constructor

**定义**:

```typescript
constructor(_doc: Y.Doc, dsl: Y.Map<any>)
```

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `_doc` | Y.Doc | - |
| `dsl` | Y.Map<any> | - |

### add

添加一个维度

**定义**:

```typescript
add(field: string, callback: (node: DimensionNodeBuilder) => void): DimensionsBuilder
```

**返回**: `DimensionsBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | string | - 字段名 |
| `callback` | (node: DimensionNodeBuilder) => void | - 回调函数 |

### remove

删除指定字段的维度

**定义**:

```typescript
remove(field: VBIDimension['field']): DimensionsBuilder
```

**返回**: `DimensionsBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | VBIDimension['field'] | - 字段名 |

### update

更新指定维度字段的配置

**定义**:

```typescript
update(field: string, callback: (node: DimensionNodeBuilder) => void): DimensionsBuilder
```

**返回**: `DimensionsBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | string | - 字段名 |
| `callback` | (node: DimensionNodeBuilder) => void | - 回调函数 |

### find

根据字段名查找维度

**定义**:

```typescript
find(field: VBIDimension['field']): DimensionNodeBuilder | undefined
```

**返回**: `DimensionNodeBuilder \| undefined`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | VBIDimension['field'] | - 字段名 |

### findAll

获取所有维度

**定义**:

```typescript
findAll(): DimensionNodeBuilder[]
```

**返回**: `DimensionNodeBuilder[]`

### toJson

导出所有维度为 JSON 数组

**定义**:

```typescript
toJson(): VBIDimension[]
```

**返回**: `VBIDimension[]`

### observe

监听维度变化，返回取消监听的函数

**定义**:

```typescript
observe(callback: ObserveCallback): () => void
```

**返回**: `() => void`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `callback` | ObserveCallback | - 回调函数 |

### static isDimensionNode

**定义**:

```typescript
static isDimensionNode(node: VBIDimensionTree[0]): node is VBIDimension
```

**返回**: `node is VBIDimension`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `node` | VBIDimensionTree[0] | - |

### static isDimensionGroup

**定义**:

```typescript
static isDimensionGroup(node: VBIDimensionTree[0]): node is VBIDimensionGroup
```

**返回**: `node is VBIDimensionGroup`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `node` | VBIDimensionTree[0] | - |