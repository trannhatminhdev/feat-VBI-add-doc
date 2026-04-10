# 3. Builder API 速查

以下 API 来自 `VBIChartBuilder` 实例（`builder`），通过 `demoConnector.ts` 获取。

---

## 3.1 Builder 实例属性

```ts
builder.doc // Y.Doc，监听 'update' 事件触发重渲染
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

## 3.2 Builder 方法

```ts
builder.build() // → VBIChartDSL 快照
builder.buildVQuery() // → VQueryDSL（查询 DSL）
builder.buildVSeed() // → VSeed（渲染数据，内部自动取数）
builder.isEmpty() // → boolean，判断是否为空配置
builder.getSchema() // → Promise<DatasetColumn[]>，获取字段列表
builder.applyUpdate(update) // 应用 Yjs update
builder.encodeStateAsUpdate() // 将当前状态编码为 Yjs update
```

---

## 3.3 子构建器方法速查

### chartType

```ts
builder.chartType.changeChartType(type: string)           // 切换图表类型
builder.chartType.getChartType()                          // → string，当前类型
builder.chartType.getAvailableChartTypes()                // → string[]，所有可用类型
builder.chartType.getSupportedMeasureEncodings()          // → MeasureEncoding[]，支持的度量编码
builder.chartType.getSupportedDimensionEncodings()         // → DimensionEncoding[]，支持的维度编码
```

### dimensions

```ts
builder.dimensions.add(field, (node) => { ... })          // 添加维度
builder.dimensions.remove(id)                             // 删除维度
builder.dimensions.update(id, (node) => { ... })        // 更新维度
builder.dimensions.find(fn)                               // 查找维度节点
builder.dimensions.findAll()                             // → node[]
builder.dimensions.toJSON()                               // → VBIDimension[]
builder.dimensions.observe(fn)                            // 监听变化
```

### measures

```ts
builder.measures.add(field, (node) => { ... })            // 添加度量
builder.measures.remove(id)                               // 删除度量
builder.measures.update(id, (node) => { ... })          // 更新度量
builder.measures.find(fn)                                 // 查找度量节点
builder.measures.findAll()                               // → node[]
builder.measures.toJSON()                                 // → VBIMeasure[]
builder.measures.observe(fn)                              // 监听变化
```

### whereFilter

```ts
builder.whereFilter.add(field, (node) => { ... })         // 添加过滤条件
builder.whereFilter.addGroup(op, (group) => { ... })      // 添加嵌套组
builder.whereFilter.update(id, (node) => { ... })         // 更新条件
builder.whereFilter.updateGroup(id, (group) => { ... })   // 更新组
builder.whereFilter.remove(idOrIndex)                     // 删除
builder.whereFilter.clear()                               // 清空
builder.whereFilter.find(fn)                             // 查找
builder.whereFilter.toJSON()                             // → VBIWhereGroup
builder.whereFilter.observe(fn)                          // 监听变化
```

### havingFilter

```ts
builder.havingFilter.add(field, (node) => { ... })         // 添加 HAVING 条件
builder.havingFilter.addGroup(op, (group) => { ... })    // 添加嵌套组
builder.havingFilter.update(id, (node) => { ... })        // 更新条件
builder.havingFilter.remove(idOrIndex)                   // 删除
builder.havingFilter.clear()                             // 清空
builder.havingFilter.find(fn)                           // 查找
builder.havingFilter.toJSON()                            // → VBIHavingGroup
builder.havingFilter.observe(fn)                        // 监听变化
```

### theme / locale / limit

```ts
builder.theme.setTheme('dark' | 'light')   // 设置主题
builder.theme.getTheme()                    // → 'dark' | 'light'
builder.locale.setLocale('zh-CN' | 'en-US') // 设置语言
builder.locale.getLocale()               // → 'zh-CN' | 'en-US'
builder.limit.setLimit(n: number)         // 设置行数限制
builder.limit.getLimit()                   // → number
```

### undoManager

```ts
builder.undoManager.undo()                    // 撤销
builder.undoManager.redo()                    // 重做
builder.undoManager.canUndo()                 // → boolean
builder.undoManager.canRedo()                // → boolean
builder.undoManager.clear(undo?, redo?)      // 清空历史
```

---

## 3.4 Node 方法速查

回调中的 `node` 参数类型和可用方法：

### DimNodeBuilder

```ts
node.getId()                          // → string
node.getField()                       // → string
node.getEncoding()                    // → DimEncoding | undefined
node.setEncoding('xAxis' | 'color' | ...)  // 设置编码
node.getSort()                        // → { order: 'asc'|'desc' } | undefined
node.setSort({ order: 'asc' })       // 设置排序
node.clearSort()                      // 清除排序
node.setAlias('别名')                 // 设置别名
node.setAggregate({ func: 'toMonth' }) // 设置日期聚合
node.clearAggregate()                // 清除聚合
```

### MeaNodeBuilder

```ts
node.getId()
node.getField()
node.getEncoding()                   // → MeaEncoding | undefined
node.setEncoding('yAxis' | 'size' | 'color' | ...)
node.getAggregate()                  // → { func: string; quantile?: number } | undefined
node.setAggregate({ func: 'sum' })
node.getFormat()                     // → VBIMeasureFormat | undefined
node.setFormat({ autoFormat: false, prefix: '$', decimalCount: 2 })
node.clearFormat()
node.getSort()
node.setSort({ order: 'desc' })
node.clearSort()
node.setAlias('别名')
```

### WhereNodeBuilder

```ts
node.getId()
node.getField()
node.getOperator()                   // → string
node.setOperator('=' | '!=' | '>' | 'contains' | 'in' | 'date' | ...)
node.getValue()                      // → unknown
node.setValue('华北')
node.setDate({ type: 'relative', mode: 'last', amount: 30, unit: 'day' })
```

### HavingNodeBuilder

```ts
node.getId()
node.getField()
node.getOperator() // → string
node.setOperator('>' | '<' | '>=' | '<=' | '=' | '!=')
node.getAggregate() // → { func: string; quantile?: number }
node.setAggregate({ func: 'sum' })
node.getValue()
node.setValue(5000)
```

---

## 3.5 Y.Map / Y.Doc 原生方法

```ts
// 从 Y.Map 按路径读取值
builder.dsl.get('chartType') // → 'column'

// 直接修改 Y.Map（高级用法）
builder.dsl.get('whereFilter').set('op', 'or')

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
  /* 配置变了 */
})
builder.dsl.observe((event) => {
  /* Y.Map 变更事件 */
})
```
