# VBIBuilder

## 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| **doc** | `Y.Doc` | - |
| **dsl** | `Y.Map<any>` | - |
| **undoManager** | `UndoManager` | - |
| **chartType** | `ChartTypeBuilder` | - |
| **measures** | `MeasuresBuilder` | - |
| **dimensions** | `DimensionsBuilder` | - |
| **havingFilter** | `HavingFilterBuilder` | - |
| **whereFilter** | `WhereFiltersBuilder` | - |


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

### buildVSeed

**定义**:

```typescript
buildVSeed(): Promise<VSeedDSL>
```

**返回**: `Promise<VSeedDSL>`

### buildVQuery

**定义**:

```typescript
buildVQuery(): VQueryDSL
```

**返回**: `VQueryDSL`

### build

**定义**:

```typescript
build(): VBIDSL
```

**返回**: `VBIDSL`

### getSchema

**定义**:

```typescript
getSchema(): Promise<any>
```

**返回**: `Promise<any>`