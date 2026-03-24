# Plan: practices/standard-report 图表 view/edit 复用与全屏过渡落地

> 基于 ADR: `./adr.md`
> 开发顺序遵循仓库约定: 先补测试，再改实现，再做验证

## 范围

本计划覆盖两部分协同改造：

1. `practices/standard` 从单一编辑 demo 收敛为可复用的 chart practice，新增 `view mode` / `edit mode`，并把状态管理改成实例级。
2. `practices/standard-report` 停止维护独立 chart preview 链路，改为复用 `standard`，同时把当前 `Drawer` 侧滑编辑改成“从图表卡片放大全屏”的平滑过渡。

本计划不覆盖：

1. page.chart draft / save / cancel 双状态模型
2. report 多图布局、自由排版、富文本扩展
3. 浏览器 Fullscreen API 方案重设计
4. `@visactor/vbi` 的 report/chart DSL 变更

## Phase 1: 先锁定 `standard` 的复用目标与回归测试

目标：先把 `standard` 作为被复用方的对外行为锁定，避免后面重构 store 和 mode 时丢失现有能力。

### 1.1 `standard` 默认编辑态回归测试

**测试文件**:

- `practices/standard/tests/index.test.tsx`
- 或拆出 `practices/standard/tests/app-modes.test.tsx`（新增）

测试内容：

1. `APP` 不传 `mode` 时仍渲染完整编辑工作台。
2. 现有 toolbar、fields、shelves、chart panel 仍可见。
3. 传入外部 `builder` 时仍能正常初始化。

### 1.2 `view mode` 行为测试

**测试文件**:

- `practices/standard/tests/app-modes.test.tsx`（新增）

测试内容：

1. `mode="view"` 时只渲染只读图表壳层，不暴露编辑工具栏和字段面板。
2. 空 chart 在 `view mode` 下能展示稳定空态。
3. 非空 chart 在 `view mode` 下能完成 `buildVSeed()` 并渲染。

### 1.3 多实例隔离测试

**测试文件**:

- `practices/standard/tests/app-store-isolation.test.tsx`（新增）

测试内容：

1. 同时挂载两个 `StandardAPP`，各自持有不同 `builder`。
2. 一个实例更新后，不会覆盖另一个实例的 `loading / vseed / initialized`。
3. 卸载一个实例时，不会解绑另一个实例的 builder 监听。

## Phase 2: 把 `standard` 的 store 改成实例级

目标：把当前模块级 zustand 单例改造成可复用实例，解决 `standard-report` 里 preview/editor 复用的根障碍。

**重点文件**:

- `practices/standard/src/model/VBIStore.ts`
- `practices/standard/src/model/index.ts`
- `practices/standard/src/hooks/useVBIStore.ts`
- `practices/standard/src/App/App.tsx`

任务：

1. 抽出 `createVBIStore(...)` 或等价 store factory。
2. 为 `standard` 增加 provider 层，保证每次挂载 `APP` 都创建独立 store 实例。
3. 把现有 `useVBIStore(...)` / 相关 hooks 切到实例上下文读取，而不是直接读模块单例。
4. 保持 `builder` 仍然是唯一 DSL 来源，store 只保存 UI 派生状态。
5. 确保 `initialize()` / `bindEvent()` 生命周期在实例级下仍然可正确清理。

约束：

1. 不为了实例化重构去复制 chart DSL。
2. 不破坏 `standard` 作为独立 practice 的默认入口。
3. 控制文件和函数体积，必要时拆小文件。

交付物：

- 实例级 store factory
- `standard` provider / hooks 调整
- 多实例可稳定共存

## Phase 3: 给 `standard` 增加 `view mode` / `edit mode`

目标：让 `standard` 自己拥有 preview 和 editor 两种表现层，成为 report 侧唯一 chart 体验来源。

**重点文件**:

- `practices/standard/src/App/App.tsx`
- `practices/standard/src/App/components/ChartPanel.tsx`
- `practices/standard/src/index.tsx`
- 视情况新增 `practices/standard/src/App/components/ViewPanel.tsx`

任务：

1. `APP` 新增 `mode?: 'view' | 'edit'`，默认保持 `edit`。
2. 抽出 `edit mode` 的工作台骨架，保持当前 `Toolbar + FieldsPanel + ShelfPanel + ChartPanel`。
3. 新增 `view mode` 图表壳层，复用同一套 `buildVSeed()` 渲染链路与主题/locale 初始化。
4. `view mode` 补齐空态、加载态、只读图表容器样式。
5. 保证 `standard` 对外仍通过稳定入口消费，不要求 `standard-report` import 内部子组件。

约束：

1. `view mode` 不暴露字段拖拽、筛选编辑、切图表类型等交互。
2. `edit mode` 继续保持现有单图编辑能力。
3. 尽量复用现有渲染与配置逻辑，避免出现第二套 build/render 管线。

交付物：

