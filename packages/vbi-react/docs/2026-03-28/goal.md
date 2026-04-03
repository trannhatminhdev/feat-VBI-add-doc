# Goal: 在网站文档中新增 VBI React 专区（2026-03-28）

## 目标陈述
在 VBI 官网文档站中新增 `VBI React` 页面体系，使用户在站点内即可完成 `@visactor/vbi-react` 的学习与接入（定位、安装、API、示例）。

## 交付范围
1. 顶部导航新增 `VBI React` 入口。
2. 新建 `vbi-react` 文档分区并接入站点侧边栏。
3. 提供 `VBI React` 首页（定位、安装、快速开始）。
4. 提供 API 文档分组（覆盖核心 hooks/components）。
5. 提供示例文档分组（含可复制代码与预期效果说明）。

## 开工前输入（SSOT）
1. 运行时导出边界以 `packages/vbi-react/package.json` 的 `exports` 为准：
   - `@visactor/vbi-react`
   - `@visactor/vbi-react/components`
2. 文档能力清单以 `packages/vbi-react/src/hooks/index.ts` 与 `packages/vbi-react/src/components/index.ts` 为准。
3. 文档落点固定为 `apps/website/docs/zh-CN/vbi-react/`。

## API 对齐清单（必须逐项覆盖）
1. `@visactor/vbi-react`
   - `useVBI`
   - `useVSeed`
   - `useChartType`
   - `useDimensions`
   - `useMeasures`
   - `useWhereFilter`
   - `useHavingFilter`
2. `@visactor/vbi-react/components`
   - `BuilderLayout`
   - `ChartRenderer`
   - `ChartTypeSelector`
   - `FieldPanel`

## 不在本次范围
- 不改动 `packages/vbi-react/src` 运行时代码。
- 不做功能开发，不改测试逻辑。
- 不处理 npm 发布流程。

## 验收标准（DoD）
1. 导航中可见并可点击进入 `VBI React`。
2. `apps/website/docs/zh-CN/vbi-react/` 目录结构完整（首页、API、示例、各自 `_meta.json`）。
3. API 文档不少于 6 页，且均对应“API 对齐清单”中的真实导出能力。
4. 示例文档不少于 3 页，且每页包含依赖说明、最小代码片段、预期效果说明。
5. 页面链接与层级关系正确，无明显断链或空页面。
6. 文案术语与现有 VBI 文档风格保持一致（中英文术语统一）。
