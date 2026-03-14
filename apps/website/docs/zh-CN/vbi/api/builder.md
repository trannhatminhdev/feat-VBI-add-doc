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
| **whereFilter** | `WhereFilterBuilder` | - |
| **theme** | `ThemeBuilder` | - |
| **locale** | `LocaleBuilder` | - |
| **limit** | `LimitBuilder` | - |


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