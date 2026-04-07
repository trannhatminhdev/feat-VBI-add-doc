# Plan: vbi_fe / vbi_be 接入 standard-report 的可执行总计划

> 基于 [`./adr.md`](./adr.md)
> 本文件是执行入口，不重复展开各子任务细节；子任务细节见 `./subtasks/*`

## 目标

在不引入 report 根级渲染能力的前提下，把当前“单 chart document”体系升级为“多资源协同系统”：

- `chart`、`report`、`insight` 成为独立资源
- `report` 只保存 page 结构和资源引用
- 前后端协同 room 统一为 `{type}:{id}`
- `vbi_fe` 支持 chart / report 双入口
- `standard-report` 变成资源编排壳层

## 范围

包含：

- `packages/vbi`
- `apps/vbi_be`
- `apps/vbi_fe`
- `practices/standard-report`

不包含：

- report 根级 `buildVQuery()` / `buildVSeed()`
- 权限系统、版本历史、回收站
- insight 顶层产品化入口

## 开发原则

### TDD 约束

所有任务必须遵循 TDD 顺序：

1. 先写测试，且测试先失败
2. 再写最小实现使测试通过
3. 最后做重构、命名收敛和重复逻辑消除

禁止：

- 先改实现，事后补测试
- 用手工验证替代应存在的自动化测试
- 在未补回回归测试前直接修改既有行为

### 质量约束

所有任务都必须满足以下质量门槛：

1. 新增或变更行为必须有对应测试覆盖
2. 测试名称必须直接表达业务行为，不写成实现细节
3. 每个子任务结束时必须执行该模块最小验证命令
4. 合并前必须通过仓库级 `lint` 和 `typecheck`
5. 不允许留下带 `TODO` 的半完成主路径实现
6. 不允许为了通过测试引入绕过真实行为的 mock-first 实现

## 子任务映射

