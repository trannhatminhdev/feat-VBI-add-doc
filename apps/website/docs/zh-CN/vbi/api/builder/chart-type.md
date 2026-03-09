# chartType

图表类型构建器，用于切换和获取图表类型

## 构造函数

```typescript
new chartType(doc: Y.Doc)
```

## 属性

## 方法

### observe

图表类型构建器 - 用于切换图表显示形式, 支持：表格、柱状图、折线图、饼图、散点图等

**定义**:

```typescript
observe(callback: ObserveCallback): const wrapper: ObserveCallback = (e, trans)
```

**返回**: `const wrapper: ObserveCallback = (e, trans)`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `callback` | ObserveCallback |

### unobserve

取消监听图表类型变化

**定义**:

```typescript
unobserve(callback: ObserveCallback): const wrapper: ObserveCallback = (e, trans)
```

**返回**: `const wrapper: ObserveCallback = (e, trans)`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `callback` | ObserveCallback |

### changeChartType

设置图表类型

**定义**:

```typescript
changeChartType(chartType: string): any
```

**返回**: `any`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `chartType` | string |

### getChartType

获取当前图表类型

**定义**:

```typescript
getChartType(): string
```

**返回**: `string`

### toJson

获取当前图表类型

**定义**:

```typescript
toJson(): string
```

**返回**: `string`

### getAvailableChartTypes

获取所有支持的图表类型

**定义**:

```typescript
getAvailableChartTypes(): string[]
```

**返回**: `string[]`

