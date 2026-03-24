# ADR-003: practices/standard-report 图表 view/edit 复用 standard 与全屏过渡

## Status

Proposed

## Context

`practices/standard-report` 当前已经跑通“报表分页 + 单页单图 + 点击编辑”的基础链路，但图表预览和图表编辑仍然走了两条不同实现：

1. 报表页内预览走 `usePagePreview(...)` + `pageBuilder.chart.buildVSeed()` + `VSeedRender`。
2. 点击编辑后，`ReportEditorDrawer` 内直接挂载 `StandardAPP builder={pageBuilder.chart}`。

这会带来 4 个直接问题：

1. `standard-report` 实际维护了一套自己的图表预览实现，和 `practices/standard` 的图表工作台已经开始分叉。
2. 以后只要 `standard` 的图表渲染壳层、空态、主题或交互细节发生变化，`standard-report` 都需要再补一遍。
3. 当前编辑器通过 `Drawer width="100vw"` 打开，本质上仍是“侧边抽屉滑入”，不是“从当前图表卡片放大到全屏”，上下文连续性不够好。
4. `practices/standard` 目前使用模块级 zustand store 单例，天然更偏“单个 demo app”，不适合被 `standard-report` 同时作为 preview surface 和 editor surface 复用。

本次目标不是在 `standard-report` 里继续补一套 preview/editor 壳子，而是把 `practices/standard` 收敛为唯一图表体验来源，让：

1. `standard-report` 内图表预览使用 `practices/standard`。
2. `standard-report` 内图表编辑也使用 `practices/standard`。
3. `practices/standard` 只新增 `view mode` 和 `edit mode`，不再让 `standard-report` 自己拼装另一套图表界面。
4. 点击编辑后，图表卡片能够以平滑动画放大到视口级全屏编辑态。

## Decision

### 1. `practices/standard` 从“单 demo app”升级为“可嵌入的 mode-driven chart practice”

接口约束：

1. `APP` 新增 `mode?: 'view' | 'edit'`，默认值保持为 `edit`。
2. `edit mode` 保持当前工作台定位，继续承载 `Toolbar + FieldsPanel + ShelfPanel + ChartPanel`。
3. `view mode` 使用同一个 builder 初始化流程、同一套主题/语言配置和同一条 `buildVSeed()` 渲染链路，但只暴露只读图表展示壳层。
4. `view mode` 不提供拖拽字段、切图表类型、撤销重做、筛选编辑等重交互入口。
5. `practices/standard` 仍然是图表体验的唯一来源；`standard-report` 不再直接决定图表区内部结构。

原因：

1. 需求已经明确“图表预览和编辑都是用 `practices/standard` 来实现”。
2. preview 和 edit 的差异本质上是“同一图表体验的两种模式”，不是两个独立产品。
3. 让 mode 收敛在 `standard` 内部，比让 `standard-report` 继续拼装一套 preview 壳层更符合 Single Source of Truth。

### 2. `practices/standard` 的状态管理改为实例级，而不是模块级单例

实现约束：

1. 当前 `useVBIStore = create(...)` 的模块级单例要重构为 store factory + provider，或等价的实例级状态容器。
2. 每次挂载 `StandardAPP` 都应拥有独立的 `loading / initialized / vseed` 等派生状态。
3. 多个 `StandardAPP` 可以同时存在，互不覆盖 UI 状态和事件绑定。
4. `VBIChartBuilder` 仍然是 chart DSL 的唯一事实来源；实例级 store 只负责派生 UI 状态，不复制 DSL。

原因：

1. 报表页内 preview surface、放大全屏过程中的 transition surface、最终 editor surface 可能在一个交互过程中短暂共存。
2. 如果继续沿用单例 store，多个 `StandardAPP` 会互相覆盖 `builder / vseed / initialized`，无法稳定复用。
3. 只有先把 `standard` 变成真正可复用实例，`view mode` 和 `edit mode` 才是可靠架构，而不是表面 props 分支。

### 3. `standard-report` 的图表预览改为直接挂载 `standard` 的 `view mode`

边界划分：

1. `standard-report` 继续负责 page 壳层、翻页、页级 action、洞察文本等 report 语义。
2. page 内“图表区域”统一改为 `StandardAPP mode="view" builder={pageBuilder.chart}` 或等价复用入口。
3. `standard-report` 不再直接调用 `pageBuilder.chart.buildVSeed()` 去生成图表预览。
4. `usePagePreview.ts`、`PagePreviewCanvas.tsx` 这类“report 自己拼的图表预览链路”应退出主路径。

原因：

1. preview 既然要复用 `standard`，就不能继续让 `standard-report` 保留第二条图表渲染实现。
2. 这能保证 view/edit 两态使用同一条图表构建链路、同一套空态和同一套主题逻辑。
3. `standard-report` 应该聚焦 report 容器和转场，而不是再拥有一套 chart preview 子系统。

### 4. `standard-report` 的编辑态继续由 report 壳层调度，但内容统一来自 `standard` 的 `edit mode`

实现约束：

1. page 上的“编辑图表”动作仍由 `standard-report` 发起，因为当前上下文属于 report page。
2. 全屏编辑区内部统一挂载 `StandardAPP mode="edit" builder={pageBuilder.chart}`。
3. `standard-report` 只管理打开、关闭、当前 page、过渡动画与返回行为，不再负责图表编辑 UI 本身。
4. `practices/standard` 原本的浏览器 Fullscreen API 能力保留给 standalone 使用；嵌入到 report 全屏层时，不再把它作为主交互模型。

