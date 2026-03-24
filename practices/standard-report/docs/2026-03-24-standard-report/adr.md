# ADR-002: practices/standard-report 报表分页与全屏编辑方案

## Status

Proposed

## Context

`@visactor/vbi` 现在已经提供 `createReport(...)`、`VBIReportBuilder`、`reportBuilder.page.add/remove/update/get` 等能力，`practices/standard` 也已经有一套稳定的单图表可视化查询编辑器骨架。

这次目标不是继续在 `practices/standard` 里叠加报表能力，而是新建一个独立实践 `practices/standard-report`，用于验证以下组合场景：

1. 报表默认存在 1 个 page。
2. page 支持新增、删除、切换。
3. 每个 page 只承载 1 个图表。
4. 点击编辑后，进入全屏可视化查询编辑态。
5. page 切换必须是横向翻页，具有幻灯片式转场。

现有 `practices/standard` 的核心工作台由 `FieldsPanel + ShelfPanel + ChartPanel + Toolbar` 组成，已经具备“编辑单个 `VBIChartBuilder`”的完整能力，因此标准报表实践的关键不是重写编辑器，而是决定：

1. 报表页容器如何组织。
2. page 管理与幻灯片切换如何分工。
3. 全屏编辑是独立路由、独立草稿，还是直接绑定当前 page。

## Decision

### 1. 新增独立实践 `practices/standard-report`，以 `practices/standard` 为代码基线

实现方式：

1. 复制当前 `practices/standard` 为新的 `practices/standard-report`。
2. `practices/standard` 保持单图表 practice 定位，不直接混入报表工作流。
3. `standard-report` 内优先复用 `standard` 已有的编辑器组件、hook、store 和渲染面板。
4. 新实践只补报表壳层、page 管理层和 page 内 chart 绑定层。

原因：

1. 单图表 practice 和报表 practice 是两个不同交互模型，不应该在同一个 demo 里混合演进。
2. 独立 practice 更适合验证 `VBI.createReport(...)` 的完整闭环。
3. `standard` 已经是稳定编辑器基线，复制再裁剪的风险低于在原工程中条件分支扩展。

### 2. `VBIReportBuilder` 是唯一状态源，UI 只保存 `activePageId` 和编辑态

状态规则：

1. 根状态使用 `VBI.createReport(...)` 创建的 `VBIReportBuilder`。
2. UI 层只额外维护 `activePageId`、`editorOpen` 等视图状态。
3. page 列表、page 标题、page 图表内容全部从 `reportBuilder.build().pages` 或 `reportBuilder.page.get(...)` 派生。
4. page 切换以 `page.id` 为主键，不以数组 index 作为长期状态主键。

初始化规则：

1. 报表初始化时如果没有 page，则立即创建 `Page 1`。
2. 默认第一页直接作为当前激活页。
3. 新增 page 时自动切到新 page。
4. 删除当前 page 时，激活相邻 page；如果删到最后一个，则立即补回一个空 page。

原因：

1. `page.id` 在增删场景下比 index 更稳定。
2. 默认总有 1 个 page，可以避免空壳报表带来的大量边界分支。
3. 直接围绕 `VBIReportBuilder` 建模，符合 Single Source of Truth。

### 3. 顶部 page 管理使用 `Tabs type="editable-card"`，内容区切换使用 `Carousel`

组件分工：

1. 顶部 page bar 使用 Ant Design `Tabs` 的 `editable-card` 模式。
2. `Tabs` 负责 page 标题展示、激活态、增加、删除。
3. 内容区使用 Ant Design `Carousel` 展示每个 page 的内容。
4. `Tabs.onChange` 驱动 `Carousel` 切换；`Carousel.afterChange` 反向同步当前 page。

交互约束：

1. `Tabs` 只承担 page 管理，不承担主内容渲染。
2. `Carousel` 关闭自动播放，使用横向滚动切页。
3. `Carousel` 开启 arrows，关闭 infinite。
4. page 新增、点击、箭头切换都必须落到同一个 `activePageId`。

原因：

1. Ant Design 文档明确 `Tabs` 的 card / editable-card 适合“管理可关闭视图”。
2. Ant Design `Carousel` 天然提供横向切换与转场动画，更符合“像幻灯片一般”的要求。
3. 单用 `Tabs` 无法很好表达幻灯片式切换；单用 `Carousel` 又缺少清晰的 add/remove 管理入口。

