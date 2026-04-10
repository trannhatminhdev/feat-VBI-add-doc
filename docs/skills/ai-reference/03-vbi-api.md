# 3. VBIChartBuilder API

## 3.1 入口说明

`VBIChartBuilder` 不在 `@visactor/vbi` 主入口导出。通过 standard practice 使用：

```ts
// 方式 1：使用 standard 封装好的 builder
import { defaultBuilder } from 'practices/standard/src/utils/demoConnector'

// 方式 2：自行创建
import { VBI } from '@visactor/vbi' // ⚠️ 不在主入口
const builder = VBI.createChart(VBI.generateEmptyChartDSL('connector-id'))
```

---

## 3.2 Builder 实例属性

```ts
builder.doc // Y.Doc，监听 'update' 事件可触发重渲染
builder.dsl // Y.Map<any>，存储完整配置树
builder.undoManager // Y.UndoManager，支持 undo/redo
builder.chartType // 图表类型子构建器
builder.dimensions // 维度子构建器
builder.measures // 度量子构建器
builder.whereFilter // WHERE 过滤子构建器
builder.havingFilter // HAVING 过滤子构建器
builder.theme // 主题子构建器
builder.locale // 语言子构建器
builder.limit // 行数限制子构建器
```

---

## 3.3 Builder 方法

| 方法                            | 说明                                   |
| ------------------------------- | -------------------------------------- |
| `builder.build()`               | 返回 `VBIChartDSL` 快照                |
| `builder.buildVQuery()`         | 返回 `VQueryDSL`（查询 DSL）           |
| `builder.buildVSeed()`          | 返回 `VSeed`（渲染数据，内部自动取数） |
| `builder.isEmpty()`             | 判断是否为空配置                       |
| `builder.getSchema()`           | 异步获取 builder schema                |
| `builder.applyUpdate()`         | 应用 Yjs update                        |
| `builder.encodeStateAsUpdate()` | 将当前状态编码为 Yjs update            |

---

## 3.3.2 Y.Map / Yjs 原生方法

`builder.dsl` 是 `Y.Map<any>`，`builder.doc` 是 `Y.Doc`，可直接使用 Yjs/Y.Map 原生方法：

```ts
// 从 Y.Map 按路径读取值
const whereFilterNode = builder.dsl.get('whereFilter')

// 直接修改 Y.Map（高级用法，需了解 DSL 结构）
whereFilterNode.set('op', 'or')

// 批量 Yjs 事务 — 多个变更合并为一次 undo/redo
builder.doc.transact(() => {
  builder.dimensions.add('category')
  builder.measures.add('sales', (node) => {
    node.setAggregate({ func: 'sum' })
  })
  builder.chartType.changeChartType('column')
})

// 监听 Yjs 文档变化
builder.doc.on('update', () => {
  console.log('配置变了')
})
```

| API                                   | 说明                                                                |
| ------------------------------------- | ------------------------------------------------------------------- |
| `builder.dsl.get(path)`               | 从 Y.Map 中按路径读取值（`path` 如 `'whereFilter'`、`'chartType'`） |
| `builder.dsl.get(path).set(key, val)` | 直接设置 Y.Map 中的值                                               |
| `builder.dsl.observe(fn)`             | 监听 Y.Map 变化                                                     |
| `builder.dsl.unobserve(fn)`           | 取消 Y.Map 监听                                                     |
| `builder.doc.transact(fn)`            | 批量执行 Yjs 事务，多个变更合并为一次 undo/redo                     |
| `builder.doc.on('update', fn)`        | 监听 Yjs 文档更新                                                   |
| `builder.doc.off('update', fn)`       | 取消监听                                                            |

---

## 3.4 子构建器 — ChartType

```ts
// 切换图表类型
builder.chartType.changeChartType('column')

// 获取当前类型
const chartType = builder.chartType.getChartType()

// 获取当前图表支持的度量编码通道
const measureEncodings = builder.chartType.getSupportedMeasureEncodings()
// → ['yAxis', 'size', 'color', 'tooltip', 'label', ...]

// 获取当前图表支持的维度编码通道
const dimEncodings = builder.chartType.getSupportedDimensionEncodings()
// → ['xAxis', 'color', 'detail', 'tooltip', 'label', ...]

// 获取所有可用类型
const types = builder.chartType.getAvailableChartTypes()

// 监听变化
builder.chartType.observe(() => {
  console.log('类型变了:', builder.chartType.getChartType())
})
```

