# MeasuresBuilder

度量构建器，用于添加、修改、删除度量配置

## 构造函数

```typescript
new MeasuresBuilder(doc: Y.Doc)
```

## 属性

## 方法

### removeMeasure

度量构建器 - 用于构建和管理图表度量

**签名**:

```typescript
removeMeasure(field: VBIMeasure['field']): const measures = this.dsl.get('measures')
```

**参数**:

- `field`: VBIMeasure['field']

**返回**: `const measures = this.dsl.get('measures')`

### renameMeasure

**签名**:

```typescript
renameMeasure(field: string, newAlias: string): void
```

**参数**:

- `field`: string
- `newAlias`: string

**返回**: `void`

### updateAggregate

**签名**:

```typescript
updateAggregate(field: string, func: string, quantile?: number): void
```

**参数**:

- `field`: string
- `func`: string
- `quantile?`: number

**返回**: `void`

### updateEncoding

**签名**:

```typescript
updateEncoding(field: string, encoding: VBIMeasure['encoding']): void
```

**参数**:

- `field`: string
- `encoding`: VBIMeasure['encoding']

**返回**: `void`

### find

更新度量的图表编码位置（modifyEncoding 的别名） */

**签名**:

```typescript
find(field: VBIMeasure['field']): VBIMeasure | undefined
```

**参数**:

- `field`: VBIMeasure['field']

**返回**: `VBIMeasure | undefined`

### findAllMeasures

**签名**:

```typescript
findAllMeasures(): VBIMeasure[]
```

**返回**: `VBIMeasure[]`

### toJson

**签名**:

```typescript
toJson(): VBIMeasure[]
```

**返回**: `VBIMeasure[]`

### observe

**签名**:

```typescript
observe(callback: ObserveCallback): this.dsl.get('measures').observe(callback)
```

**参数**:

- `callback`: ObserveCallback

**返回**: `this.dsl.get('measures').observe(callback)`

### unobserve

**签名**:

```typescript
unobserve(callback: ObserveCallback): this.dsl.get('measures').unobserve(callback)
```

**参数**:

- `callback`: ObserveCallback

**返回**: `this.dsl.get('measures').unobserve(callback)`

### updateMeasure

**签名**:

```typescript
updateMeasure(field: string, updates: Partial<Omit<VBIMeasure, 'field'>>): void
```

**参数**:

- `field`: string
- `updates`: Partial<Omit<VBIMeasure
- `'field'>>`

**返回**: `void`

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