- `standard` mode API
- 只读图表展示面
- 默认编辑态兼容

## Phase 4: 用 `standard view mode` 替换 `standard-report` 当前 preview 链路

目标：让 `standard-report` 不再自己 build preview，而是只负责 report page 壳层。

**重点文件**:

- `practices/standard-report/src/App/components/page/PagePreviewCard.tsx`
- `practices/standard-report/src/App/components/page/PagePreviewCanvas.tsx`
- `practices/standard-report/src/App/hooks/usePagePreview.ts`
- `practices/standard-report/src/App/styles/page.css`

任务：

1. 将 page 内图表区域切换为 `StandardAPP mode="view" builder={pageBuilder.chart}` 或等价入口。
2. 删除或下线 `usePagePreview(...) + buildVSeed()` 这条 report 私有预览路径。
3. 保留 `PageHoverActions`、翻页按钮、洞察文案等 report 专属壳层。
4. 调整 page 样式，确保嵌入 `standard view mode` 后尺寸、圆角和空态仍符合 report 视觉。

约束：

1. `standard-report` 不再直接承担 chart preview 数据构建职责。
2. page 仍然只绑定当前 `pageBuilder.chart`，不复制 builder。
3. 替换后 preview 与后续 editor 必须走同一 chart source。

交付物：

- `standard-report` 新 preview surface
- 旧 preview hook/组件退出主路径

## Phase 5: 把 `Drawer` 编辑改成图表卡片放大全屏过渡

目标：把当前“侧边抽屉进入编辑”改成“从当前图表位置放大全屏”的丝滑编辑体验。

**重点文件**:

- `practices/standard-report/src/App/components/editor/ReportEditorDrawer.tsx`
- 视情况新增 `practices/standard-report/src/App/components/editor/ReportEditorTransition.tsx`
- 视情况新增 `practices/standard-report/src/App/hooks/useEditorTransition.ts`
- `practices/standard-report/src/App/styles/editor.css`
- `practices/standard-report/src/model/report-store.ts`

任务：

1. 为“打开编辑器”补充 transition 所需的源节点信息，例如 `DOMRect`、触发 pageId。
2. 新增 portal/fixed overlay 过渡层，由 report 自己控制进入与退出动画。
3. 过渡起始态对齐当前图表卡片，结束态扩展为视口级全屏容器。
4. 进入动画完成后再稳定挂载 `StandardAPP mode="edit" builder={pageBuilder.chart}`。
5. 关闭时执行反向收拢动画，回到当前 page 的图表区域。
6. 对源节点缺失、切页后关闭、快速连续点击等场景提供降级和兜底。

约束：

1. 不继续依赖 `Drawer width="100vw"` 作为主过渡。
2. 不把浏览器 `requestFullscreen()` 作为 report 编辑主入口。
3. 动画失败时允许退化为淡入/淡出，但不能阻塞编辑功能。

交付物：

- 自定义全屏 transition layer
- `standard edit mode` 的报表内嵌入口
- 反向收拢关闭行为

## Phase 6: 联调、边界修补与测试补全

目标：把 `standard` 与 `standard-report` 的联动行为跑通，补齐最容易出问题的边界。

### 6.1 `standard-report` 集成测试

**测试文件**:

- `practices/standard-report/tests/page-hover-actions.test.tsx`
- 视情况新增 `practices/standard-report/tests/report-editor-transition.test.tsx`
- 视情况新增 `practices/standard-report/tests/report-preview-mode.test.tsx`

测试内容：

1. 点击编辑后会进入全屏编辑态，不再表现为侧边抽屉滑入。
2. 关闭编辑器后能回到当前 page 的 preview。
3. 编辑过程中 builder 更新后，返回报表页能看到最新内容。
4. page 切换、新增、删除后，preview/editor 仍然绑定正确 `page.chart`。

### 6.2 验证命令

按仓库约定优先做子包验证，再做仓库级校验：

```bash
pnpm --filter=standard run test
pnpm --filter=standard-report run test
pnpm run lint
pnpm run typecheck
```

如涉及格式或生成物，再补：

```bash
pnpm run format
```

验收标准：

1. `standard` 默认编辑态不回退。
2. `standard view mode` 可被 `standard-report` 稳定复用。
3. `standard-report` 不再直接维护独立 chart preview build 链路。
4. 编辑打开/关闭具备从卡片到全屏、再回到卡片的空间连续性。
5. 所有编辑仍直接落到当前 `page.chart`。

## 里程碑

1. M1: `standard` 完成实例级 store 改造，多实例可同时挂载。
2. M2: `standard` 暴露稳定的 `view mode` / `edit mode`。
3. M3: `standard-report` 预览路径切到 `standard view mode`。
4. M4: 报表内编辑态切换为“图表卡片放大全屏”过渡。
5. M5: `standard` 与 `standard-report` 的测试、lint、typecheck 通过。