1. [`subtasks/01-vbi-resource-model/plan.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/01-vbi-resource-model/plan.md)
2. [`subtasks/02-vbi-be-resource-store/plan.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/02-vbi-be-resource-store/plan.md)
3. [`subtasks/03-collaboration-rooms/plan.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/03-collaboration-rooms/plan.md)
4. [`subtasks/04-vbi-fe-resource-entry/plan.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/04-vbi-fe-resource-entry/plan.md)
5. [`subtasks/05-standard-report-shell/plan.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/05-standard-report-shell/plan.md)

## 执行顺序

必须按以下顺序推进：

1. `01-vbi-resource-model`
2. `02-vbi-be-resource-store`
3. `03-collaboration-rooms`
4. `04-vbi-fe-resource-entry`
5. `05-standard-report-shell`
6. 联调与验收

原因：

- `04` 和 `05` 依赖 `01` 的资源模型
- `03` 依赖 `02` 的资源主表和资源类型语义
- `05` 依赖 `04` 提供的前端资源入口与 `resourceGateway`

## 执行清单

### Step 1: 完成 `packages/vbi` 资源模型收敛

输入：

- [`subtasks/01-vbi-resource-model/adr.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/01-vbi-resource-model/adr.md)
- [`subtasks/01-vbi-resource-model/plan.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/01-vbi-resource-model/plan.md)

完成定义：

- `VBIReportPageDSL` 已改为 `{ chartId, insightId }`
- `VBIInsightDSL`、empty helper、builder 入口已存在
- 旧的 report page 内嵌 API 已移除或迁移
- 相关 schema 测试和 builder 测试先失败后通过
- `@visactor/vbi` 测试通过

阻塞项：

- 无

### Step 2: 完成 `apps/vbi_be` 资源主表和引用关系

输入：

- [`subtasks/02-vbi-be-resource-store/adr.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/02-vbi-be-resource-store/adr.md)
- [`subtasks/02-vbi-be-resource-store/plan.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/02-vbi-be-resource-store/plan.md)

完成定义：

- 后端存在统一 `Resource` 语义
- 可表达 report page -> chart / insight 引用
- 删除 page 仅删除引用，不删除底层资源
- 删除资源前存在引用校验
- 资源生命周期与引用关系已有服务层测试覆盖

阻塞项：

- 依赖 Step 1 的 DSL 形态稳定

### Step 3: 完成协同 room 协议改造

输入：

- [`subtasks/03-collaboration-rooms/adr.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/03-collaboration-rooms/adr.md)
- [`subtasks/03-collaboration-rooms/plan.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/03-collaboration-rooms/plan.md)

完成定义：

- room 命名统一为 `{type}:{id}`
- `chart` / `report` / `insight` 初始化逻辑各自独立
- snapshot / update 与资源类型、资源 id 对齐
- 跨类型 room 不串写
- 断连恢复与跨类型隔离测试先失败后通过

阻塞项：

- 依赖 Step 2 的资源类型与持久化模型

### Step 4: 完成 `apps/vbi_fe` 资源入口改造

输入：

- [`subtasks/04-vbi-fe-resource-entry/adr.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/04-vbi-fe-resource-entry/adr.md)
- [`subtasks/04-vbi-fe-resource-entry/plan.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/04-vbi-fe-resource-entry/plan.md)

完成定义：

- 列表页支持 chart / report 双入口
- 路由拆分为 `/chart/:id` 和 `/report/:id`
- 前端协同 hook 可按资源类型创建 builder
- report 页可通过 `resourceGateway` 打开子资源
- 页面与 hook 行为已有自动化测试或可重复执行的组件级测试

阻塞项：

- 依赖 Step 1 和 Step 3

### Step 5: 完成 `standard-report` 壳层重构

输入：

- [`subtasks/05-standard-report-shell/adr.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/05-standard-report-shell/adr.md)
- [`subtasks/05-standard-report-shell/plan.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/05-standard-report-shell/plan.md)

完成定义：

- `standard-report` 入口变为 `reportBuilder + resourceGateway`
- page 预览与编辑基于 `chartId` / `insightId`
- 新增 page 支持“新建资源 / 绑定已有资源”
- 删除 page 仅移除引用
- active page 按需懒加载子资源
- page 生命周期与共享引用行为已有回归测试

阻塞项：

- 依赖 Step 4 的前端资源入口与 `resourceGateway`

### Step 6: 联调验收

必须验证以下场景：

1. 创建 chart 后进入 `/chart/:id` 可正常协同编辑
2. 创建 report 后自动具备首个可用 page 引用
3. report 首次打开可基于 `chartId` / `insightId` 正确渲染
4. report 中新增 page 可新建资源或绑定已有资源
5. 删除 page 仅移除引用，不删除底层资源
6. 两个 report 引用同一 chart / insight 时，编辑结果实时共享
7. report 切换 active page 时，仅当前 page 子资源保持活跃连接

完成定义：

- 上述 7 个场景全部通过
- 无跨类型 room 串写
- 无 page 删除导致资源误删
- 所有新增行为均有自动化回归测试

## 建议并行方式

允许并行：

- `02-vbi-be-resource-store` 与 `01-vbi-resource-model` 后半段联动设计
- `04-vbi-fe-resource-entry` 的页面壳子准备，可在 `03` 完成前先做静态路由骨架

不要并行：

- 在 `01` 未稳定前推进 `05`
- 在 `02` 未稳定前落定 `03` 的持久化实现

## 验证命令

先做包级验证，再做仓库级验证：

```bash
pnpm --filter=@visactor/vbi run g
pnpm --filter=@visactor/vbi run test
pnpm run lint
pnpm run typecheck
```

如相关子项目已有测试命令，再补充执行：

```bash
pnpm --filter=standard-report run test
```

## 退出条件

以下条件全部满足，才算本主题完成：

1. report 已从内嵌内容模型切到引用模型
2. 后端已支持资源主表、引用关系和删除校验
3. 协同层已统一 `{type}:{id}` 协议
4. 前端已具备 chart / report 双入口
5. `standard-report` 已完成资源编排壳层化
6. 关键联调场景全部通过
