# DimensionsBuilder

维度构建器，用于添加、修改、删除维度配置

## 构造函数

```typescript
new DimensionsBuilder(doc: Y.Doc)
```

## 属性

## 方法

### ~~getDimensions~~

> ⚠️ 已废弃

获取所有维度配置

**签名**:

```typescript
getDimensions(): VBIDimension[]
```

**返回**: `VBIDimension[]`

### toJson

将当前所有维度配置转换为 JSON 数组

**签名**:

```typescript
toJson(): VBIDimension[]
```

**返回**: `VBIDimension[]`

### removeDimension

**签名**:

```typescript
removeDimension(field: VBIDimension['field'])
```

**参数**:

- `field`: VBIDimension['field']

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

