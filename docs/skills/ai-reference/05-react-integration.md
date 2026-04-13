# 5. React 集成模式

> ⚠️ **重要区分**：每个 practice 自己实现的 hooks（`useVBIDimensions` / `useVBIWhereFilter` 等）与 `@visactor/vbi-react` 包中的 hooks（`useDimensions` / `useWhereFilter` 等）**签名完全不同**，不可混用。**大部分 practice 使用各自独立的 hooks，只有 vbi-react-starter 使用 @visactor/vbi-react**。详见 [09-standard-practice.md](./09-standard-practice.md)。

## 5.1 两套 Hooks 对比

| vbi-react hook                  | 各 practice 自有 hook               | 核心区别                             |
| ------------------------------- | ----------------------------------- | ------------------------------------ |
| `useDimensions(builder)` 必传   | `useVBIDimensions(builder?)` 可选   | builder 参数可选                     |
| `useMeasures(builder)` 必传     | `useVBIMeasures(builder?)` 可选     | builder 参数可选                     |
| `useWhereFilter(builder)` 必传  | `useVBIWhereFilter(builder?)` 可选  | 返回值完全不同                       |
| `useHavingFilter(builder)` 必传 | `useVBIHavingFilter(builder?)` 可选 | 返回值完全不同                       |
| `useChartType(builder)` 必传    | `useVBIChartType(builder?)` 可选    | 返回值略有不同                       |
| —                               | `useVBIBuilder(builder?)`           | 各 practice 独有：locale/theme/limit |
| —                               | `useVBISchemaFields(builder?)`      | 各 practice 独有：字段列表           |
| —                               | `useVBIUndoManager(builder?)`       | 各 practice 独有：undo/redo          |

## 5.2 VBI-react 包提供的内容（仅 vbi-react-starter 使用）

VBI-react 包位于 `packages/vbi-react/`，包含 **7 个 hooks** 和 **4 个组件**。只有 `vbi-react-starter` 使用这个包。其他 practice（minimalist/streamlined/professional/standard/standard-report）都使用各自独立的实现。

### Hooks

| Hook              | 作用                         | 关键返回值                                                                   |
| ----------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| `useVBI`          | 获取 builder + 完整 DSL 快照 | `{ builder, dsl }`                                                           |
| `useVSeed`        | 执行 buildVSeed 流水线       | `{ vseed, loading, error, refetch }`                                         |
| `useDimensions`   | 维度状态订阅                 | `{ dimensions, addDimension, removeDimension, updateDimension }`             |
| `useMeasures`     | 度量状态订阅                 | `{ measures, addMeasure, removeMeasure, updateMeasure }`                     |
| `useWhereFilter`  | WHERE 过滤状态订阅           | `{ whereFilter, mutateWhereFilter, clearWhereFilter, removeWhereEntry }`     |
| `useHavingFilter` | HAVING 过滤状态订阅          | `{ havingFilter, mutateHavingFilter, clearHavingFilter, removeHavingEntry }` |
| `useChartType`    | 图表类型状态订阅             | `{ chartType, availableChartTypes, setChartType }`                           |

### 组件

| 组件                | 作用                                           |
| ------------------- | ---------------------------------------------- |
| `ChartRenderer`     | 图表渲染容器（需传入 `renderVSeed` prop 渲染） |
| `ChartTypeSelector` | 图表类型选择下拉框                             |
| `FieldPanel`        | 字段管理面板（维度/度量列表）                  |
| `BuilderLayout`     | 布局容器（leftPanel/main/rightPanel）          |

### 内部机制

所有 hooks 底层依赖 `useBuilderObserver`（`src/internal/useBuilderObserver.ts`），其本质是 React 18 的 `useSyncExternalStore`，订阅 Yjs `doc` 的 `'update'` 事件。这保证了 **Yjs 文档变更 → React 自动重新渲染** 的链路是全自动的。

