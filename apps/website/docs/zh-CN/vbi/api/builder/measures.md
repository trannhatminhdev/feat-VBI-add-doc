# measures

度量构建器，用于添加、修改、删除度量配置

## 构造函数

```typescript
new measures(doc: Y.Doc)
```

## 属性

## 方法

### add

度量构建器 - 用于构建和管理图表度量

**定义**:

```typescript
add(field: string): MeasureNodeBuilder
```

**返回**: `MeasureNodeBuilder`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | string |

### remove

删除指定字段的度量

**定义**:

```typescript
remove(field: VBIMeasure['field']): any
```

**返回**: `any`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | VBIMeasure['field'] |

### rename

重命名度量的显示名称

**定义**:

```typescript
rename(field: string, newAlias: string): void
```

**返回**: `void`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | string |
| `newAlias` | string |

### aggregate

更新度量使用的聚合函数（sum/avg/count/max/min/quantile）

**定义**:

```typescript
aggregate(field: string, func: string, quantile?: number): void
```

**返回**: `void`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | string |
| `func` | string |
| `quantile?` | number |

### encoding

更新度量的图表编码位置（yAxis/xAxis/color 等）

**定义**:

```typescript
encoding(field: string, encoding: VBIMeasure['encoding']): void
```

**返回**: `void`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | string |
| `encoding` | VBIMeasure['encoding'] |

### update

更新度量配置

**定义**:

```typescript
update(field: string, updates: Partial<Omit<VBIMeasure, 'field'>>): void
```

**返回**: `void`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | string |
| `updates` | Partial<Omit<VBIMeasure, 'field'>> |

### find

根据字段名查找度量

**定义**:

```typescript
find(field: VBIMeasure['field']): VBIMeasure | undefined
```

**返回**: `VBIMeasure | undefined`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | VBIMeasure['field'] |

### findAll

获取所有度量

**定义**:

```typescript
findAll(): VBIMeasure[]
```

**返回**: `VBIMeasure[]`

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
observe(callback: ObserveCallback): any
```

**返回**: `any`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `callback` | ObserveCallback |

### unobserve

取消监听度量变化

**定义**:

```typescript
unobserve(callback: ObserveCallback): any
```

**返回**: `any`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `callback` | ObserveCallback |

### isMeasureNode

**定义**:

```typescript
isMeasureNode(node: VBIMeasureTree[0]): node is VBIMeasure
```

**返回**: `node is VBIMeasure`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `node` | VBIMeasureTree[0] |

### isMeasureGroup

**定义**:

```typescript
isMeasureGroup(node: VBIMeasureTree[0]): node is VBIMeasureGroup
```

**返回**: `node is VBIMeasureGroup`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `node` | VBIMeasureTree[0] |

