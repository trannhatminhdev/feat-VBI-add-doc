# DimensionNodeBuilder

维度节点构建器，用于配置单个维度

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



### setAlias

设置显示名称

**定义**:

```typescript
setAlias(alias: string): this
```

**返回**: `this`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `alias` | string | - 显示名称 |



### toJson

导出为 JSON

**定义**:

```typescript
toJson(): VBIDimension
```

**返回**: `VBIDimension`

