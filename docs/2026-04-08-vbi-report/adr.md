# ADR: vbi_fe / vbi_be 接入 standard-report 的资源化报表方案

## Summary

目标不是把 practices/standard-report 原样塞进 vbi_fe，而是把前后端从“单 chart document”升级为“多资源协同系统”：

- 资源不能继续统一落在单一 `Document / DocumentUpdate` 存储模型里，而要拆为可复用的资源中心与引用关系，至少支持 `'chart' | 'report' | 'insight'`
- 每个资源独立 YDoc、独立 room；room 命名统一为 `{type}:{id}`
- report 不再内嵌 chart / text DSL，而只保存 page 结构和资源引用
- `packages/vbi` 内部区分“结构 DSL”与“聚合快照 DSL”：`build()` 返回引用型 `VBIReportDSL`，`snapshot()` 返回完整闭包内容
- vbi_fe 保留 chart 与 report 双入口；insight 作为可被多个 report 复用的资源，不默认暴露在顶层列表创建入口
- standard-report 从“接收内嵌 VBIReportBuilder”调整为“接收 report builder + 资源访问器”，内部按 page 引用挂载子资源

## Key Changes

### 1. 领域建模改为“引用型 report”

需要把当前 packages/vbi 的 report 建模从内嵌子 DSL 改成引用式：

- VBIReportPageDSL 从 { chart: VBIChartDSL, text: { content } } 改为 { chartId: string, insightId: string }
- VBIReportDSL 继续只保存 pages 顺序、title、version，不承担子资源内容
- 新增独立 VBIInsightDSL，作为 insight 资源的协同内容模型
- 新增 `VBIReportSnapshotDSL = { report, charts, insights }`，作为 `reportBuilder.snapshot()` 的返回值
- `createVBI()` 实例内置 `ResourceRegistry`，保存当前 DSL 工作区已装载的 chart / report / insight builder 或 DSL
- reportBuilder.page.add(...) 只负责 page 结构；子资源创建由应用服务层负责，不在 builder 内隐式创建数据库记录

对外接口要明确调整：

- VBI.createReport(...) 产出的 builder 默认面向“结构文档”
- VBI.createChart(...) 继续面向 chart 资源
- 新增 VBI.createInsight(...) 或等价 builder 入口
- `reportBuilder.build(): VBIReportDSL`
- `reportBuilder.snapshot(): VBIReportSnapshotDSL`
- `snapshot()` 只汇总当前 `ResourceRegistry` 中已装载资源，不触发任何业务层 IO
- standard-report 的公共入口改为接收：
  - reportBuilder
  - resourceGateway，至少提供 openChart(chartId)、openInsight(insightId)、createChart()、createInsight()、resolveReference(ids)

需要明确边界：

- `VBIReportDSL` 是运行时结构事实源
- `VBIChartDSL` / `VBIInsightDSL` 是各自资源的内容事实源
- `VBIReportSnapshotDSL` 只是导出、复制、预加载时使用的聚合快照，不反向成为新的运行时事实源
- `ResourceRegistry` 属于 `createVBI()` 实例上下文，不进入资源 DSL 本体

### 2. vbi_be 改为“资源主表 + 引用关系”，而不是单表承载全部资源

后端不能继续沿用“一个 `document` 表承载所有资源”的模式，而要拆出资源主表与引用关系：

- 新增 `Resource` 主表，统一记录 `id`、`type`、名称、元数据、创建更新时间
- 协同快照和增量更新从 `Document / DocumentUpdate` 迁移为面向 `resource_id` 的存储，例如 `ResourceSnapshot / ResourceUpdate`
- `Report` 结构内容仍然保存在 `type='report'` 的资源文档中，但它只保存 page 与引用，不直接拥有 chart/insight 生命周期
- 新增引用关系表，至少表达：
  - report 引用哪些 chart / insight
  - 某个 chart / insight 被哪些 report page 引用
- 后端提供资源查询与引用编排接口，而不是 page 删除即级联删资源：
  - 创建 report 时，只保证首个 page 能拿到引用资源
  - 新增 page 时，可创建新资源，也可绑定已有资源
  - 删除 page 时，只删除 report 内的引用关系，不删除被引用资源
  - 删除资源前必须检查是否仍被其他 report 引用
