# Plan: practices/standard-report 报表分页与全屏编辑落地

## Phase 1: 建立 `practices/standard-report` 工程骨架

目标：从 `practices/standard` 复制出独立 practice，并完成 workspace 接入。

任务：

1. 复制 `practices/standard` 为 `practices/standard-report`
2. 修改新 practice 的 `package.json` 包名、README、docs README
3. 更新根工作区引用、`pnpm-lock.yaml`、需要消费该 practice 的 app 依赖和 tsconfig references
4. 保证 `practices/standard` 与 `practices/standard-report` 可并存，不互相覆盖

交付物：

- 新目录 `practices/standard-report`
- 新 workspace 包名与依赖链路可解析

## Phase 2: 引入 report 根状态与 page 生命周期

目标：把单图表 builder 初始化切换为 report builder 初始化。

任务：

1. 新增 `standard-report` 专用 store 或在现有 store 上拆出 report 版本
2. 根状态改为 `VBI.createReport(...)`
3. 实现默认 1 个 page 的初始化逻辑
4. 增加 `activePageId`、`editorOpen` 等视图状态
5. 封装 `addPage`、`removePage`、`setActivePage`、`ensureAtLeastOnePage` 等动作

约束：

1. `VBIReportBuilder` 是唯一状态源
2. page 主键必须使用 `page.id`
3. 删除最后一页时必须自动补回空白第一页

交付物：

- report store / hooks
- page 生命周期动作

## Phase 3: 搭建报表浏览视图

目标：让 practice 从“单图表编辑器”变成“报表分页浏览器”。

任务：

1. 顶部实现 `Tabs type="editable-card"` page 管理栏
2. 内容区接入 `Carousel`，按 page 渲染横向滑动卡片
3. 每个 page 卡片展示标题、图表预览、编辑按钮
4. 实现 `Tabs` 与 `Carousel` 的双向同步
5. 处理新增 page 后自动激活、删除 page 后自动回落到相邻 page

约束：

1. 报表视图只负责浏览，不嵌入完整编辑器
2. 每个 page 只显示 1 个 chart preview
3. page 切换必须保留横向转场动画

交付物：

- report page tabs
- report carousel view
- page preview card

## Phase 4: 复用 `standard` 工作台实现全屏编辑

目标：点击 page 编辑后，进入全屏图表编辑态。

任务：

1. 抽出 `standard` 当前工作台骨架，形成可接收外部 chart builder 的复用入口
2. 在 `standard-report` 中接入全屏 `Drawer`
3. 打开编辑器时，绑定当前 `page.chart` 对应的 `VBIChartBuilder`
4. 关闭编辑器后返回报表浏览态
5. 确保编辑结果实时反映到 page preview

约束：

1. 不新建第二份 draft chart builder
2. 不新增保存/提交按钮作为唯一写入入口
3. 所有编辑直接落到当前 page.chart

交付物：

- 可复用的 chart workbench
- report drawer editor

## Phase 5: 处理标题、空态与边界交互

目标：补齐可用性和关键边界条件。

任务：

1. page 默认命名为 `Page 1`、`Page 2` 等
2. 支持 page 标题重命名
3. 新 page 默认生成空 chart，并可直接进入编辑
4. 无有效 preview 时展示空态卡片
5. 删除当前 page、删除非当前 page、连续新增 page 的交互保持稳定

交付物：

- page title 策略
- empty state
- page edge-case handling

## Phase 6: 测试与验证

目标：确保新 practice 和报表交互闭环可运行。

任务：

1. 为 report store/page actions 增加测试
2. 为默认 1 page、add/remove、active page fallback 增加测试
3. 为 `Tabs + Carousel` 同步行为增加测试
4. 为全屏 `Drawer` 打开/关闭与编辑结果回写增加测试
5. 运行 `standard-report` 的 `typecheck`、`lint`、`test`
6. 如网站或其他 app 需要接入，再补对应引用验证

建议验证顺序：

1. `pnpm --filter=standard-report run typecheck`
2. `pnpm --filter=standard-report run lint`
3. `pnpm --filter=standard-report run test`
4. 必要时执行一次根目录 `pnpm run typecheck`

## 里程碑

1. M1: `standard-report` 工程可独立安装、构建、启动
2. M2: 默认 1 page，支持 add/remove/switch
3. M3: page 浏览视图具备横向幻灯片切换
4. M4: 点击编辑后进入全屏 `Drawer`，并直接编辑当前 page.chart
5. M5: 测试与类型检查通过