---

## 5.3 AI 触发 UI 更新的方式

AI 生成图表配置后，Yjs 变更自动触发重渲染，无需手动刷新页面。

### 方式 1：直接调用 Builder API（推荐）

AI 直接操作 builder，Yjs 变更自动触发重渲染：

```tsx
function ChartConfig() {
  const { builder } = useVBI(builder)

  // AI 调用 Builder API → Yjs doc 更新 → doc 触发 'update' 事件
  // → useVSeed 监听到变化 → 自动调用 buildVSeed → 图表重新渲染
  const configureChart = () => {
    builder.chartType.changeChartType('column')
    builder.dimensions.add('category')
    builder.measures.add('sales', (node) => {
      node.setAggregate({ func: 'sum' })
    })
  }

  return <button onClick={configureChart}>生成柱状图</button>
}
```

**关键点**：AI 只需要调用 Builder API，后续的重渲染全部由 VBI-react 自动处理。

### 方式 2：通过 React hooks 操作（命令式）

```tsx
function ChartConfig() {
  const { addDimension, removeDimension } = useDimensions(builder)
  const { addMeasure } = useMeasures(builder)
  const { setChartType } = useChartType(builder)

  const configureBarChart = () => {
    setChartType('column')
    addDimension('category')
    addMeasure('sales', { aggregate: { func: 'sum' }, alias: '销售额' })
  }

  return <button onClick={configureBarChart}>生成柱状图</button>
}
```

### 方式 3：通过 filter mutation 操作

```tsx
function FilterPanel() {
  const { mutateWhereFilter } = useWhereFilter(builder)

  const addRegionFilter = () => {
    mutateWhereFilter((f) => {
      f.add('region', (node) => {
        node.setOperator('=')
        node.setValue('华北')
      })
    })
  }

  return <button onClick={addRegionFilter}>添加地区过滤</button>
}
```

---

## 5.4 useVBI — 获取完整状态

```tsx
import { useVBI } from '@visactor/vbi-react'

function ChartConfig() {
  const { builder, dsl } = useVBI(builder)

  return (
    <div>
      <div>当前图表类型：{dsl.chartType}</div>
      <div>维度数量：{dsl.dimensions.length}</div>
      <div>度量数量：{dsl.measures.length}</div>
    </div>
  )
}
```

---

## 5.5 useVSeed — 执行渲染流水线

```tsx
import { useVSeed } from '@visactor/vbi-react'

function ChartView() {
  const { vseed, loading, error, refetch } = useVSeed(builder, {
    debounce: 300, // 防抖延迟，默认 300ms
    onError: (e) => console.error(e),
  })

  if (error) {
    return (
      <div>
        渲染失败: {error.message} <button onClick={refetch}>重试</button>
      </div>
    )
  }

  if (loading && !vseed) {
    return <div>加载中...</div>
  }

  return vseed ? <VSeedRender vseed={vseed} /> : null
}
```

---

## 5.6 useDimensions — 维度管理

```tsx
import { useDimensions } from '@visactor/vbi-react'

function DimensionPanel() {
  const { dimensions, addDimension, removeDimension, updateDimension } = useDimensions(builder)

  return (
    <div>
      {dimensions.map((dim) => (
        <div key={dim.id}>
          {dim.alias || dim.field}
          <button onClick={() => removeDimension(dim.id)}>删除</button>
        </div>
      ))}
      <button onClick={() => addDimension('category')}>+ 添加类别维度</button>
    </div>
  )
}
```

`VBIDimension` 结构：

```ts
{
  id: string;
  field: string;        // 原始字段名
  alias: string;        // 显示别名
  encoding?: 'xAxis' | 'yAxis' | 'color' | 'detail' | 'tooltip' | 'label' | 'row' | 'column' | 'angle' | 'hierarchy' | 'player';
  aggregate?: { func: 'toYear' | 'toQuarter' | 'toMonth' | 'toWeek' | 'toDay' | 'toHour' | 'toMinute' | 'toSecond' };
  sort?: { order: 'asc' | 'desc' };
}
```

