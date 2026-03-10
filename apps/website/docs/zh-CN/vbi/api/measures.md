# measures

度量构建器，用于添加、修改、删除度量配置。度量是数据的数值字段，如：销售额、利润、数量

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

添加一个度量

**定义**:

```typescript
add(field: string, callback: (node: MeasureNodeBuilder) => void): MeasuresBuilder
```

**返回**: `MeasuresBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | string | - 字段名 |
| `callback` | (node: MeasureNodeBuilder) => void | - 回调函数 |

### remove

删除指定字段的度量

**定义**:

```typescript
remove(field: VBIMeasure['field']): MeasuresBuilder
```

**返回**: `MeasuresBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | VBIMeasure['field'] | - 字段名 |

### update

更新度量配置

**定义**:

```typescript
update(field: string, callback: (node: MeasureNodeBuilder) => void): MeasuresBuilder
```

**返回**: `MeasuresBuilder`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | string | - 字段名 |
| `callback` | (node: MeasureNodeBuilder) => void | - 回调函数 |

### find

根据字段名查找度量

**定义**:

```typescript
find(field: VBIMeasure['field']): MeasureNodeBuilder | undefined
```

**返回**: `MeasureNodeBuilder \| undefined`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `field` | VBIMeasure['field'] | - 字段名 |

### findAll

获取所有度量

**定义**:

```typescript
findAll(): MeasureNodeBuilder[]
```

**返回**: `MeasureNodeBuilder[]`

### toJson

导出所有度量为 JSON 数组

**定义**:

```typescript
toJson(): VBIMeasure[]
```

**返回**: `VBIMeasure[]`

### observe

监听度量变化

**定义**:

```typescript
observe(callback: ObserveCallback): () => void
```

**返回**: `() => void`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `callback` | ObserveCallback | - 回调函数 |

### static isMeasureNode

**定义**:

```typescript
static isMeasureNode(node: VBIMeasureTree[0]): node is VBIMeasure
```

**返回**: `node is VBIMeasure`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `node` | VBIMeasureTree[0] | - |

### static isMeasureGroup

**定义**:

```typescript
static isMeasureGroup(node: VBIMeasureTree[0]): node is VBIMeasureGroup
```

**返回**: `node is VBIMeasureGroup`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `node` | VBIMeasureTree[0] | - |