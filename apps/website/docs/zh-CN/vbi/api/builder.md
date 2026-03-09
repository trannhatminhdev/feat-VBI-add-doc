# VBIBuilder



## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| **chartType** | `ChartTypeBuilder` | 图表类型构建器 |
| **measures** | `MeasuresBuilder` | 度量构建器 |
| **dimensions** | `DimensionsBuilder` | 维度构建器 |
| **whereFilters** | `WhereFiltersBuilder` | Where 过滤构建器 |
| **havingFilters** | `HavingFiltersBuilder` | Having 过滤构建器 |
| **encoding** | `EncodingBuilder` | 编码构建器 |
| **dsl** | `Y.Map<any>` | Yjs 文档映射 |
| **doc** | `Y.Doc` | Yjs 文档实例 |
| **undoManager** | `Y.UndoManager` | 撤销管理器 |
## 方法

### constructor

**定义**:

```typescript
constructor(doc: Y.Doc)
```

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `doc` | Y.Doc | - |



### applyUpdate

**定义**:

```typescript
applyUpdate(update: Uint8Array)
```

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `update` | Uint8Array | - |



### encodeStateAsUpdate

**定义**:

```typescript
encodeStateAsUpdate(targetStateVector: Uint8Array)
```

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `targetStateVector` | Uint8Array | - |



### setLimit

**定义**:

```typescript
setLimit(limit: number): this
```

**返回**: `this`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `limit` | number | - |



### setLocale

**定义**:

```typescript
setLocale(locale: string): this
```

**返回**: `this`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `locale` | string | - |



### setTheme

**定义**:

```typescript
setTheme(theme: string): this
```

**返回**: `this`

**参数**:

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `theme` | string | - |

