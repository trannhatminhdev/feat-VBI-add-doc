# VBI AI 使用参考文档

> 本文档面向 AI Agent，帮助你在看到用户图表相关需求时，能快速写出正确的 VBI 代码。
> 文档以"用户意图 → 代码模式"为核心，涵盖从初始化到渲染的完整流程。

---

## 文档结构

| 文件                                                               | 内容                                     | AI 是否使用 |
| ------------------------------------------------------------------ | ---------------------------------------- | ----------- |
| [01-core-concepts.md](./01-core-concepts.md)                       | 核心概念、数据流、Yjs Doc 结构           | ✅ 使用     |
| [02-quick-start.md](./02-quick-start.md)                           | 最小可运行示例（基于 standard 实际代码） | ✅ 使用     |
| [03-vbi-api.md](./03-vbi-api.md)                                   | VBIChartBuilder 完整 API                 | ✅ 使用     |
| [04-common-patterns.md](./04-common-patterns.md)                   | 常见意图 → 代码模式（Builder API 层）    | ✅ 使用     |
| [05-react-integration.md](./05-react-integration.md)               | VBI-react hooks、AI 触发 UI 更新方式     | ✅ 使用     |
| [07-connector.md](./07-connector.md)                               | Connector 系统（参考）                   | 📖 拓展了解 |
| [08-dsl-types.md](./08-dsl-types.md)                               | DSL 类型速查                             | ✅ 使用     |
| [09-standard-practice.md](./09-standard-practice.md)               | Standard Practice 面板组件速查（参考）   | 📖 拓展了解 |
| [10-feature-status.md](./10-feature-status.md)                     | 功能状态表（哪些能用/不能用了）          | ✅ 使用     |
| [../ai-reference-notes/README.md](../ai-reference-notes/README.md) | 关键发现与维护注意事项                   | 📖 维护参考 |

---

## 核心数据流

```
用户交互（拖拽/输入）
  → VBIChartBuilder（VBI spec，AI 操作这层）
      │ buildVSeed() 内部自动执行
      ├→ buildVQuery()（生成查询 DSL）
      ├→ connector.query()（执行 SQL 取数）
      └→ buildVSeedDSL()（组装中间产物 VSeed）
  → VSeed（内部中间产物）
  → VSeedRender（每个 practice 独立实现）
      │ VSeedBuilder.from(vseed).build()
      ↓
  → VChart / VTable Spec
  → 浏览器渲染
```

**AI 只需操作 VBIChartBuilder**，后续取数、渲染全部由框架自动处理。VSeed、VSeedBuilder、VChart、VTable 对 AI 不可见，无需了解。VSeedRender 由**每个 practice 独立实现**，不在任何 npm 包中。

---

## AI 生成图表流程

1. 通过 `builder.dimensions.add()` / `builder.measures.add()` 等 Builder API 配置图表
2. Yjs 文档自动变更，触发 `doc.on('update')` 事件
3. 目标 practice 自己的 VBIStore 监听到变化，调用 `builder.buildVSeed()` 重建渲染数据
4. 目标 practice 自己的 `VSeedRender` 组件自动渲染新图表

详见 [05-react-integration.md](./05-react-integration.md#ai-触发-ui-更新的方式)。

---

## 导入速查

```ts
// VBI 类型（@visactor/vbi）
// ⚠️ 注意：VBIChartBuilder 不在主入口导出，需通过各 practice 自己的 demoConnector.ts 间接使用
import type { VBIChartDSL, VBIDimension, VBIMeasure, VBIWhereGroup, VBIHavingGroup } from '@visactor/vbi'

// standard/minimalist/streamlined/professional 使用的 hooks（来自各 practice 自己的 hooks 目录）
import {
  useVBIBuilder,
  useVBIChartType,
  useVBIDimensions,
  useVBIMeasures,
  useVBIWhereFilter,
  useVBIHavingFilter,
  useVBISchemaFields,
  useVBIUndoManager,
} from 'src/hooks' // ← 在目标 practice 内导入，不是 @visactor/vbi-react

// vbi-react-starter 使用的 hooks（来自 @visactor/vbi-react 包）
import {
  useVBI,
  useVSeed,
  useDimensions,
  useMeasures,
  useWhereFilter,
  useHavingFilter,
  useChartType,
} from '@visactor/vbi-react'

// vbi-react-starter 使用的组件
import { ChartRenderer, ChartTypeSelector, FieldPanel, BuilderLayout } from '@visactor/vbi-react'
```

> **关于 @visactor/vbi 主入口导出问题**：当前 `@visactor/vbi` 包的主入口（`src/index.ts`）未导出 `VBI`、`VBIChartBuilder`、`registerConnector`、`generateEmptyChartDSL` 等核心 API。每个 practice 都是**独立实现**自己的 `demoConnector.ts`，封装这些 API。AI 在操作具体某个 practice 时，应参考**该 practice 自身**的 `demoConnector.ts`。详见 [10-feature-status.md](./10-feature-status.md)。

> **关于 vbi-react 包**：只有 `vbi-react-starter` 使用 `@visactor/vbi-react` 包提供的 hooks 和组件。其他 practice（minimalist/streamlined/professional/standard/standard-report）都是**独立实现**自己的 hooks 和 model，不依赖 `@visactor/vbi-react` 包。

---

## 文档约定

- 所有 **Builder API** 示例基于 `builder` 实例（`VBIChartBuilder` 类型）
- **AI 操作某个 practice 时**，只使用该 practice 内部的 `src/` 路径导入，不跨 practice 引用组件
- **VSeedRender** 由每个 practice **独立实现**，不在任何 npm 包中
- "✅ 可用" 表示功能已在源码中实现且通过测试
- "⚠️ 有替代方案" 表示功能存在但需通过其他方式访问
- "🔧 可添加到 vbi-react" 表示功能已在某个 practice 中实现，可移到 vbi-react 包
