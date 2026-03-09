# ChartTypeBuilder

图表类型构建器，用于切换和获取图表类型

## 构造函数

```typescript
new ChartTypeBuilder(doc: Y.Doc)
```

## 属性

## 方法

### observe

图表类型构建器 - 用于切换图表显示形式

**签名**:

```typescript
observe(callback: ObserveCallback): const wrapper: ObserveCallback = (e, trans) =>
```

**参数**:

- `callback`: ObserveCallback

**返回**: `const wrapper: ObserveCallback = (e, trans) =>`

### unobserve

**签名**:

```typescript
unobserve(callback: ObserveCallback): const wrapper: ObserveCallback = (e, trans) =>
```

**参数**:

- `callback`: ObserveCallback

**返回**: `const wrapper: ObserveCallback = (e, trans) =>`

### changeChartType

**签名**:

```typescript
changeChartType(chartType: string): this.dsl.set('chartType', chartType)
```

**参数**:

- `chartType`: string

**返回**: `this.dsl.set('chartType', chartType)`

### ~~getChartType~~

> ⚠️ 已废弃

**签名**:

```typescript
getChartType(): return this.dsl.get('chartType') || 'table'
```

**返回**: `return this.dsl.get('chartType') || 'table'`

### toJson

**签名**:

```typescript
toJson(): string
```

**返回**: `string`

### getAvailableChartTypes

**签名**:

```typescript
getAvailableChartTypes(): string[]
```

**返回**: `string[]`