原因：

1. “我正在编辑哪一个 report page 的 chart” 是 report 语义；“如何编辑 chart” 是 standard 语义。
2. 这样职责边界清晰，后续 chart editor 的演进只需要改 `practices/standard`。
3. report 全屏态和浏览器 Fullscreen API 不是一回事，不应混为同一个交互概念。

### 5. 图表放大全屏采用 report 侧自定义 transition layer，不继续依赖 `Drawer` 作为主过渡

过渡方案：

1. 点击编辑时，先记录当前图表预览容器的 `DOMRect`、圆角和阴影参数。
2. `standard-report` 在 portal 中创建固定定位的 transition layer。
3. transition layer 初始尺寸与被点击图表卡片一致，随后通过 CSS transform / size / radius 过渡扩展到 `100vw x 100vh`。
4. 进入动画结束后，再切换到稳定的 `edit mode` 布局；关闭时反向执行同一路径。
5. 如果拿不到源节点尺寸，则退化为居中淡入/缩放，不阻塞主流程。

明确不做：

1. 不再把 `Drawer width="100vw"` 视为“放大到全屏”的实现方式。
2. 不把浏览器 `requestFullscreen()` 作为 report 编辑态主入口。
3. 不把浏览器专属 View Transition API 设为硬依赖。

原因：

1. Ant Design `Drawer` 的默认语义是从边缘滑入，更适合上下文内子任务，不适合“从当前卡片放大到全屏”的共享元素过渡。
2. 目标是提升从 report preview 到 chart edit 的空间连续性，过渡起点必须是当前图表卡片，而不是视口边缘。
3. 采用 React + CSS 可控过渡层更稳妥，也更容易做关闭时的反向收拢动画。

### 6. `view mode` 与 `edit mode` 的切换只改变表现层，不改变 builder 归属

状态规则：

1. preview、transition、editor 三个阶段始终绑定同一个 `pageBuilder.chart`。
2. 不创建第二份 `draftChartBuilder`。
3. 不新增“进入编辑复制一份，点击保存再覆盖”的提交模型。
4. 关闭编辑器后，报表页看到的内容就是当前 builder 的最新结果。

原因：

1. `page.chart` 已经是 page 的唯一图表配置源。
2. 这次目标是统一 view/edit 体验，不是扩展 save/cancel 工作流。
3. 如果为了动画再复制一份 chart draft，会把问题从“模式切换”升级成“双状态同步”，明显超出本次范围。

### 7. 对外兼容策略：`standard` 保持默认 `edit` 行为，避免破坏现有单图 practice

兼容约束：

1. `practices/standard` 独立运行时，`APP` 不传 `mode` 仍按当前完整编辑器表现。
2. `view mode` 是新增能力，不改变 `standard` 作为单图表 practice 的默认体验。
3. `standard-report` 是第一个消费 `view mode` 的外部场景，但不是通过 import 内部组件拼装，而是通过 `standard` 暴露的稳定入口接入。

原因：

1. 这次改动目标是增强复用，不是重写 `practices/standard` 的产品定位。
2. 先保持默认行为兼容，能降低 practice 演进风险。
3. 让 `standard-report` 通过稳定接口复用 `standard`，后续更容易演进和测试。

### 8. 验证范围

必须覆盖以下验证：

1. `practices/standard` 在 `mode="edit"` 下保持现有单图工作台能力。
2. `practices/standard` 在 `mode="view"` 下可以独立基于 `builder` 渲染只读图表。
3. `practices/standard` 多实例同时挂载时，不会互相覆盖 store 状态。
4. `standard-report` 预览路径中不再直接调用 `pageBuilder.chart.buildVSeed()`。
5. `standard-report` 点击编辑后，图表从当前卡片位置放大到全屏，而不是从侧边滑入。
6. 关闭编辑器时，图表能反向收拢回当前 page 的图表区域。
7. 编辑器内修改 chart 后，回到报表页看到的是同一 builder 的最新结果。
8. page 切换、新增、删除后，当前 page 的 preview / edit 仍能正确绑定对应 `page.chart`。

## Reference

- `practices/standard/src/App/App.tsx`
- `practices/standard/src/model/VBIStore.ts`
- `practices/standard-report/src/App/components/editor/ReportEditorDrawer.tsx`
- `practices/standard-report/src/App/components/page/PagePreviewCard.tsx`
- `practices/standard-report/src/App/components/page/PagePreviewCanvas.tsx`
- `practices/standard-report/src/App/hooks/usePagePreview.ts`
- Ant Design Modal / Drawer / Portal-related component docs: https://ant.design/llms-full.txt

## 淘汰内容概述

本方案明确不采用以下做法：

- 不继续让 `standard-report` 自己维护独立的 chart preview 渲染链路
- 不在 `standard-report` 内部直接拼装 `standard` 的字段面板、shelf、图表组件
- 不继续把 `Drawer width="100vw"` 当作“图表卡片放大全屏”的实现
- 不为 preview 和 edit 维护两份 chart builder 或 draft
- 不把浏览器 `requestFullscreen()` 当作 report 编辑态的主入口
- 不把浏览器 View Transition API 设为唯一依赖
