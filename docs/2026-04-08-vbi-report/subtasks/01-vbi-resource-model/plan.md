# Plan: packages/vbi 资源化 DSL 与 builder 收敛

> 基于 ADR: `./adr.md`

## 范围

本计划只覆盖 `packages/vbi`：

- report DSL 从内嵌模型切到引用模型
- 新增 insight DSL 与 builder
- 清理旧的 report page 内嵌 API

## TDD 与质量约束

1. 先补 schema 测试和 builder 测试，再改 DSL 与 API
2. 任何移除旧接口的改动，都必须先有回归测试锁定预期迁移行为
3. 每完成一个 DSL 或 builder 入口，都要先看测试失败，再进入实现
4. 收尾前必须执行 `pnpm --filter=@visactor/vbi run test`

## Phase 1: 锁定 DSL 与 schema

任务：

1. 先为 `VBIReportPageDSL`、`VBIInsightDSL`、empty helper 补失败测试
2. 调整 `VBIReportPageDSL` 为 `{ chartId, insightId }`
3. 新增 `VBIInsightDSL`、schema、默认空 DSL helper
4. 更新 report / chart / insight 类型导出

## Phase 2: 收敛 builder API

任务：

1. 先补 `reportBuilder.page.*` 与 `createInsight(...)` 的失败测试
2. 调整 `reportBuilder.page.add/update/get/remove`
3. 移除 `page.setChart(...)`、`page.setText(...)` 等旧接口
4. 新增 `createInsight(...)` builder 入口

## Phase 3: 生成物与验证

任务：

1. 更新 `src/index.ts` 与包级导出
2. 执行 `pnpm --filter=@visactor/vbi run g`
3. 执行 `pnpm --filter=@visactor/vbi run test`

验收标准：

1. report 不再内嵌 chart/text 内容
2. report / chart / insight 可独立构建与协同恢复
3. schema 与 builder 关键路径均有自动化测试覆盖
