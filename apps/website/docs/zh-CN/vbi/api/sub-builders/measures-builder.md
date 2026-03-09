# MeasuresBuilder

度量构建器，用于添加、修改、删除度量配置

## 构造函数

```typescript
new MeasuresBuilder(doc: Y.Doc)
```

## 属性

## 方法

### ~~getMeasures~~

> ⚠️ 已废弃

获取所有度量配置

**签名**:

```typescript
getMeasures(): VBIMeasure[]
```

**返回**: `VBIMeasure[]`

### toJson

将当前所有度量配置转换为 JSON 数组

**签名**:

```typescript
toJson(): VBIMeasure[]
```

**返回**: `VBIMeasure[]`

### removeMeasure

**签名**:

```typescript
removeMeasure(field: VBIMeasure['field'])
```

**参数**:

- `field`: VBIMeasure['field']

### renameMeasure

**签名**:

```typescript
renameMeasure(field: string, newAlias: string): void
```

**参数**:

- `field`: string
- `newAlias`: string

**返回**: `void`

### modifyAggregate

**签名**:

```typescript
modifyAggregate(field: string, func: string, quantile?: number): void
```

**参数**:

- `field`: string
- `func`: string
- `quantile?`: number

**返回**: `void`

### modifyEncoding

**签名**:

```typescript
modifyEncoding(field: string, encoding: VBIMeasure['encoding']): void
```

**参数**:

- `field`: string
- `encoding`: VBIMeasure['encoding']

**返回**: `void`

### modifyMeasure

**签名**:

```typescript
modifyMeasure(field: string, updates: Partial<Omit<VBIMeasure, 'field'>>): void
```

**参数**:

- `field`: string
- `updates`: Partial<Omit<VBIMeasure
- `'field'>>`

**返回**: `void`

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

### isMeasureNode

**签名**:

```typescript
isMeasureNode(node: VBIMeasureTree[0]): node is VBIMeasure
```

**参数**:

- `node`: VBIMeasureTree[0]

**返回**: `node is VBIMeasure`

### isMeasureGroup

**签名**:

```typescript
isMeasureGroup(node: VBIMeasureTree[0]): node is VBIMeasureGroup
```

**参数**:

- `node`: VBIMeasureTree[0]

**返回**: `node is VBIMeasureGroup`

