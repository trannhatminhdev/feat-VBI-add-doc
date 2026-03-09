# VBIBuilder

VBI 主构建器，管理所有子构建器

## 构造函数

```typescript
new VBIBuilder(doc: Y.Doc)
```

## 属性

- **chartType**: ChartTypeBuilder - 图表类型构建器
- **measures**: MeasuresBuilder - 度量构建器
- **dimensions**: DimensionsBuilder - 维度构建器
- **whereFilters**: WhereFiltersBuilder - Where 过滤构建器
- **havingFilters**: HavingFiltersBuilder - Having 过滤构建器
- **encoding**: EncodingBuilder - 编码构建器
- **dsl**: Y.Map<any> - Yjs 文档映射
- **doc**: Y.Doc - Yjs 文档实例
- **undoManager**: Y.UndoManager - 撤销管理器

## 方法

### getEncodings

Get measure encoding information from a VChart spec

**签名**:

```typescript
getEncodings(spec: any, measureNames: string[] = []): return this.encoding.getMeasureEncodings(spec, measureNames)
```

**参数**:

- `spec`: any
- `measureNames`: string[] = []

**返回**: `return this.encoding.getMeasureEncodings(spec, measureNames)`

### applyUpdate

**签名**:

```typescript
applyUpdate(update: Uint8Array)
```

**参数**:

- `update`: Uint8Array

### encodeStateAsUpdate

**签名**:

```typescript
encodeStateAsUpdate(targetStateVector?: Uint8Array)
```

**参数**:

- `targetStateVector?`: Uint8Array

### async

**签名**:

```typescript
async(): Promise<VSeedDSL> =>
```

**返回**: `Promise<VSeedDSL> =>`

### setLimit

**签名**:

```typescript
setLimit(limit: number): this
```

**参数**:

- `limit`: number

**返回**: `this`

### setLocale

**签名**:

```typescript
setLocale(locale: string): this
```

**参数**:

- `locale`: string

**返回**: `this`

### setTheme

**签名**:

```typescript
setTheme(theme: string): this
```

**参数**:

- `theme`: string

**返回**: `this`

