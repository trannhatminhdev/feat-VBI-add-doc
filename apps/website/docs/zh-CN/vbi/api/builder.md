# VBIBuilder

VBI 主构建器，管理所有子构建器

## 构造函数

```typescript
new VBIBuilder(doc: Y.Doc)
```

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

### getEncodings

Get measure encoding information from a VChart spec

**定义**:

```typescript
getEncodings(spec: any, measureNames: string[] = []): any
```

**返回**: `any`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `spec` | any |
| `measureNames` | string[] = [] |

### applyUpdate

**定义**:

```typescript
applyUpdate(update: Uint8Array)
```

**参数**:

| 参数 | 类型 |
| --- | --- |
| `update` | Uint8Array |

### encodeStateAsUpdate

**定义**:

```typescript
encodeStateAsUpdate(targetStateVector?: Uint8Array)
```

**参数**:

| 参数 | 类型 |
| --- | --- |
| `targetStateVector?` | Uint8Array |

### async

**定义**:

```typescript
async(): Promise<VSeedDSL>
```

**返回**: `Promise<VSeedDSL>`

### setLimit

**定义**:

```typescript
setLimit(limit: number): this
```

**返回**: `this`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `limit` | number |

### setLocale

**定义**:

```typescript
setLocale(locale: string): this
```

**返回**: `this`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `locale` | string |

### setTheme

**定义**:

```typescript
setTheme(theme: string): this
```

**返回**: `this`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `theme` | string |