---

## 3.5 子构建器 — Dimensions

```ts
// 添加维度
builder.dimensions.add('category', (node) => {
  node.setAlias('产品类别')
  node.setEncoding('xAxis')
  node.setAggregate({ func: 'toMonth' })
  node.setSort({ order: 'asc' })
})

// 删除维度
builder.dimensions.remove(dimensionId)

// 更新维度
builder.dimensions.update(dimensionId, (node) => {
  node.setAlias('新别名')
  node.setEncoding('color')
  node.setAggregate({ func: 'toYear' })
  node.clearAggregate()
})

// 查询维度
const dims = builder.dimensions.find((d) => d.getField() === 'category')
const all = builder.dimensions.findAll()

// 获取 JSON
const json = builder.dimensions.toJSON()

// 监听变化
builder.dimensions.observe(() => {
  /* ... */
})
```

**DimNodeBuilder 方法**（回调中的 `node`）：

| 方法                          | 说明                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------ |
| `node.getId()`                | 获取维度 ID                                                                    |
| `node.getField()`             | 获取字段名                                                                     |
| `node.getEncoding()`          | 获取当前编码，无则为 undefined                                                 |
| `node.getSort()`              | 获取排序配置，无则为 undefined                                                 |
| `node.setAlias(alias)`        | 设置显示别名                                                                   |
| `node.setEncoding(enc)`       | 设置编码（xAxis/yAxis/color/detail/tooltip/label/row/column/player/hierarchy） |
| `node.setAggregate({ func })` | 设置日期聚合（toYear/toQuarter/toMonth/toWeek/toDay/toHour/toMinute/toSecond） |
| `node.setSort({ order })`     | 设置排序（asc/desc）                                                           |
| `node.clearAggregate()`       | 清除日期聚合                                                                   |
| `node.clearSort()`            | 清除排序                                                                       |

---

## 3.6 子构建器 — Measures

```ts
// 添加度量
builder.measures.add('sales', (node) => {
  node.setAlias('销售额')
  node.setEncoding('yAxis')
  node.setAggregate({ func: 'sum' })
  node.setFormat({ autoFormat: true })
  node.setSort({ order: 'desc' })
})

// 删除度量
builder.measures.remove(measureId)

// 更新度量
builder.measures.update(measureId, (node) => {
  node.setAlias('新别名')
  node.setEncoding('size')
  node.setAggregate({ func: 'avg' })
  node.setFormat({ autoFormat: false, prefix: '$', suffix: '', decimalCount: 2, thousandsSeparator: true })
})

// 查询度量
const meas = builder.measures.find((m) => m.getField() === 'sales')
const all = builder.measures.findAll()

// 获取 JSON
const json = builder.measures.toJSON()

// 监听变化
builder.measures.observe(() => {
  /* ... */
})
```

**MeaNodeBuilder 方法**（回调中的 `node`）：

| 方法                                     | 说明                                                                                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node.getId()`                           | 获取度量 ID                                                                                                                                       |
| `node.getField()`                        | 获取字段名                                                                                                                                        |
| `node.getEncoding()`                     | 获取当前编码，无则为 undefined                                                                                                                    |
| `node.getAggregate()`                    | 获取聚合配置                                                                                                                                      |
| `node.getFormat()`                       | 获取格式配置，无则为 undefined                                                                                                                    |
| `node.getSort()`                         | 获取排序配置，无则为 undefined                                                                                                                    |
| `node.setAlias(alias)`                   | 设置显示别名                                                                                                                                      |
| `node.setEncoding(enc)`                  | 设置编码（yAxis/xAxis/primaryYAxis/secondaryYAxis/angle/radius/size/color/detail/column/label/tooltip/value/q1/q3/min/max/median/outliers/x0/x1） |
| `node.setAggregate({ func, quantile? })` | 设置聚合（count/countDistinct/sum/avg/min/max/variance/variancePop/stddev/median/quantile）                                                       |
| `node.setFormat(cfg)`                    | 设置格式（autoFormat 或手动配置 prefix/suffix/decimalCount/thousandsSeparator）                                                                   |
| `node.setSort({ order })`                | 设置排序                                                                                                                                          |
| `node.clearAggregate()`                  | 清除聚合                                                                                                                                          |
| `node.clearFormat()`                     | 清除格式                                                                                                                                          |
| `node.clearSort()`                       | 清除排序                                                                                                                                          |

---

## 3.7 子构建器 — WhereFilter

```ts
// 添加过滤条件
builder.whereFilter.add('region', (node) => {
  node.setOperator('=')
  node.setValue('华北')
})

