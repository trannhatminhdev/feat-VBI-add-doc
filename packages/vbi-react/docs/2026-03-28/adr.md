# ADR: VBI React 站点文档新增方案（2026-03-28）

- Status: Accepted
- Decision Date: 2026-03-28
- Decision Owner: VBI 文档协作
- Related: `./goal.md`

## 背景
`@visactor/vbi-react` 已形成独立能力，但当前官网文档导航中缺少 `VBI React` 专区。用户需要在不同路径或源码中自行查找信息，学习路径不连续，站点信息架构也不完整。

## 决策
### 决策 1：在站点一级导航新增 `VBI React`
- 位置：放在 `VBI` 之后、`Playground` 之前。
- 目的：让用户在产品矩阵中直接发现 React 封装层。

### 决策 2：建立独立文档分区 `apps/website/docs/zh-CN/vbi-react/`
- 分区结构：`index` + `api` + `examples`。
- 目的：保证信息层次清晰，减少与 `vbi` 主文档相互污染。

### 决策 3：API 与示例内容“代码对齐优先”
- API 页面仅记录当前真实导出。
- 示例页面以“可复制、可理解、可扩展”为最低标准。
- 不编造未来接口，不写未实现能力。

### 决策 4：文档边界以包导出为准
- `@visactor/vbi-react` 与 `@visactor/vbi-react/components` 为公开导出入口。
- 页面命名、示例 import、目录组织都围绕公开导出组织。
- 不将 `internal` 目录能力作为对外 API 文档内容。

## 备选方案与取舍
### 方案 A：把 vbi-react 内容放入现有 vbi 子目录
- 优点：改动小。
- 缺点：边界不清，用户难以区分 core 与 react 层。
- 结论：不采用。

### 方案 B：先只放一个 landing page，不补 API/示例
- 优点：上线快。
- 缺点：信息不完整，无法支撑实际接入。
- 结论：不采用。

### 方案 C：新增独立 `vbi-react` 专区（本方案）
- 优点：结构清晰，可持续扩展，符合文档信息架构。
- 代价：初次建设页面数更多。
- 结论：采用。

## 影响范围
- 直接影响：
  - `apps/website/docs/zh-CN/_nav.json`
  - `apps/website/docs/zh-CN/vbi-react/**`
- 间接影响：
  - 后续 vbi-react 文档维护入口统一到站点。

## 风险与缓解
1. 风险：API 文档与代码不同步。
   - 缓解：页面内容逐条对照 `packages/vbi-react/package.json#exports` 与 `src/hooks/index.ts`、`src/components/index.ts`。
2. 风险：示例质量不足，用户复制后无法使用。
   - 缓解：示例页统一提供依赖说明、最小代码、预期结果。
3. 风险：导航层级调整影响既有路径习惯。
   - 缓解：保持原有 VBI/VQuery/VSeed 入口不变，仅增量插入 VBI React。

## 落地约束
1. 文档语言：中文主文档放在 `zh-CN` 路径，术语保持与现有 VBI 文档一致。
2. 目录约束：`index / api / examples` 三层结构不混合。
3. 质量门禁：进入评审前需通过站点构建校验（见 `plan.md` 的校验门禁）。
