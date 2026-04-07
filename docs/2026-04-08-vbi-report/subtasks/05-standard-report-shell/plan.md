# Plan: standard-report 资源编排壳层重构

> 基于 ADR: `./adr.md`

## 范围

本计划覆盖 `practices/standard-report` 的入口、page 生命周期、预览与编辑装配。

## TDD 与质量约束

1. 先补 page 生命周期、资源引用切换、共享资源回写的失败测试
2. 所有 page 行为改造必须先锁定旧边界条件，再进入实现
3. 不允许只通过本地手工操作判断 page 删除和资源复用正确
4. 收尾前必须有 page 新增、删除、切换、共享引用四类回归测试

## Phase 1: 调整入口协议

任务：

1. 先补入口协议与 page 引用结构的失败测试
2. 入口从内嵌 report builder 模式改为 `reportBuilder + resourceGateway`
3. 明确 page 只依赖 `chartId` / `insightId`

## Phase 2: 改造 page 视图与编辑装配

任务：

1. page preview 通过 `chartId` / `insightId` 渲染
2. 图表编辑继续复用 standard
3. insight 区域接入独立资源视图

## Phase 3: 改造 page 生命周期

任务：

1. 新增 page 时支持新建资源或绑定已有资源
2. 删除 page 时仅移除引用
3. 切换 active page 时懒加载当前 page 子资源

## Phase 4: 验证

任务：

1. 验证同一 chart 被多个 report 引用时的共享效果
2. 验证 page 删除不会删除底层资源
3. 验证 active page 切换时子资源连接稳定

验收标准：

1. `standard-report` 只负责结构与编排，不持有子资源内容
2. report 视图与编辑体验可基于资源引用形成闭环
3. page 生命周期与共享资源行为均有自动化回归测试