// 添加嵌套组
builder.whereFilter.addGroup('and', (group) => {
  group.add('sales', (node) => {
    node.setOperator('>')
    node.setValue(1000)
  })
})

// 更新条件
builder.whereFilter.update(filterId, (node) => {
  node.setOperator('!=')
  node.setValue('华东')
})

// 更新嵌套组
builder.whereFilter.updateGroup(groupId, (group) => {
  group.add('profit', (node) => {
    node.setOperator('<')
    node.setValue(0)
  })
})

// 删除
builder.whereFilter.remove(filterIdOrIndex)

// 清空
builder.whereFilter.clear()

// 查询
const found = builder.whereFilter.find((f) => f.getField() === 'region')

// 获取 JSON
const json = builder.whereFilter.toJSON()

// 监听变化
builder.whereFilter.observe(() => {
  /* ... */
})
```

**WhereNodeBuilder 方法**：

| 方法                      | 说明                                                                      |
| ------------------------- | ------------------------------------------------------------------------- |
| `node.getId()`            | 获取 ID                                                                   |
| `node.getField()`         | 获取字段名                                                                |
| `node.getOperator()`      | 获取操作符                                                                |
| `node.getValue()`         | 获取值                                                                    |
| `node.setField(field)`    | 设置字段名                                                                |
| `node.setOperator(op)`    | 设置操作符（=/!=/>/</>=/<= /contains/startsWith/endsWith/in/not in/date） |
| `node.setValue(val)`      | 设置值                                                                    |
| `node.setDate(predicate)` | 设置日期范围（op=date 时使用）                                            |

---

## 3.8 子构建器 — HavingFilter

```ts
// 添加 HAVING 条件（必须指定聚合函数）
builder.havingFilter.add('sales', (node) => {
  node.setAggregate({ func: 'sum' })
  node.setOperator('>')
  node.setValue(5000)
})

// 添加嵌套组
builder.havingFilter.addGroup('or', (group) => {
  group.add('profit', (node) => {
    node.setAggregate({ func: 'avg' })
    node.setOperator('<')
    node.setValue(100)
  })
})

// 更新
builder.havingFilter.update(filterId, (node) => {
  node.setOperator('>=')
  node.setValue(10000)
})

// 更新组
builder.havingFilter.updateGroup(groupId, (group) => {
  /* ... */
})

// 删除
builder.havingFilter.remove(filterIdOrIndex)

// 清空
builder.havingFilter.clear()

// 查询
const found = builder.havingFilter.find((f) => f.getField() === 'sales')

// 获取 JSON
const json = builder.havingFilter.toJSON()

// 监听变化
builder.havingFilter.observe(() => {
  /* ... */
})
```

**HavingNodeBuilder 方法**：

| 方法                          | 说明                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| `node.getId()`                | 获取 ID                                                                                     |
| `node.getField()`             | 获取字段名                                                                                  |
| `node.getOperator()`          | 获取操作符                                                                                  |
| `node.getAggregate()`         | 获取聚合配置                                                                                |
| `node.getValue()`             | 获取值                                                                                      |
| `node.setOperator(op)`        | 设置操作符（>/</>=/<= /=/!=）                                                               |
| `node.setAggregate({ func })` | 设置聚合（count/countDistinct/sum/avg/min/max/variance/variancePop/stddev/median/quantile） |
| `node.setValue(val)`          | 设置值                                                                                      |

---

## 3.9 子构建器 — Theme / Locale / Limit

```ts
// 主题
builder.theme.setTheme('dark')
builder.theme.setTheme('light')
const theme = builder.theme.getTheme()

// 语言
builder.locale.setLocale('zh-CN')
builder.locale.setLocale('en-US')
const locale = builder.locale.getLocale()

// 行数限制
builder.limit.setLimit(1000)
const limit = builder.limit.getLimit()
```

---

## 3.10 子构建器 — UndoManager

```ts
// 撤销 / 重做
builder.undoManager.undo()
builder.undoManager.redo()

// 判断能否撤销 / 重做
const canUndo = builder.undoManager.canUndo()
const canRedo = builder.undoManager.canRedo()

// 清空撤销栈
builder.undoManager.clear()
builder.undoManager.clear(true, true) // 清空 undo 和 redo
```
