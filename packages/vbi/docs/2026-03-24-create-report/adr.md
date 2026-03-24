# ADR-006: VBI Report DSL 与 ReportBuilder

## Context

`ADR-005` 已把单图表能力收敛为 `createChart`、`VBIChartBuilder`、`VBIChartDSL`，现在可以在不混淆命名的前提下引入 report。

本任务只解决 `packages/vbi` 内的 report 建模与 builder 设计：

1. 新增 `VBI.createReport(...)`，让 report 成为和 chart 平级的一等入口。
2. 一个 `report` 包含多个 `page`，一个 `page` 固定包含一个 `chart` 和一个 `text`。
3. `VBIReportDSL`、zod schema、空 DSL helper 的风格与 `VBIChartDSL` 保持一致。
4. `reportBuilder` 的使用、实现、协同编辑方式尽量复用 `chartBuilder`。

这里有三个直接风险：

1. report 根节点重复定义 chart 字段，会破坏 Single Source of Truth。
2. 一开始就抽象成通用 widgets/layout system，会明显超出当前需求。
3. report 另起一套 chart 编辑逻辑，chart/report 很快会发生行为漂移。

## Decision

### 1. 根入口统一为 `createReport(...)`

新增并文档化以下入口：

```ts
VBI.createReport(vbiReport, options)
createVBI(...).createReport(vbiReport, options)
```

对外命名统一为 `VBIReportDSL` / `VBIReportDSLInput` / `zVBIReportDSL` / `generateEmptyReportDSL` / `generateEmptyReportPageDSL` / `VBIReportBuilder` / `VBIReportBuilderInterface` / `VBIReportBuilderOptions`。`chart` 和 `report` 是 `VBI` 下的两个平级能力。

### 2. `types/dsl` 改名为 `types/chartDSL`，并与 `types/reportDSL` 平级

当前 `types/dsl` 实际承载的是 chart 领域模型，不适合在引入 report 后继续占用泛化名字。目录应调整为：

1. `types/chartDSL/*`：现有 `VBIChartDSL` 及其子节点 schema。
2. `types/reportDSL/*`：新增 `VBIReportDSL`、`VBIReportPageDSL`、`VBIReportTextDSL`。
3. `types/index.ts` 只负责聚合导出，不再让 `chart` 和 `report` 共用 `dsl` 这个模糊目录名。

### 3. Report DSL 采用固定 page 结构，不做通用 block union

首期 DSL 固定为：

```ts
type VBIReportTextDSL = { content: string }
type VBIReportPageDSL = { id: string; title: string; chart: VBIChartDSL; text: VBIReportTextDSL }
type VBIReportDSL = { pages: VBIReportPageDSL[]; version: number }
```

约束如下：

1. `pages` 必须是数组，因为页面顺序本身就是业务语义。
2. `page.title` 是 page 的显示名，`page.add('Story One', ...)` 的第一个参数直接写入这里。
3. `page.chart` 直接内嵌 `VBIChartDSL`，它是图表配置的唯一事实来源。
4. `page.text` 先保持极简对象 `{ content }`，不在首期引入 rich-text schema。
5. `report` 根节点不新增 `connectorId`，避免和 `page.chart.connectorId` 双写。

### 4. 默认值与空 DSL helper 保持 chart 风格

首期 helper 约定如下：

```ts
generateEmptyReportDSL() => { pages: [], version: 0 }
generateEmptyReportPageDSL(connectorId) => ({ id, title: '', chart: generateEmptyChartDSL(connectorId), text: { content: '' } })
```

`zVBIReportDSL` 与 `zVBIReportPageDSL` 也应使用同风格默认值，让 `build()` 产物保持稳定、最小、可预测。

### 5. `VBIReportBuilder` 提供 `reportBuilder.page.*`；图表 lowering 仍由 page.chart 负责

首期 builder 结构固定为：

```ts
class VBIReportBuilder {
  page: ReportPageCollectionBuilder
  build(): VBIReportDSL
  isEmpty(): boolean
  applyUpdate(...)
  encodeStateAsUpdate(...)
}
class ReportPageBuilder {
  setChart(chartBuilder: VBIChartBuilder): this
  setText(content: string): this
}
```

其中：

1. `reportBuilder.page.add(title, callback)` / `remove(id)` / `update(id, callback)` 是主入口，`add` 与 `update` 都返回 reportBuilder 以便链式调用。
2. 推荐用法固定为 `reportBuilder.page.add('Story One', page => page.setChart(chartBuilder).setText('hello world'))`。
3. `setChart(chartBuilder)` 会把传入 `chartBuilder.build()` 的结果复制到当前 page 的 `chart` 子树，而不是共享同一个 builder 实例。
4. `VBIReportBuilder` 不提供 report 级 `buildVQuery()` / `buildVSeed()`；这些能力仍属于 `page.chart`。

### 6. 实现上复用同一套 chart builder 内核

内部实现采用“同一套 chart builder 绑定不同 DSL map”的策略：

1. report 的每个 `page.chart` 在 Yjs 中保存为独立 `Y.Map`。
2. `ReportPageBuilder.chart` 直接复用 `VBIChartBuilder`，但绑定到 `page.chart` 子树，而不是根 `doc.getMap('dsl')`。
3. `VBI.createChart(...)` 只是“chart builder 绑定根 DSL map”的特例；report page 内则绑定子 map。
4. `VBIReportBuilderOptions` 只负责把 chart 相关 adapters/options 透传给每个 `page.chart` builder。

## Reference

`packages/vbi/docs/2026-03-23-create-chart/adr.md`, `packages/vbi/src/vbi/create-vbi.ts`, `packages/vbi/src/vbi/generate-empty-dsl.ts`, `packages/vbi/src/builder/builder.ts`
`packages/vbi/src/types/builder/VBIInterface.ts`, `packages/vbi/src/types/dsl/vbi/vbi.ts`, `packages/vbi/docs/todo3-create-report/goal.md`

## 淘汰内容概述

- 不把 page 设计成通用 `blocks: Array<Widget>`
- 不继续保留泛化的 `types/dsl` 目录名
- 不在 report 根节点重复保存 chart 的 `connectorId` 等字段
- 不新增 report 级 `buildVQuery()` / `buildVSeed()`
- 不为 report 另写一套独立 chart 编辑与 lowering 逻辑
- 不在首期支持“一个 page 多个 chart”或富文本样式系统
