# 执行计划: VBI createReport 与 ReportBuilder

> 基于 ADR: `./adr.md`
> TDD 驱动: 先锁定 schema 和 API，再做目录重组与实现

## 范围

本计划只覆盖 `packages/vbi`，包含 `createReport` 根入口、`types/dsl -> types/chartDSL` 重命名、`types/reportDSL` 新增、`VBIReportDSL` / `VBIReportBuilder` / `reportBuilder.page.*` 落地，以及相关测试与生成物更新；不包含 report 级 `buildVQuery()` / `buildVSeed()`、多 chart page、rich-text 系统。

## Phase 1: 先锁定对外行为

### 1.1 Schema 测试

**测试文件**: `packages/vbi/tests/types/reportSchemas.test.ts`（新增）

测试内容:

1. `zVBIReportDSL` 正确 parse 最小 report DSL。
2. `page.title` / `page.chart` / `page.text` 缺失时被 reject。
3. `page.chart` 继续复用 `zVBIChartDSL` 的校验结果。
4. `generateEmptyReportDSL()` 与 `generateEmptyReportPageDSL(connectorId)` 的默认值稳定。

### 1.2 Builder API 测试

**测试文件**: `packages/vbi/tests/builder/reportBuilder.test.ts`（新增）

测试内容:

1. `VBI.createReport(report)` 与 `createVBI(...).createReport(report)` 可正常创建 builder。
2. `reportBuilder.page.add('Story One', page => page.setChart(chartBuilder).setText('hello world'))` 输出正确 DSL。
3. `reportBuilder.page.remove(id)` / `update(id, callback)` 行为正确。
4. `setChart(chartBuilder)` 复制 `chartBuilder.build()` 结果，而不是共享 builder 实例。
5. `build()` / `isEmpty()` / `applyUpdate()` / `encodeStateAsUpdate()` 行为稳定。

## Phase 2: ChartDSL 目录重命名与 ReportDSL 类型落地

**改动范围**:

- `packages/vbi/src/types/dsl/**` -> `packages/vbi/src/types/chartDSL/**`
- `packages/vbi/src/types/reportDSL/**`（新增）
- `packages/vbi/src/types/index.ts`

改动内容:

1. 将现有 chart schema、类型、导出整体迁移到 `types/chartDSL`。
2. 新增 `report.ts` / `page.ts` / `text.ts`，定义 `VBIReportDSL`、`VBIReportPageDSL`、`VBIReportTextDSL` 与 zod schema。
3. 更新所有 `src/**`、`tests/**` 内部 import，消除对旧 `types/dsl` 路径的直接依赖。

## Phase 3: 空 DSL helper 与 Builder 内核准备

**改动文件**:

- `packages/vbi/src/vbi/generate-empty-report-dsl.ts`（新增）
- `packages/vbi/src/vbi/generate-empty-report-page-dsl.ts`（新增）
- `packages/vbi/src/builder/builder.ts`
- `packages/vbi/src/builder/modules/**`
- `packages/vbi/src/types/builder/**`

改动内容:

1. 新增 `generateEmptyReportDSL()` 与 `generateEmptyReportPageDSL(connectorId)`。
2. 将 `VBIChartBuilder` 的内部实现抽成“可绑定任意 DSL map”的模式，支持 page.chart 复用。
3. 保持根 `createChart(...)` 行为不变，只把“绑定根 map”变成特例。

## Phase 4: ReportBuilder 与 page API

**改动文件**:

- `packages/vbi/src/builder/report-builder.ts`（新增）
- `packages/vbi/src/builder/features/report-page/page-collection-builder.ts`（新增）
- `packages/vbi/src/builder/features/report-page/page-builder.ts`（新增）
- `packages/vbi/src/builder/index.ts`
- `packages/vbi/src/types/builder/VBIInterface.ts`

改动内容:

1. 新增 `VBIReportBuilder` 与 `VBIReportBuilderInterface`。
2. 提供 `reportBuilder.page.add/remove/update/get` 主入口。
3. `page.add(title, callback)` 把第一个参数写入 `page.title`。
4. `ReportPageBuilder` 提供 `setChart(chartBuilder)` 与 `setText(content)` 链式 API。

## Phase 5: 根入口、导出与包内迁移

**改动文件**:

- `packages/vbi/src/vbi/create-vbi.ts`
- `packages/vbi/src/vbi/from/from-vbi-report-dsl-input.ts`（新增）
- `packages/vbi/src/index.ts`
- `packages/vbi/src/vbi.ts`

改动内容:

1. `createVBI()` 返回实例新增 `createReport(...)`。
2. `VBI` 对外导出 `createReport`、`generateEmptyReportDSL`、`generateEmptyReportPageDSL`。
3. 包内源码和测试默认切到 `types/chartDSL` / `types/reportDSL` 与 report 新 API。

## Phase 6: 生成物与验证

```bash
pnpm --filter=@visactor/vbi run g
pnpm --filter=@visactor/vbi run test
pnpm run lint
pnpm run typecheck
```

验收标准:

1. `createReport`、`VBIReportDSL`、`reportBuilder.page.*` 通过测试并可稳定构建 DSL。
2. `types/chartDSL` / `types/reportDSL` 路径清晰，包内无旧 `types/dsl` 残留引用。
3. 生成物 diff 只反映 report 能力与目录命名收敛，不引入无关行为变化。
