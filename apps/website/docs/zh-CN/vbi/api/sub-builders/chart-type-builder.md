# ChartTypeBuilder

图表类型构建器，用于切换和获取图表类型

## 构造函数

```typescript
new ChartTypeBuilder(doc: Y.Doc)
```

## 属性

## 方法

### ~~getChartType~~

> ⚠️ 已废弃

获取当前图表类型

**签名**:

```typescript
getChartType(): return this.dsl.get('chartType') || 'table'
```

**返回**: `return this.dsl.get('chartType') || 'table'`

### toJson

将当前图表类型配置转换为 JSON 对象

**签名**:

```typescript
toJson(): string
```

**返回**: `string`

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

### changeChartType

**签名**:

```typescript
changeChartType(chartType: string)
```

**参数**:

- `chartType`: string

### getAvailableChartTypes

**签名**:

```typescript
getAvailableChartTypes(): string[]
```

**返回**: `string[]`

