# WhereFiltersBuilder

Where 过滤构建器，用于添加、修改、删除行级过滤条件

## 构造函数

```typescript
new WhereFiltersBuilder(doc: Y.Doc)
```

## 属性

## 方法

### addWhereFilter

Where 过滤构建器 - 用于构建 SQL WHERE 条件

**签名**:

```typescript
addWhereFilter(filter: VBIFilter): const yMap = new Y.Map<any>()
```

**参数**:

- `filter`: VBIFilter

**返回**: `const yMap = new Y.Map<any>()`

### updateWhereFilter

**签名**:

```typescript
updateWhereFilter(index: number, filter: Partial<VBIFilter>): const whereFilters = this.dsl.get('whereFilters')
```

**参数**:

- `index`: number
- `filter`: Partial<VBIFilter>

**返回**: `const whereFilters = this.dsl.get('whereFilters')`

### removeWhereFilter

**签名**:

```typescript
removeWhereFilter(index: number): const whereFilters = this.dsl.get('whereFilters')
```

**参数**:

- `index`: number

**返回**: `const whereFilters = this.dsl.get('whereFilters')`

### find

**签名**:

```typescript
find(index: number): VBIFilter | undefined
```

**参数**:

- `index`: number

**返回**: `VBIFilter | undefined`

### findAllWhereFilters

**签名**:

```typescript
findAllWhereFilters(): VBIFilter[]
```

**返回**: `VBIFilter[]`

### clear

**签名**:

```typescript
clear(): const whereFilters = this.dsl.get('whereFilters')
```

**返回**: `const whereFilters = this.dsl.get('whereFilters')`

### toJson

**签名**:

```typescript
toJson(): VBIFilter[]
```

**返回**: `VBIFilter[]`

### observe

**签名**:

```typescript
observe(callback: ObserveCallback): this.dsl.get('whereFilters').observe(callback)
```

**参数**:

- `callback`: ObserveCallback

**返回**: `this.dsl.get('whereFilters').observe(callback)`

### unobserve

**签名**:

```typescript
unobserve(callback: ObserveCallback): this.dsl.get('whereFilters').unobserve(callback)
```

**参数**:

- `callback`: ObserveCallback

**返回**: `this.dsl.get('whereFilters').unobserve(callback)`

