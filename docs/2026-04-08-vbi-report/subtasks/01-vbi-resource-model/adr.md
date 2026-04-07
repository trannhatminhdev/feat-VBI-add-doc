# ADR: packages/vbi 的 report 改为引用型资源模型

## Summary

`packages/vbi` 不再把 report 当作内嵌 chart/text 内容的组合文档，而改为“结构文档”：

- `report` 只保存 page 顺序、标题和资源引用
- `chart` 继续作为独立内容资源
- `insight` 新增为独立内容资源

这样可以让前后端围绕统一资源模型工作，避免 report 同时承担结构和内容两种职责。

## Decision

### 1. Report page 改为引用结构

`VBIReportPageDSL` 从：

- `{ chart: VBIChartDSL, text: { content } }`

调整为：

- `{ chartId: string, insightId: string }`

`VBIReportDSL` 只负责 page 集合、顺序、标题、版本等结构信息。

### 2. 新增独立 insight 资源

新增 `VBIInsightDSL` 与对应 schema、empty helper、builder 入口。

对外 API 统一为：

- `VBI.createChart(...)`
- `VBI.createReport(...)`
- `VBI.createInsight(...)`

### 3. ReportBuilder 只处理结构，不负责资源创建

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

代价：

- 旧的 `page.setChart(...)`、`page.setText(...)` API 需要迁移
- `standard-report` 必须改成依赖 `resourceGateway` 的组合式入口
