# ADR: packages/vbi 的 report 改为引用型资源模型

## Summary

`packages/vbi` 不再把 report 当作内嵌 chart/text 内容的组合文档，而改为“结构文档”：

- `report` 只保存 page 顺序、标题和资源引用
- `chart` 继续作为独立内容资源
- `insight` 新增为独立内容资源
- `createVBI()` 维护当前实例级 `ResourceRegistry`
- `reportBuilder.snapshot()` 返回完整聚合快照，而 `build()` 继续返回结构 DSL

这样可以让前后端围绕统一资源模型工作，避免 report 同时承担结构和内容两种职责。

## Decision

### 1. Report page 改为引用结构

`VBIReportPageDSL` 从：

- `{ chart: VBIChartDSL, text: { content } }`

调整为：

- `{ chartId: string, insightId: string }`

`VBIReportDSL` 只负责 page 集合、顺序、标题、版本等结构信息。

同时新增：

- `VBIReportSnapshotDSL = { report, charts, insights }`

它只用于 `snapshot()` 导出完整闭包内容，不作为新的运行时事实源。

### 2. 新增独立 insight 资源

新增 `VBIInsightDSL` 与对应 schema、empty helper、builder 入口。

对外 API 统一为：

- `VBI.createChart(...)`
- `VBI.createReport(...)`
- `VBI.createInsight(...)`

`createVBI()` 内部集成 `ResourceRegistry`，用于维护当前实例已装载资源：

- `charts: Map<chartId, chart builder | chart DSL>`
- `insights: Map<insightId, insight builder | insight DSL>`
- `reports: Map<reportId, report builder | report DSL>`

### 3. ReportBuilder 提供结构构建与纯 DSL 快照

`reportBuilder.build()` 返回 `VBIReportDSL`，只包含结构和引用。

`reportBuilder.snapshot()` 返回 `VBIReportSnapshotDSL`：

- 遍历 report page 上的 `chartId` / `insightId`
- 从当前实例的 `ResourceRegistry` 中收集对应资源
- 只做本地聚合，不触发任何业务层 IO

### 4. ReportBuilder 不负责资源创建

`reportBuilder.page.*` 只读写 page 结构和资源引用：

- add
- update
- remove
- get

子资源的创建、复用、删除校验由应用服务层负责，不放进 builder。

## Consequences

优点：

- report / chart / insight 边界清晰
- chart 与 insight 可被多个 report 复用
- builder 与后端资源模型天然对齐
- `snapshot()` 能在纯 DSL 层导出完整 report 闭包

代价：

- 旧的 `page.setChart(...)`、`page.setText(...)` API 需要迁移
- 需要在 `createVBI()` 内维护实例级 registry 生命周期
- `standard-report` 必须改成依赖 `resourceGateway` 的组合式入口
