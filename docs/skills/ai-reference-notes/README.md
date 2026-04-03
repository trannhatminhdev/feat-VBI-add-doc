# AI Reference 编写说明

> 本目录记录 AI Reference 编写过程中的关键发现、核查结论和设计决策，供后续维护参考。

---

## 目录

| 文件                                                         | 内容                                             |
| ------------------------------------------------------------ | ------------------------------------------------ |
| [README.md](./README.md)                                     | 本文档，总览所有重点                             |
| [01-main-entry-issue.md](./01-main-entry-issue.md)           | @visactor/vbi 主入口导出问题                     |
| [02-hooks-signature-issue.md](./02-hooks-signature-issue.md) | VBI-react 与 Standard Hooks 签名完全不同         |
| [03-hidden-apis.md](./03-hidden-apis.md)                     | 易遗漏的 API：Y.Map/Yjs、编码查询、Node get 方法 |
| [04-dataflow.md](./04-dataflow.md)                           | 数据流与 AI 使用边界                             |

---

## 快速索引

### 最容易出错的地方

1. **`import { VBI } from '@visactor/vbi'` 会报错** — VBI 不在主入口，需参考**目标 practice** 的 demoConnector.ts
2. **vbi-react hooks 和各 practice 自有的 hooks 同名但完全不同** — 用混了会导致 builder 参数类型不匹配。每个 practice 只用自己的 hooks（`src/hooks/`），不用 `@visactor/vbi-react` 包
3. **VSeedRender 是每个 practice 独立实现的** — 不在任何 npm 包中，不能跨 practice 引用

### 源码核查记录

- `VBIChartBuilder` → `packages/vbi/src/chart-builder/builder.ts`
- `filter-guards` → `packages/vbi/src/utils/filter-guards.ts`（主入口有导出）
- `vbi-react hooks` → `packages/vbi-react/src/hooks/`
- 各 practice 自有 hooks → `practices/{name}/src/hooks/`（每个 practice 独立一套）
- `VSeedRender` → `practices/{name}/src/components/Render/VSeedRender.tsx`（每个 practice 独立实现）
- `demoConnector` → `practices/{name}/src/utils/demoConnector.ts`（每个 practice 独立实现）
