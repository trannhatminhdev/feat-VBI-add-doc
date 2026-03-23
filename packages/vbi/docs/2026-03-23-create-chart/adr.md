# ADR-005: VBI ChartBuilder 与 VBIChartDSL 命名收敛

## Context

当前 `@visactor/vbi` 对外只有单图表能力，但命名仍是泛化的：`VBI.from(...)`、`VBI.create(...)`、`VBIBuilder`、`VBIDSL`、`zVBIDSL`、`generateEmptyDSL`。

这在“只有 chart”阶段还能工作，但在准备引入 `VBI.createReport(...)` 后会立刻产生冲突：

1. `from` 暴露了“从 DSL 进入 builder”的实现细节，没有表达“创建 chart”这个意图。
2. `VBIBuilder` / `VBIDSL` 看起来像整个 VBI 的顶层概念，实际却只描述单个 chart。
3. 未来同时存在 `chartBuilder` 与 `reportBuilder` 时，泛化命名会让 API、类型、zod schema 和目录职责混在一起。

本 ADR 只解决命名和分层，不改变 chart DSL 的 JSON 结构，也不改变 `buildVQuery()` / `buildVSeed()` 的 lowering 行为。

## Decision

### 1. 根 API 统一为 `createChart(...)`

新增并文档化唯一主入口：

```ts
VBI.createChart(vbiChart, options)
createVBI(...).createChart(vbiChart, options)
```

`from` 和 `create` 保留一个迁移窗口，但只作为 `createChart` 的 deprecated alias，不再出现在示例、文档和新增测试里。

### 2. 泛化 builder 统一归入 `chartBuilder` 语义

对外命名改为：

```ts
VBIBuilder -> VBIChartBuilder
VBIBuilderInterface -> VBIChartBuilderInterface
VBIBuilderOptions -> VBIChartBuilderOptions
VBIBuilderAdapters -> VBIChartBuilderAdapters
```

`MeasuresBuilder`、`DimensionsBuilder`、`ChartTypeBuilder` 等 feature builder 不额外加 `Chart` 前缀；它们已经明确归属于 `VBIChartBuilder`，继续保留短名可以减少机械重命名。

### 3. 根 DSL 统一为 `VBIChart*`

对外根 DSL 名称改为：

```ts
VBIDSL -> VBIChartDSL
VBIDSLInput -> VBIChartDSLInput
zVBIDSL -> zVBIChartDSL
generateEmptyDSL -> generateEmptyChartDSL
buildVBIDSL -> buildVBIChartDSL
isEmptyVBIDSL -> isEmptyVBIChartDSL
```

任何仅服务于 chart 根 DSL 的 zod schema 和工具函数，也应同步采用 `VBIChart` 前缀。首期不强制把所有 leaf node 类型都机械改成 `VBIChart*`；优先收敛根对象、根 schema 和公共入口，避免无意义 churn。

### 4. 兼容策略

首期保留旧名别名并加 `@deprecated`：

1. `VBI.from` / `VBI.create` 委托到 `VBI.createChart`
2. `VBIBuilder` 委托到 `VBIChartBuilder`
3. `VBIDSL` / `VBIDSLInput` / `zVBIDSL` 作为类型或 schema 别名保留
4. 文档、示例、测试、导出顺序全部切到新名字

兼容层的目标只是给下游一个迁移窗口，不再继续扩散旧命名。

### 5. 目录与职责边界

当前通用 `builder` / `types/builder` / `vbi/from` 下的 chart 实现，应按 chart 语义重组。原则如下：

1. chart 专属实现放进 chart builder 命名空间，不再占用泛化顶层名字
2. `VBI` 保持为产品级入口容器，负责组织 `createChart`、后续的 `createReport`
3. 真正跨 chart/report 复用的能力，才保留泛化命名

这保证未来 report 能和 chart 形成平级能力，而不是继续挤在旧的 `VBIBuilder` / `VBIDSL` 语义里。

### 6. 非目标

1. 不修改 `VBIChartDSL` 的运行时字段结构
2. 不重做 `buildVQuery()` / `buildVSeed()` pipeline
3. 不在首期强制重命名所有 `VBIDimension` / `VBIMeasure` 等 leaf 类型
4. 不把这次命名收敛扩展成 report DSL 设计

## Reference

- `packages/vbi/src/vbi/create-vbi.ts`
- `packages/vbi/src/vbi/from/from-vbi-dsl-input.ts`
- `packages/vbi/src/vbi/generate-empty-dsl.ts`
- `packages/vbi/src/builder/builder.ts`
- `packages/vbi/src/builder/modules/build.ts`
- `packages/vbi/src/builder/modules/is-empty.ts`
- `packages/vbi/src/types/builder/VBIInterface.ts`
- `packages/vbi/src/types/builder/adapter.ts`
- `packages/vbi/src/types/dsl/vbi/vbi.ts`
- `packages/vbi/src/index.ts`
- `packages/vbi/docs/todo3-create-report/goal.md`

## 淘汰内容概述

- 不再把 `from(...)` 作为 chart 创建主入口
- 不再把单图表 builder 命名成泛化的 `VBIBuilder`
- 不再把单图表根 DSL 命名成泛化的 `VBIDSL`
- 不再让 chart 专属 schema 和工具函数继续占用无 domain 的顶层名字
