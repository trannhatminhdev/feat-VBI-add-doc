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
add(filter: VBIFilter): new Y.Map<any>()
```

**返回**: `new Y.Map<any>()`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `filter` | VBIFilter |

### update

更新指定索引的过滤条件

**定义**:

```typescript
update(index: number, filter: Partial<VBIFilter>): any
```

**返回**: `any`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `index` | number |
| `filter` | Partial<VBIFilter> |

### remove

删除指定索引的过滤条件

**定义**:

```typescript
remove(index: number): any
```

**返回**: `any`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `index` | number |

### find

根据索引查找过滤条件

**定义**:

```typescript
find(index: number): VBIFilter | undefined
```

**返回**: `VBIFilter | undefined`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `index` | number |

### findAll

获取所有 Where 过滤条件

**定义**:

```typescript
findAll(): VBIFilter[]
```

**返回**: `VBIFilter[]`

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

