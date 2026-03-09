# dimensions

维度构建器，用于添加、修改、删除维度配置

## 构造函数

```typescript
new dimensions(doc: Y.Doc)
```

## 属性

## 方法

### add

维度构建器 - 用于构建和管理图表维度

**定义**:

```typescript
add(field: string): DimensionNodeBuilder
```

**返回**: `DimensionNodeBuilder`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | string |

### remove

删除指定字段的维度

**定义**:

```typescript
remove(field: VBIDimension['field']): any
```

**返回**: `any`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | VBIDimension['field'] |

### update

更新指定维度字段的配置

**定义**:

```typescript
update(field: string, updates: Partial<Omit<VBIDimension, 'field'>>): void
```

**返回**: `void`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | string |
| `updates` | Partial<Omit<VBIDimension, 'field'>> |

### find

根据字段名查找维度

**定义**:

```typescript
find(field: VBIDimension['field']): VBIDimension | undefined
```

**返回**: `VBIDimension | undefined`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | VBIDimension['field'] |

### findAll

获取所有维度

**定义**:

```typescript
findAll(): VBIDimension[]
```

**返回**: `VBIDimension[]`

### toJson

导出所有维度为 JSON 数组

**定义**:

```typescript
toJson(): VBIDimension[]
```

**返回**: `VBIDimension[]`

### observe

监听维度变化

**定义**:

```typescript
observe(callback: ObserveCallback): any
```

**返回**: `any`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `callback` | ObserveCallback |

### unobserve

取消监听维度变化

**定义**:

```typescript
unobserve(callback: ObserveCallback): any
```

**返回**: `any`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `callback` | ObserveCallback |

### isDimensionNode

**定义**:

```typescript
isDimensionNode(node: VBIDimensionTree[0]): node is VBIDimension
```

**返回**: `node is VBIDimension`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `node` | VBIDimensionTree[0] |

### isDimensionGroup

**定义**:

```typescript
isDimensionGroup(node: VBIDimensionTree[0]): node is VBIDimensionGroup
```

**返回**: `node is VBIDimensionGroup`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `node` | VBIDimensionTree[0] |

