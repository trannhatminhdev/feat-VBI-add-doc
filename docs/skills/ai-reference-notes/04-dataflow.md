# 4. 数据流与 AI 使用边界

## 完整数据流

```
用户交互（拖拽/输入）
  → VBIChartBuilder（VBI spec，AI 操作这层）
      ├→ buildVQuery()（生成查询 DSL）
      ├→ connector.query()（执行 SQL 取数）
      └→ buildVSeedDSL()（组装中间产物 VSeed）
  → VSeed（内部中间产物）
  → VSeedBuilder.from(vseed).build()（由 VSeedBuilder 处理）
  → VChart / VTable Spec
  → 浏览器渲染
```

## AI 使用边界

AI **只需操作 VBI + VBI-react 层**。以下层级对 AI 不可见，无需了解：

| 层级         | 包                                | 说明                                   |
| ------------ | --------------------------------- | -------------------------------------- |
| 查询层       | `@visactor/vquery`                | VBI 内部自动调用，AI 无需操作          |
| 渲染层       | `@visactor/vseed`                 | VBI 内部自动调用，AI 无需操作          |
| VSeedBuilder | `@visactor/vseed`                 | VSeed → VChart Spec 转换，框架内部处理 |
| 渲染器       | practices/standard 的 VSeedRender | standard 自实现，AI 无需操作           |

## 各层责任说明

### VBI 层（AI 操作）

用户配置图表类型、维度、度量、过滤条件等。VBI 负责：

- 维护图表配置 DSL（Yjs 协同文档）
- 生成查询 DSL（`buildVQuery`）
- 调用 connector 取数
- 组装 VSeed DSL

### VQuery 层（内部自动）

JSON DSL → SQL 查询，由 `connector.query()` 驱动。AI 不可见。

### VSeed 层（内部自动）

接收 VBI spec + 数据集，生成 VChart/VTable 渲染配置。AI 不可见。

### VSeedRender（每个 practice 独立实现）

每个 practice 都自行实现 `VSeedRender` 组件，读取 VSeed 并渲染。**对 AI 不可见，不属于任何 npm 包**。

- 位置：`practices/{name}/src/components/Render/VSeedRender.tsx`
- 不在 `@visactor/vbi-react` 包中

## VSeedRender 位置

VSeed 渲染不在任何 npm 包中，由**每个 practice 独立实现**：

- 位置：`practices/{name}/src/components/Render/VSeedRender.tsx`
- 接收 `vseed: VSeed` 作为 props
- 不在 `@visactor/vbi-react` 包中
- 不能跨 practice 引用——minimalist 的 VSeedRender 不能被 professional 使用

## AI 生成图表的完整流程

1. AI 通过 `builder.dimensions.add()` / `builder.measures.add()` 等 Builder API 配置图表
2. Yjs 文档自动变更，触发 `doc.on('update')` 事件
3. 目标 practice 自己的 VBIStore 监听到变化，调用 `builder.buildVSeed()` 重建渲染数据
4. 目标 practice 自己的 `VSeedRender` 组件自动渲染新图表

AI 只参与第 1 步，后续全部由框架自动处理。