> ⚠️ `useDimensions.updateDimension` 目前只支持更新 `alias`。如需更新 `aggregate`/`encoding`/`sort`，请直接使用 `builder.dimensions.update(id, callback)`。

---

## 5.7 useMeasures — 度量管理

```tsx
import { useMeasures } from '@visactor/vbi-react'

function MeasurePanel() {
  const { measures, addMeasure, removeMeasure, updateMeasure } = useMeasures(builder)

  return (
    <div>
      {measures.map((m) => (
        <div key={m.id}>
          {m.alias || m.field} [{m.aggregate?.func}] → {m.encoding}
          <button onClick={() => removeMeasure(m.id)}>删除</button>
        </div>
      ))}
      <button onClick={() => addMeasure('sales', { aggregate: { func: 'sum' } })}>+ 添加销售度量</button>
    </div>
  )
}
```

`VBIMeasure` 结构：

```ts
{
  id: string;
  field: string;
  alias: string;
  encoding?: 'yAxis' | 'xAxis' | 'primaryYAxis' | 'secondaryYAxis' | 'angle' | 'radius' | 'size' | 'color' | 'detail' | 'column' | 'label' | 'tooltip' | 'value' | 'q1' | 'q3' | 'min' | 'max' | 'median' | 'outliers' | 'x0' | 'x1';
  aggregate?: { func: string; quantile?: number } | { func: 'quantile'; quantile: number };
  format?: { autoFormat: true } | { autoFormat?: false; prefix?: string; suffix?: string; decimalCount?: number; thousandsSeparator?: boolean };
  sort?: { order: 'asc' | 'desc' };
}
```

> ⚠️ `useMeasures.updateMeasure` 目前只支持更新 `alias`、`aggregate`、`encoding`。如需更新 `format`/`sort`，请直接使用 `builder.measures.update(id, callback)`。

---

## 5.8 useWhereFilter — WHERE 过滤

```tsx
import { useWhereFilter } from '@visactor/vbi-react'

function WherePanel() {
  const { whereFilter, mutateWhereFilter, clearWhereFilter, removeWhereEntry } = useWhereFilter(builder)

  return (
    <div>
      {whereFilter.conditions.map((cond) => (
        <div key={cond.id}>
          {cond.field} {cond.op} {JSON.stringify(cond.value)}
          <button onClick={() => removeWhereEntry(cond.id)}>删除</button>
        </div>
      ))}
      <button
        onClick={() => {
          mutateWhereFilter((f) =>
            f.add('region', (n) => {
              n.setOperator('=')
              n.setValue('华北')
            }),
          )
        }}
      >
        + 添加过滤
      </button>
    </div>
  )
}
```

---

## 5.9 useHavingFilter — HAVING 过滤

```tsx
import { useHavingFilter } from '@visactor/vbi-react'

function HavingPanel() {
  const { havingFilter, mutateHavingFilter, clearHavingFilter, removeHavingEntry } = useHavingFilter(builder)

  return (
    <div>
      {havingFilter.conditions.map((cond) => (
        <div key={cond.id}>
          {cond.field} {cond.aggregate?.func}({cond.op} {cond.value})
          <button onClick={() => removeHavingEntry(cond.id)}>删除</button>
        </div>
      ))}
    </div>
  )
}
```

---

## 5.10 useChartType — 图表类型

```tsx
import { useChartType } from '@visactor/vbi-react'

function ChartTypeSelector() {
  const { chartType, availableChartTypes, setChartType } = useChartType(builder)

  return (
    <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
      {availableChartTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  )
}
```

---

## 5.11 ChartRenderer 组件

