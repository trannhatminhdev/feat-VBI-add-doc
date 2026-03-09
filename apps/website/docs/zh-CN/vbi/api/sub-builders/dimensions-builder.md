# DimensionsBuilder

维度构建器，用于添加、修改、删除维度配置

## 构造函数

```typescript
new DimensionsBuilder(doc: Y.Doc)
```

## 属性

## 方法

### removeDimension

维度构建器 - 用于构建和管理图表维度

**签名**:

```typescript
removeDimension(field: VBIDimension['field']): const dimensions = this.dsl.get('dimensions')
```

**参数**:

- `field`: VBIDimension['field']

**返回**: `const dimensions = this.dsl.get('dimensions')`

### updateDimension

**签名**:

```typescript
updateDimension(field: string, updates: Partial<Omit<VBIDimension, 'field'>>): void
```

**参数**:

- `field`: string
- `updates`: Partial<Omit<VBIDimension
- `'field'>>`

**返回**: `void`

### find

**签名**:

```typescript
find(field: VBIDimension['field']): VBIDimension | undefined
```

**参数**:

- `field`: VBIDimension['field']

**返回**: `VBIDimension | undefined`

### findAllDimensions

**签名**:

```typescript
findAllDimensions(): VBIDimension[]
```

**返回**: `VBIDimension[]`

### toJson

**签名**:

```typescript
toJson(): VBIDimension[]
```

**返回**: `VBIDimension[]`

### observe

**签名**:

```typescript
observe(callback: ObserveCallback): this.dsl.get('dimensions').observe(callback)
```

**参数**:

- `callback`: ObserveCallback

**返回**: `this.dsl.get('dimensions').observe(callback)`

### unobserve

**签名**:

```typescript
unobserve(callback: ObserveCallback): this.dsl.get('dimensions').unobserve(callback)
```

**参数**:

- `callback`: ObserveCallback

**返回**: `this.dsl.get('dimensions').unobserve(callback)`

### isDimensionNode

**签名**:

```typescript
isDimensionNode(node: VBIDimensionTree[0]): node is VBIDimension
```

**参数**:

- `node`: VBIDimensionTree[0]

**返回**: `node is VBIDimension`

### isDimensionGroup

**签名**:

```typescript
isDimensionGroup(node: VBIDimensionTree[0]): node is VBIDimensionGroup
```

**参数**:

- `node`: VBIDimensionTree[0]

**返回**: `node is VBIDimensionGroup`

