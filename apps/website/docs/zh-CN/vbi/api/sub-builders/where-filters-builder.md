# WhereFiltersBuilder

Where 过滤构建器，用于添加、修改、删除行级过滤条件

## 构造函数

```typescript
new WhereFiltersBuilder(doc: Y.Doc)
```

## 属性

## 方法

### ~~getWhereFilters~~

> ⚠️ 已废弃

获取所有筛选条件

**签名**:

```typescript
getWhereFilters(): VBIFilter[]
```

**返回**: `VBIFilter[]`

### toJson

将当前所有筛选条件转换为 JSON 数组

**签名**:

```typescript
toJson(): VBIFilter[]
```

**返回**: `VBIFilter[]`

### addWhereFilter

**签名**:

```typescript
addWhereFilter(filter: VBIFilter)
```

**参数**:

- `filter`: VBIFilter

### updateWhereFilter

**签名**:

```typescript
updateWhereFilter(index: number, filter: Partial<VBIFilter>)
```

**参数**:

- `index`: number
- `filter`: Partial<VBIFilter>

### removeWhereFilter

**签名**:

```typescript
removeWhereFilter(index: number)
```

**参数**:

- `index`: number

### clearWhereFilters

**签名**:

```typescript
clearWhereFilters()
```

### observe

**签名**:

```typescript
observe(callback: ObserveCallback)
```

**参数**:

- `callback`: ObserveCallback

### unobserve

**签名**:

```typescript
unobserve(callback: ObserveCallback)
```

**参数**:

- `callback`: ObserveCallback

