# WhereNodeBuilder

Where 过滤节点构建器，用于配置单个 Where 过滤条件

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| **yMap** | `Y.Map<any>` | Yjs Map 实例 |
## 方法

### constructor

**定义**:

```typescript
constructor(yMap: Y.Map<any>)
```

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `yMap` | Y.Map<any> | - |



### getField

获取字段名

**定义**:

```typescript
getField(): string
```

**返回**: `string`



### setOperator

设置过滤操作符

**定义**:

```typescript
setOperator(operator: string): this
```

**返回**: `this`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `operator` | string | - 操作符 |



### setValue

设置过滤值

**定义**:

```typescript
setValue(value: unknown): this
```

**返回**: `this`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `value` | unknown | - 过滤值 |



### toJson

导出为 JSON

**定义**:

```typescript
toJson(): VBIFilter
```

**返回**: `VBIFilter`

