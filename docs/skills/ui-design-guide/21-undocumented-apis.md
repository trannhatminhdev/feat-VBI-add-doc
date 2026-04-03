# 21. 通过 Practices 才发现的 API 使用方式

> 以下内容在 skills 文档中未说明或说明不清晰，通过阅读 practices 源码才发现的正确用法。

---

## 1. WHERE 过滤：`op` 与 `value` 的组合规则

### 文档现状

`03-builder-api-summary.md` 中 `WhereNodeBuilder.setOperator` 列出了可用操作符，`setValue` 只写了传入值。

### 实际情况

**关键规则**：`buildWhere.ts` 会自动转换操作符：

| 传入 `op` | 传入 `value`                        | buildWhere 实际转换                         |
| --------- | ----------------------------------- | ------------------------------------------- |
| `'='`     | `string`（如 `'上海'`）             | `=`（单值精确匹配）                         |
| `'!='`    | `string`                            | `!=`                                        |
| `'='`     | `string[]`（如 `['上海', '东丰']`） | `'in'`                                      |
| `'!='`    | `string[]`                          | `'not in'`                                  |
| `'in'`    | `string[]`                          | `'in'`（但会导致 SQL 语法错误，**不要用**） |

### 正确用法

```ts
// 多值筛选：op='=' + 数组值
builder.whereFilter.add('city', (n) => {
  n.setOperator('=') // 注意是 '=' 不是 'in'
  n.setValue(['上海', '东丰']) // 数组！
})

// 单值筛选：op='=' + 字符串
builder.whereFilter.add('city', (n) => {
  n.setOperator('=')
  n.setValue('上海')
})
```

### 文档缺失

- `buildWhere` 的自动转换逻辑未在任何 skills 文档中说明
- 误用 `op: 'in'` 会导致 SQL 语法错误，需要实际运行才发现

---

## 2. `RawDatasetSource.rawDataset` 必须用 `TidyDatum[]`

### 文档现状

`17-demo-connector.md` 中的示例直接写 `{ type: 'json', rawDataset: localData }`，`localData` 是 `unknown[]`。

### 实际情况

`TidyDatum = Record<string, number | string | null | boolean | undefined>`

`rawDataset` 的类型是 `string | ArrayBuffer | Blob | TidyDatum[]`。如果传入 `unknown[]`：

- TypeScript 报错：`Type 'unknown[]' is not assignable to parameter of type 'TidyDatum[]'`
- 即使类型断言通过，嵌套对象会在 DuckDB 查询时报错

### 正确用法

```ts
import { type TidyDatum } from '@visactor/vquery'

const toTidyDatum = (row: unknown): TidyDatum | null => {
  if (typeof row !== 'object' || row === null) return null
  const result: TidyDatum = {}
  for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
    if (typeof v === 'number' || typeof v === 'string' || v === null || typeof v === 'boolean' || v === undefined) {
      result[k] = v as number | string | null | boolean | undefined
    } else {
      return null // 嵌套对象不支持
    }
  }
  return result
}

const tidyData: TidyDatum[] = []
for (const row of localData) {
  const datum = toTidyDatum(row)
  if (datum) tidyData.push(datum)
}

const ds: RawDatasetSource = { type: 'json', rawDataset: tidyData }
await vquery.createDataset(connectorId, schema, ds)
```

### 文档缺失

- `TidyDatum` 类型定义未在任何 skills 文档中出现
- `{ type: 'json', rawDataset: url }` 和 `{ type: 'csv', rawDataset: url }` 的区别未说明（前者需要 TidyDatum[]，后者直接传 URL 字符串）
- `CSV URL` 方式（`type: 'csv'` + url string）更简单，不需要类型转换，未被推荐

---

## 3. `useVBISchemaFields` 返回 `fieldRoleMap` 和 `fieldTypeMap`

### 文档现状

`11-hooks-useVBISchemaFields.md` 中只说明了返回 `schemaFields`。

### 实际情况

professional 的实现返回三个字段：

```ts
const { schemaFields, fieldRoleMap, fieldTypeMap } = useVBISchemaFields(builder, schemaKey)
// schemaFields: { name, type, role }[]
// fieldRoleMap: Record<string, 'dimension' | 'measure'>
// fieldTypeMap: Record<string, string>
```

其中 `fieldRoleMap` 用于快速判断字段是维度还是指标，`fieldTypeMap` 用于判断字段类型（date/string/number），在 ConfigPanel 中判断是否显示日期聚合选项时非常有用。

### 文档缺失

- `fieldRoleMap` 和 `fieldTypeMap` 未在任何 skills 文档中说明
- `useVBISchemaFields` 的第二个参数 `schemaRefreshKey` 作用未说明（刷新 schema 时递增）

---

## 4. `useVBIChartType` 返回 `availableChartTypes`

### 文档现状

`09-hooks-useVBIChartType.md` 只说明了 `chartType` 和 `changeChartType`。

### 实际情况

```ts
const { chartType, changeChartType, availableChartTypes } = useVBIChartType(builder)
// chartType: string
// changeChartType: (type: string) => void
// availableChartTypes: string[]
```

`availableChartTypes` 用于渲染 ChartTypeSelector 的可选列表。

---

## 5. `useVBIBuilder` 返回完整的 theme/limit 状态

### 文档现状

`10-hooks-useVBIBuilder.md` 只提到了 `locale`。

### 实际情况

```ts
const { theme, setTheme, limit, setLimit, locale, setLocale } = useVBIBuilder(builder)
// theme: 'dark' | 'light'
// setTheme: (theme: 'dark' | 'light') => void
// limit: number
// setLimit: (n: number) => void
```

