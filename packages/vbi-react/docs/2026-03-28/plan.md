# Plan: VBI React 站点页面建设计划（2026-03-28）

- Based on: `./adr.md`

## 开工前冻结（Start Gate）
1. 冻结 API 对齐清单（11 项）：
   - hooks：`useVBI`、`useVSeed`、`useChartType`、`useDimensions`、`useMeasures`、`useWhereFilter`、`useHavingFilter`
   - components：`BuilderLayout`、`ChartRenderer`、`ChartTypeSelector`、`FieldPanel`
2. 冻结文档落点：
   - `apps/website/docs/zh-CN/_nav.json`
   - `apps/website/docs/zh-CN/vbi-react/**`
3. 冻结本次边界：仅文档与导航，不改运行时代码。

## Phase 1：信息架构与入口接入
### 目标
完成站点入口与目录骨架，确保 `VBI React` 可访问。

### 执行项
1. 更新 `apps/website/docs/zh-CN/_nav.json`，新增 `VBI React` 导航项。
2. 新建目录 `apps/website/docs/zh-CN/vbi-react/`。
3. 新建：
   - `index.md`
   - `_meta.json`
   - `api/_meta.json`
   - `examples/_meta.json`

### 检查点
- 顶部导航显示 `VBI React`。
- `vbi-react` 分区在本地文档路由可访问。
- Exit Criteria（满足后进入 Phase 2）：
  - `_nav.json` 新入口顺序正确（`VBI` 后、`Playground` 前）。
  - `index/_meta/api/_meta/examples/_meta` 四类骨架文件齐备。

---

## Phase 2：核心页面内容填充
### 目标
补齐最低可用文档内容：首页 + API + 示例。

### 执行项
1. 首页：补充定位、安装、快速开始。
2. API：覆盖冻结清单中的能力（页数不少于 6，优先 hooks/components）。
3. 示例：至少 3 页（含代码片段、场景说明、预期结果）。
4. 内容逐项校对 `packages/vbi-react/src` 导出，确保真实。

### 检查点
- API 页数与示例页数达标。
- 无“未实现 API”描述。
- Exit Criteria（满足后进入 Phase 3）：
  - 冻结清单 11 项均有对应 API 页面或对应分组说明。
  - 每个示例页都具备“依赖 + 代码 + 预期结果”。

---

## Phase 3：一致性与可用性校验
### 目标
确保页面结构、链接、术语一致性达标。

### 执行项
1. 检查 `_meta.json` 排序与层级是否符合导航预期。
2. 检查文档间相互链接与锚点是否可达。
3. 统一术语（VBI / VBI React / hooks / components / examples）。
4. 执行文档校验命令并记录结果。

### 检查点
- 无明显断链、空白页、错误跳转。
- 文案风格与现有站点一致。

### 校验门禁命令（默认执行）
```bash
pnpm --filter=website run build
pnpm run lint
```

### 可选增强校验（涉及多包改动时执行）
```bash
pnpm run typecheck
```

### 本地路由抽查（开发态）
```bash
pnpm --filter=website run dev
```
抽查路由：
1. `/vbi-react/`
2. `/vbi-react/api/`
3. `/vbi-react/examples/`

---

## 交付物清单
1. 导航更新（`_nav.json`）
2. `vbi-react` 首页
3. API 文档分组与页面
4. 示例文档分组与页面

## 里程碑定义
- M1：入口与骨架完成（Phase 1）
- M2：内容完成（Phase 2）
- M3：校验完成，进入评审（Phase 3）

## 回滚策略
1. 若导航影响主站体验：先回滚 `_nav.json` 改动，保留 `vbi-react` 目录待下一次挂载。
2. 若内容质量未达标：保留目录结构，回退问题页面到最小可用版本。
3. 若校验出现阻塞：停止发布动作，记录问题并进入修复清单后再评审。