```tsx
import { ChartRenderer } from '@visactor/vbi-react'
;<ChartRenderer
  builder={builder}
  debounce={300}
  renderVSeed={(vseed) => <VSeedRender vseed={vseed} />}
  emptyFallback={<div>请配置图表</div>}
  renderError={(error, refetch) => (
    <div>
      错误：{error.message}
      <button onClick={refetch}>重试</button>
    </div>
  )}
/>
```

---

## 5.12 ChartTypeSelector 组件

```tsx
import { ChartTypeSelector } from '@visactor/vbi-react'
;<ChartTypeSelector
  builder={builder}
  label="图表类型"
  getOptionLabel={(type) =>
    ({
      column: '柱状图',
      bar: '条形图',
      line: '折线图',
      pie: '饼图',
    })[type] ?? type
  }
/>
```

---

## 5.13 FieldPanel 组件

> ⚠️ 注意：`FieldPanel` 的 API 与文档旧版描述不同。

实际 `FieldPanel` 接受以下 props：

```tsx
import { FieldPanel } from '@visactor/vbi-react'
;<FieldPanel
  builder={builder}
  dimensionOptions={[
    { label: '产品类别', value: 'category' },
    { label: '地区', value: 'region' },
  ]} // 可选的维度下拉选项
  measureOptions={[
    { label: '销售额', value: 'sales' },
    { label: '利润', value: 'profit' },
  ]} // 可选的度量下拉选项
  measureAggregateOptions={[
    // 可选，自定义聚合函数选项
    { label: 'Sum', value: 'sum' },
    { label: 'Average', value: 'avg' },
  ]}
  measureEncodingOptions={[
    // 可选，自定义编码选项
    { label: 'Y Axis', value: 'yAxis' },
    { label: 'Color', value: 'color' },
  ]}
  dimensionsTitle="维度"
  measuresTitle="度量"
/>
```

> ⚠️ `FieldPanel` **不接受** `onAddDimension` / `onAddMeasure` prop。添加和删除维度/度量通过组件内部的按钮操作完成。

---

## 5.14 BuilderLayout 组件

```tsx
import { BuilderLayout } from '@visactor/vbi-react'
;<BuilderLayout
  topBar={<TopBar />}
  leftPanel={<FieldsPanel />}
  leftPanelWidth={320}
  main={<ChartPanel />}
  rightPanel={<ShelfPanel />}
  rightPanelWidth={320}
  footer={<Footer />}
/>
```

---

## 5.15 各 Practice 自有 Hooks 完整签名

> 以下 hooks 来自**各 practice 自己的** `src/hooks/` 目录。AI 在操作具体某个 practice 时，从该 practice 的 `src/hooks/` 导入，不跨 practice 引用。每个 practice 的 hooks 签名和功能基本一致。

### useVBIWhereFilter

```tsx
import { useVBIWhereFilter } from 'src/hooks'

const {
  filters, // VBIWhereClause[]，原始嵌套条件树
  flattenFilters, // VBIWhereFilter[]，扁平化所有叶子条件
  addFilter, // (field: string, operator?: string, value?: unknown) => void
  addGroup, // (op: 'and'|'or', callback?: (group) => void) => void
  removeFilter, // (id: string) => void
  clearFilters, // () => void
  updateFilter, // (id: string, updates: { operator?: string; value?: unknown }) => void
  findFilter, // (id: string) => node | undefined
  updateGroup, // (id: string, updates: { operator?: 'and'|'or' }) => void
  addToGroup, // (groupId: string, field: string, operator?: string, value?: unknown) => void
  removeFromGroup, // (groupId: string, idOrIndex: string|number) => void
  findGroup, // (id: string) => node | undefined
} = useVBIWhereFilter(builder)

// 添加过滤条件（直接传参，无需回调）
addFilter('region', '=', '华北')

// 添加嵌套组
addGroup('and', (group) => {
  group.add('sales', (node) => {
    node.setOperator('>')
    node.setValue(1000)
  })
})

// 向嵌套组添加条件
addToGroup(groupId, 'profit', '<', 0)

// 扁平化所有叶子条件
const flat = flattenFilters()

// 更新条件
updateFilter(filterId, { operator: '>=', value: 5000 })

// 更新嵌套组操作符
updateGroup(groupId, { operator: 'or' })
```