---

## 6. `replaceFilters` vs 增量增删：WHERE 过滤的两种模式

### 文档现状

`07-hooks-useVBIWhereFilter.md` 只说明了增量添加，没有说明替换模式。

### 实际情况

有两种使用方式：

**模式一：增量添加（每次加一个过滤条件）**

```ts
builder.whereFilter.add('city', (n) => {
  n.setOperator('=')
  n.setValue('上海')
})
```

**模式二：全量替换（适合 UI 面板管理所有过滤条件）**

```ts
const replaceFilters = (next: FilterItem[]) => {
  builder.doc.transact(() => {
    builder.whereFilter.clear()
    next.forEach((f) => {
      builder.whereFilter.add(f.field, (n) => {
        n.setOperator(f.operator)
        n.setValue(f.value)
      })
    })
  })
}
```

推荐 UI 面板使用模式二，因为面板需要展示当前所有过滤条件，替换比增量更易管理。

---

## 7. FilterPanel 的 `onChange` 传完整数组

### 文档现状

未说明 FilterPanel 组件如何与 `replaceFilters` 配合。

### 实际情况

FilterPanel 组件 `onChange` 传入的是**所有过滤条件的新数组**，UI 层用 `replaceFilters` 全量替换：

```tsx
// FilterPanel 组件内部：用户添加/编辑/删除时
onChange([...filters, newItem]) // 传完整数组

// App 组件：接收完整数组，用 replaceFilters 全量替换
<FilterPanel
  filters={filterItems}
  onChange={(next) => replaceWhereFilters(
    next.map((f) => ({ field: f.field, operator: f.operator, value: f.value }))
  )}
/>
```

---

## 8. `window.dispatchEvent('vbi-filter-error')` 用于 UI 层同步

### 文档现状

未提及。

### 实际情况

当 `bindEvent` 中的 `buildVSeed()` 报错了，会自动移除最后一个坏的过滤条件，然后派发自定义事件：

```ts
// VBIStore 的 bindEvent 中
window.dispatchEvent(new CustomEvent('vbi-filter-error', { detail: lastFilter }))
```

UI 层的 App 组件监听这个事件，同步更新本地的 filter 状态（移除最后一个）：

```ts
useEffect(() => {
  const handleFilterError = () => {
    setFilters((prev) => prev.slice(0, -1))
  }
  window.addEventListener('vbi-filter-error', handleFilterError)
  return () => window.removeEventListener('vbi-filter-error', handleFilterError)
}, [])
```

---

## 9. `VSeedBuilder.from()` 需要显式传 `theme`

### 文档现状

`14-vseed-render.md` 中 VSeedBuilder.from 的调用未说明 `theme` 参数。

### 实际情况

VSeedRender 需要把 Builder 的 theme 传给 VSeedBuilder：

```tsx
const VSeedRender = ({ vseed, themeMode = 'dark' }) => {
  // ...
  useEffect(() => {
    const b = VSeedBuilder.from({ ...vseed, theme: themeMode })
    // ...
  }, [themeMode, vseed])
}
```

如果漏传 `theme`，图表主题可能不正确。

---

## 10. Antd ConfigProvider 的 `algorithm` 设置

### 文档现状

未提及。

### 实际情况

浅色/深色主题通过 Antd 的 ConfigProvider 控制：

```tsx
import { theme } from 'antd'

const createThemeConfig = (themeMode: 'dark' | 'light') => ({
  algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: themeMode === 'dark' ? '#6c8cff' : '#275df5',
    borderRadius: 10,
  },
})

;<ConfigProvider theme={createThemeConfig(themeMode)}>{/* ... */}</ConfigProvider>
```

但 VChart/VTable 自身的主题由 `VSeedBuilder.from({ ...vseed, theme: themeMode })` 控制，两者需要保持一致。

---

## 11. `clearBuilderState` — 重置所有配置的辅助函数

### 文档现状

未提及。

### 实际情况

加载新数据或重置时，需要清理维度、度量、过滤、图表类型、行数限制：

```ts
const clearBuilderState = (builder: VBIChartBuilder) => {
  const dimensionIds = builder.dimensions
    .toJSON()
    .map((d) => d.id)
    .reverse()
  const measureIds = builder.measures
    .toJSON()
    .map((m) => m.id)
    .reverse()

  builder.doc.transact(() => {
    dimensionIds.forEach((id) => builder.dimensions.remove(id))
    measureIds.forEach((id) => builder.measures.remove(id))
    builder.whereFilter.clear()
    builder.havingFilter.clear()
  })

  builder.chartType.changeChartType('table')
  builder.limit.setLimit(DEFAULT_LIMIT)
}
```

注意 `reverse()` 是必要的，因为 Yjs 的 `remove` 操作会影响后续索引。

---

## 12. `setLocalDataWithSchema` — 带 schema 的数据设置方法

### 文档现状

`17-demo-connector.md` 中 `registerDemoConnector` 示例没有展示本地数据注入方法。

### 实际情况

提供显式 schema 的初始化函数（来自 professional）：

```ts
// demoConnector.ts
export const setLocalDataWithSchema = (data: unknown[], schema: DatasetColumn[] | null) => {
  localData = data
  localSchema = schema // 覆盖自动推断
  datasetNeedsRefresh = true
}

// 使用
import { supermarketSchema } from './utils/supermarketSchema'
setLocalDataWithSchema(data, supermarketSchema)
```

当已有明确 schema（如 demo 数据有固定结构）时，传入 schema 可以避免自动推断错误。
