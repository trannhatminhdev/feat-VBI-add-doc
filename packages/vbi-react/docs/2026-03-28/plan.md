# Plan: VBI React Website 文档自动生成（2026-03-28, Rev.2）

- Based on: `./adr.md`
- 目标：把 `vbi-react` 的 website 文档维护从“手工编辑”切到“脚本生成 + 少量模板维护”。

## 问题分析（现状）

当前 `apps/website/docs/zh-CN/vbi-react/**` 的 API 与示例页是手工维护，主要风险：

1. 代码导出变化后，文档容易漏改或改晚。
2. `_meta.json` 和页面文件名需要手动同步，容易出现导航漂移。
3. 每次功能调整都要重复机械编辑，review 成本高。
4. 缺少和 `packages/vbi|vquery|vseed` 一致的 `pnpm g` 自动生成路径。

## 开工前冻结（Start Gate）

1. 文档 SSOT 输入冻结为以下文件：
   - `packages/vbi-react/package.json#exports`
   - `packages/vbi-react/src/hooks/index.ts`
   - `packages/vbi-react/src/components/index.ts`
2. 生成目标路径冻结：
   - `apps/website/docs/zh-CN/vbi-react/api/**`
   - `apps/website/docs/zh-CN/vbi-react/examples/**`
3. 本期边界冻结：
   - 仅新增/改造文档生成脚本与文档产物，不改 runtime 逻辑。
   - `bugserver` 流程不纳入本计划，不作为阻断项。

## 方案设计

### 脚本布局

在 `packages/vbi-react/scripts/` 新增：

1. `build-api.mjs`
   - 从 `hooks/index.ts` 与 `components/index.ts` 收集公开导出。
   - 生成 API 页与 `api/_meta.json`。
2. `build-examples.mjs`
   - 从固定模板源（建议 `packages/vbi-react/docs/examples-source/*.md`）生成示例页。
   - 统一生成 `examples/_meta.json`。
3. `build-docs.mjs`
   - 生成或校正 `vbi-react/_meta.json` 与分区入口页链接。
4. 可选：`build-all.mjs`
   - 串联 API + examples + docs 生成。

### 命令接入

在 `packages/vbi-react/package.json` 增加：

1. `build:api`: `node ./scripts/build-api.mjs`
2. `build:examples`: `node ./scripts/build-examples.mjs`
3. `build:docs`: `node ./scripts/build-docs.mjs`
4. `g`: `pnpm run build:api && pnpm run build:examples && pnpm run build:docs && pnpm run format`

这样可以与其他包保持一致：改完代码后执行一次 `pnpm --filter=@visactor/vbi-react run g` 即完成文档更新。

## 分阶段执行

## Phase 1：脚本骨架与解析能力

1. 创建 `scripts/` 目录与 3 个 mjs 文件。
2. 完成导出采集逻辑（hook/component 名称、来源分组）。
3. 定义页面 slug 规则（例如 `useVBI -> useVBI.md`, `BuilderLayout -> builderLayout.md`）。

Exit Criteria:

1. 在本地可打印稳定导出清单。
2. 同一输入重复执行两次，输出顺序一致。

## Phase 2：API 文档自动生成

1. 生成 API 总览页（分组展示 hooks/components）。
2. 为每个导出生成独立页面（签名、用途、最小示例占位）。
3. 生成 `api/_meta.json`，确保排序规则稳定。

Exit Criteria:

1. API 页数量与导出清单一致。
2. 删除/新增导出后，重新执行 `g` 可自动反映到 API 页面与 `_meta.json`。

## Phase 3：示例与分区元数据生成

1. 将示例内容源迁移到 `packages/vbi-react/docs/examples-source/`（仅维护正文模板）。
2. 自动同步到 `apps/website/docs/zh-CN/vbi-react/examples/`。
3. 自动生成 `examples/_meta.json` 与根级 `_meta.json`（保留 “index / examples / api” 结构）。

Exit Criteria:

1. 示例新增/重命名不需要手改 `_meta.json`。
2. website 侧目录结构稳定、无孤儿页。

## Phase 4：验证与发布门禁

默认验证命令：

```bash
pnpm --filter=@visactor/vbi-react run g
pnpm --filter=website run build
pnpm run lint
```

可选增强验证：

```bash
pnpm run typecheck
```

Exit Criteria:

1. 以上命令全通过。
2. `/vbi-react/`、`/vbi-react/api/`、`/vbi-react/examples/` 路由可访问。
3. 文档更新流程从“手工改页面”变为“改源码/模板后执行 `pnpm g`”。

## 验收标准（DoD）

1. `@visactor/vbi-react` 包具备 `pnpm g` 命令。
2. API 与 `_meta.json` 不再手工维护，来源可追溯到 SSOT 文件。
3. 示例分组与导航不再手工维护 `_meta.json`。
4. 新增/删除导出后，执行 `g` 一次即可得到可提交的 website 文档变更。

## 风险与缓解

1. 风险：自动生成覆盖手工高质量描述。
   - 缓解：保留“模板正文区 + 自动信息区”结构，模板区可人工维护。
2. 风险：导出名变更引发 slug 变化，旧链接失效。
   - 缓解：维护 `slugMap`（旧名 -> 新名）并在脚本中统一处理。
3. 风险：脚本演进后输出不稳定导致噪音 diff。
   - 缓解：所有输出统一排序、统一格式化后写入。

## 回滚策略

1. 若脚本不稳定：回退 `scripts/` 与 `package.json` 的 `g` 改动，保留现有 website 页面。
2. 若部分页面质量不足：先保留自动生成骨架，人工补充模板，再逐步扩大自动化覆盖面。
