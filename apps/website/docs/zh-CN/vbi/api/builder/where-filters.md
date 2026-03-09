# whereFilters

Where 过滤构建器，用于添加、修改、删除行级过滤条件

## 构造函数

```typescript
new whereFilters(doc: Y.Doc)
```

## 属性

## 方法

### add

Where 过滤构建器 - 用于构建 SQL WHERE 条件

**定义**:

```typescript
add(field: string): WhereFilterNodeBuilder
```

**返回**: `WhereFilterNodeBuilder`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | string |

### remove

更新指定字段的过滤条件

**定义**:

```typescript
remove(field: string): boolean
```

**返回**: `boolean`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | string |

### find

根据字段名查找过滤条件

**定义**:

```typescript
find(field: string): WhereFilterNodeBuilder | undefined
```

**返回**: `WhereFilterNodeBuilder | undefined`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | string |

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
clear(): any
```

**返回**: `any`

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
observe(callback: ObserveCallback): any
```

**返回**: `any`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `callback` | ObserveCallback |

### unobserve

取消监听过滤条件变化

**定义**:

```typescript
unobserve(callback: ObserveCallback): any
```

**返回**: `any`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `callback` | ObserveCallback |

