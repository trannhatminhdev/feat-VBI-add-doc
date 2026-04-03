# 1. 核心概念

## 1.1 数据流

```
用户配置 (DSL) → VBIChartBuilder → VQuery (SQL) → VSeed (渲染 Spec) → 图表渲染
```

| 概念              | 说明                                                               |
| ----------------- | ------------------------------------------------------------------ |
| `VBIChartBuilder` | Yjs-backed 配置构建器，所有图表配置通过其子 builder 管理           |
| `VBIChartDSL`     | 配置的 JSON 快照（`builder.build()` 返回）                         |
| `VQueryDSL`       | 生成的 SQL 查询 DSL（`builder.buildVQuery()` 返回）                |
| `VSeed`           | 渲染层 Spec（`builder.buildVSeed()` 返回），可传递给 VChart/VTable |
| `connectorId`     | 数据源标识符，需先通过 `VBI.registerConnector()` 注册              |

## 1.2 Yjs Doc 结构

`VBIChartBuilder` 内部持有一个 `Y.Doc` 和 `Y.Map<any>`（`builder.dsl`）。所有配置变更都是 Yjs 事务，天然支持协同编辑和 Undo/Redo。

```ts
builder.doc // Y.Doc 实例，监听 'update' 事件可触发重渲染
builder.dsl // Y.Map<any>，存储完整配置树
builder.undoManager // Y.UndoManager，支持 undo/redo
```

### Yjs 更新 → UI 重渲染链路

当 AI 调用 Builder API（如 `builder.dimensions.add()`）时：

1. Yjs 事务执行，`doc` 触发 `'update'` 事件
2. `useVSeed` / `useDimensions` / `useMeasures` 等 hook 监听到变化
3. React 组件自动重新渲染，调用 `builder.buildVSeed()` 获取新 Spec
4. 图表组件用新 Spec 重新渲染

这条链路是**自动的**，AI 只需调用 Builder API 即可触发 UI 更新。

## 1.3 Builder 子构建器概览

| 子 Builder             | 职责        | 关键方法                                           |
| ---------------------- | ----------- | -------------------------------------------------- |
| `builder.chartType`    | 图表类型    | `changeChartType(type)`                            |
| `builder.dimensions`   | 维度配置    | `add(field, cb)`, `remove(id)`, `update(id, cb)`   |
| `builder.measures`     | 度量配置    | `add(field, cb)`, `remove(id)`, `update(id, cb)`   |
| `builder.whereFilter`  | WHERE 过滤  | `add(field, cb)`, `addGroup(op, cb)`, `remove(id)` |
| `builder.havingFilter` | HAVING 过滤 | `add(field, cb)`, `addGroup(op, cb)`, `remove(id)` |
| `builder.theme`        | 主题        | `setTheme('light' \| 'dark')`                      |
| `builder.locale`       | 语言        | `setLocale('zh-CN' \| 'en-US')`                    |
| `builder.limit`        | 行数限制    | `setLimit(n: number)`                              |
| `builder.undoManager`  | Undo/Redo   | `undo()`, `redo()`, `canUndo()`, `canRedo()`       |

## 1.4 支持的图表类型

| 类型        | 值                                      | 说明            |
| ----------- | --------------------------------------- | --------------- |
| 表格        | `table`                                 | 普通列表表格    |
| 透视表      | `pivotTable`                            | 交叉透视表格    |
| 柱状图      | `column`                                | 垂直柱状图      |
| 条形图      | `bar`                                   | 水平条形图      |
| 折线图      | `line`                                  | 折线图          |
| 面积图      | `area`                                  | 面积图          |
| 饼图        | `pie`                                   | 饼图            |
| 环形图      | `donut`                                 | 环形图          |
| 玫瑰图      | `rose`                                  | 南丁格尔玫瑰图  |
| 散点图      | `scatter`                               | 散点图          |
| 双轴图      | `dualAxis`                              | 双 Y 轴图       |
| 雷达图      | `radar`                                 | 雷达图          |
| 漏斗图      | `funnel`                                | 漏斗图          |
| 热力图      | `heatmap`                               | 热力图          |
| 箱线图      | `boxPlot`                               | 箱线图          |
| 直方图      | `histogram`                             | 直方图          |
| 旭日图      | `sunburst`                              | 旭日图          |
| 树图        | `treeMap`                               | 矩形树图        |
| 圆填充图    | `circlePacking`                         | 圆形填充图      |
| 动态排名图  | `raceBar/Column/Line/Scatter/Pie/Donut` | 动态排名动画图  |
| 平行柱/条   | `columnParallel/barParallel`            | 平行坐标柱/条图 |
| 百分比柱/条 | `columnPercent/barPercent`              | 百分比柱/条形图 |