### useVBIHavingFilter

```tsx
import { useVBIHavingFilter } from 'src/hooks'

const {
  filters, // VBIHavingClause[]
  addFilter, // (field: string, aggregate?: VBIHavingAggregate, operator?: string, value?: unknown) => void
  addGroup, // (op: 'and'|'or', callback?: (group) => void) => void
  removeFilter, // (id: string) => void
  clearFilters, // () => void
  updateFilter, // (id: string, updates: { aggregate?: VBIHavingAggregate; operator?: string; value?: unknown }) => void
  findFilter, // (id: string) => node | undefined
} = useVBIHavingFilter(builder)

// 添加 HAVING 条件
addFilter('sales', { func: 'sum' }, '>', 5000)

// 更新
updateFilter(filterId, { operator: '>=', value: 10000 })
```

### useVBIDimensions / useVBIMeasures（回调模式）

```tsx
import { useVBIDimensions, useVBIMeasures } from 'src/hooks'

// 回调模式 — 支持任意 node 方法
const { dimensions, addDimension, removeDimension, updateDimension, findDimension } = useVBIDimensions(builder)
const { measures, addMeasure, removeMeasure, updateMeasure, findMeasure } = useVBIMeasures(builder)

addDimension('category', (node) => {
  node.setEncoding('xAxis')
  node.setSort({ order: 'asc' })
})

updateDimension(dimId, (node) => {
  node.setEncoding('color')
  node.clearAggregate()
})

findDimension(dimId) // 返回 node 或 undefined

addMeasure('sales', (node) => {
  node.setAggregate({ func: 'sum' })
  node.setFormat({ autoFormat: false, prefix: '$', decimalCount: 2 })
})

updateMeasure(meaId, (node) => {
  node.setEncoding('size')
  node.clearSort()
})
```

### useVBIBuilder（locale / theme / limit）

```tsx
import { useVBIBuilder } from 'src/hooks'

const { locale, theme, limit, setLocale, setTheme, setLimit } = useVBIBuilder(builder)

setLocale('zh-CN')
setTheme('dark')
setLimit(1000)
```

### useVBIChartType

```tsx
import { useVBIChartType } from 'src/hooks'

const { chartType, changeChartType, getAvailableChartTypes } = useVBIChartType(builder)

changeChartType('column')
const types = getAvailableChartTypes()
```

### useVBISchemaFields（字段列表）

```tsx
import { useVBISchemaFields } from 'src/hooks'

const { schemaFields, fieldRoleMap, fieldTypeMap } = useVBISchemaFields(builder)
// schemaFields: { name, type, role: 'dimension'|'measure', isDate }[]
// fieldRoleMap: { [fieldName]: 'dimension'|'measure' }
// fieldTypeMap: { [fieldName]: typeString }
```

### useVBIUndoManager

```tsx
import { useVBIUndoManager } from 'src/hooks'

const { canUndo, canRedo, undo, redo, clear } = useVBIUndoManager(builder)

undo() // 撤销
redo() // 重做
clear() // 清空历史
clear(true, false) // 只清空 undo 栈
```

### useFilterRootOperator（切换 and/or 根操作符）

位置：`practices/standard/src/components/Shelves/hooks/useFilterRootOperator.ts`（未从 `src/hooks` 导出，需单独导入）

```tsx
import { useFilterRootOperator } from 'src/components/Shelves/hooks'

const { operator, setOperator } = useFilterRootOperator({
  builder,
  type: 'where', // 或 'having'
})
// operator: 'and' | 'or'
// setOperator('or');
```