### 4. page 编辑使用全屏 `Drawer`，不切新路由，不开独立页面

组件决策：

1. 点击 page 上的 `编辑` 按钮后，打开 `Drawer`。
2. `Drawer` 使用全屏尺寸，作为 page 的沉浸式编辑态。
3. `Drawer` 内复用 `practices/standard` 的现有工作台骨架。
4. 关闭 `Drawer` 后返回报表视图，不丢失当前 page 上下文。

原因：

1. Ant Design 文档明确 `Drawer` 适合“在不离开当前页面上下文的情况下处理较重子任务”。
2. 报表编辑本质上是“编辑当前 page 的图表”这个子任务，不是跳转到另一个业务页面。
3. 相比 `Modal`，`Drawer` 更适合承载完整字段面板、shelves、图表预览这类重编辑界面。

### 5. 全屏编辑直接绑定当前 `page.chart`，不维护第二份 chart draft

实现约束：

1. 打开编辑器时，通过当前 page 的 y-map 创建该 page 专属的 `VBIChartBuilder`。
2. 编辑器内所有操作直接写入当前 `page.chart`。
3. 关闭编辑器不需要额外“提交”步骤。
4. 报表视图中的 page 预览天然和编辑结果保持一致。

明确不做：

1. 不在 `standard-report` 里维护 `draftChartBuilder`。
2. 不引入“打开编辑器时复制，点击保存再覆盖”的双写模型。
3. 不新增 page 级 undo/commit 同步层。

原因：

1. 当前实践目标是验证 report DSL 与 chart editor 的绑定链路，不是设计复杂草稿系统。
2. 直接绑定 page.chart 可以保持唯一状态源。
3. 双 builder 模型会引入额外的复制、覆盖、取消、冲突合并问题，超出本次范围。

### 6. 每个 page 只展示一个图表卡片，报表视图负责浏览，不负责完整编辑

页面布局：

1. 每个 page 在报表视图中展示 `title + chart preview + edit action`。
2. 报表视图只保留轻量浏览和翻页动作。
3. 字段拖拽、shelves 配置、filter 编辑等重交互全部放到全屏编辑器中完成。
4. page 内不再并排出现完整编辑器和完整报表浏览器。

原因：

1. 目标已经明确“每个 page 内一个图表，点击编辑按钮全屏编辑”。
2. 浏览态和编辑态分离后，报表体验更接近幻灯片。
3. 这能最大化复用 `standard` 工作台，而不是在 report 页里再塞一套缩小版编辑器。

### 7. 本次标准报表实践只覆盖分页报表，不扩展多图布局和自由排版

范围约束：

1. 一个 page 只允许一个 chart。
2. 不支持 page 内多个 chart block。
3. 不支持文本、注释、自由布局、拖拽排版。
4. 不处理 report 导出、演示播放控制、主题模板。

原因：

1. 当前目标是先验证 `createReport` 的最小可用报表交互。
2. 多图布局会把问题从“分页报表”升级为“版面系统”。
3. 先把“单页单图 + 翻页 + 全屏编辑”跑通，后续再扩展更合理。

### 8. 验证范围

必须覆盖以下验证：

1. `practices/standard-report` 能独立启动和构建。
2. 默认初始化后总是存在 1 个 page。
3. `page.add()`、`page.remove()` 能正确驱动 `Tabs` 与 `Carousel` 同步更新。
4. page 切换具有横向转场，不是瞬时替换。
5. 点击 `编辑` 会打开全屏 `Drawer`。
6. 编辑器内修改 chart 后，关闭 `Drawer` 返回报表视图能看到更新结果。
7. 删除当前 page 后，激活页会自动落到合法 page。
8. 删除到最后一页时，会自动补回空白第一页。

## Reference

- `practices/standard/src/App/App.tsx`
- `@visactor/vbi` report builder API
- Ant Design Tabs: https://ant.design/llms-full.txt
- Ant Design Carousel: https://ant.design/llms-full.txt
- Ant Design Drawer: https://ant.design/llms-full.txt

## 淘汰内容概述

本方案明确不采用以下做法：

- 不在 `practices/standard` 原工程里直接混入 report 模式
- 不使用 `Tabs` 单独承担 page 切换主动画
- 不使用 `Carousel` 单独承担 page 的新增和删除管理
- 不通过新路由跳走到单独 chart editor 页面
- 不为 page.chart 维护第二份独立 draft builder
- 不在本次实践中扩展多图布局、富文本和自由排版