- Hocuspocus `onLoadDocument` 按 `type` 初始化空文档：
  - chart -> 空 chart DSL
  - report -> 空 report-ref DSL
  - insight -> 空 insight DSL
- 协同房间统一使用 `type:id`，避免不同资源类型共享同一 room 语义

### 3. vbi_fe 改为“资源列表 + 按类型进入编辑器”

前端入口按你确认的“双入口并存”设计：

- 列表页仍是一个列表，但创建时允许选择 Chart 或 Report
- 列表项展示 `type` tag
- 路由拆分为：
  - /chart/:id
  - /report/:id
- 原 DocumentEditorPage 保留为 chart 编辑页，继续挂 standard
- 新增 ReportEditorPage，挂 standard-report

前端协同层改为通用资源 hook：

- 现有 `useCollaborativeBuilder` 抽象为按 `type` 创建 builder 的工厂
- chart 页只连接一个 room
- report 页连接 report room；页面内 chart/insight preview/edit 再按需连接对应子 room
- report 页默认只连接当前 active page 所需的 chart/insight room，非激活页资源按需懒加载
- report 页不自己拼装 chart DSL；始终通过 chartId / insightId 打开子资源

### 4. standard-report 改为资源编排壳层，而不是内嵌 report editor

standard-report 的职责边界需要收敛为：

- 它只负责 report page 容器、切页、active page、全屏编辑态、page 生命周期动作
- page 内图表区通过 chartId 打开 standard 的 view / edit 模式
- page 内洞察区通过 insightId 打开 insight 资源编辑器或只读视图
- 新增 page 时，不直接调用 reportBuilder.page.add 完事，而是先选择“创建新资源”或“引用已有资源”，再把引用写入 report
- 删除 page 时，只删除 report 结构中的引用，不触发 chart/insight 资源清理

这样能保证：

- report 是结构文档
- chart/insight 是内容文档
- chart/insight 可以被多个 report 复用
- report 可以在纯 DSL 层通过 `snapshot()` 导出完整闭包内容
- standard 仍是 chart 体验唯一来源
- standard-report 不再依赖旧的“page 内嵌 chart/text”假设

必须覆盖以下场景：

- 创建 chart 文档后，列表展示为 chart，进入 /chart/:id 可正常协同编辑
- 创建 report 文档后，后端会自动为首个 page 建立可用引用，且这些资源后续可被其他 report 复用
- report 文档首次打开时，能基于 chartId / insightId 正确渲染第一页
- report 内新增 page 时，可以选择新建 chart/insight 资源，也可以绑定已有资源，且新 page 自动激活
- 删除 page 时，只移除引用关系，report 激活页回退到合法 page，被引用资源仍可被其他 report 使用
- 同时打开两个 chart 页、一个 report 页时，多个 room 互不串写
- 同一 chart 或 insight 被两个 report 引用时，在任一 report 中编辑后，另一 report 中应看到同一资源的最新结果
- report 页中编辑某个 chart 后，返回 report 视图能看到更新；切换 page 不影响其他 chart room
- insight 资源编辑只影响对应 insightId，不会污染 report 结构文档
- `reportBuilder.snapshot()` 在不调用业务接口的前提下，能返回当前 report 引用到的完整 chart / insight DSL 闭包
- Hocuspocus 对不同 `type` 能正确初始化空文档，且 `type:id` room 能恢复快照与增量更新

## Assumptions

- 本次 ADR 接受 packages/vbi report 模型从“内嵌 chart/text”升级为“引用 chart/insight”，这是接入方案成立的前提
- insight 不是 report 私有子资源，而是可独立被引用的资源；首期不作为顶层常用创建入口暴露
- report 的 page 顺序、标题、active page 仍由 report 文档自身负责，子资源不反向保存 report 结构
- chart 与 insight 必须支持跨 report 复用；删除 page 只删除引用，不删除资源本体
- 删除资源本体前必须经过引用校验，避免破坏其他 report
- `ResourceRegistry` 只代表当前 `createVBI()` 实例内已装载资源，不负责远端拉取、持久化或引用校验
- 不重新引入泛化根事实模型 `VBIDSL`；聚合能力通过 `VBIReportSnapshotDSL` 表达
- 不引入 report 根级 buildVQuery() / buildVSeed()；查询与渲染仍属于 chart 资源
