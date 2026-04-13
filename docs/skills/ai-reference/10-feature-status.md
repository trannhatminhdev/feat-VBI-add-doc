# 10. 功能状态总览

## 10.1 说明

- ✅ **可用**：功能已实现，AI 可直接使用
- ⚠️ **有替代方案**：核心功能存在，但需要通过其他方式访问
- 🔧 **可添加到 vbi-react**：功能已在 standard 中实现，可移到 vbi-react 包

---

## 10.2 @visactor/vbi 导出情况

`@visactor/vbi` 主入口（`src/index.ts`）当前只导出了 3 个模块。以下功能**存在但未从主入口导出**，需通过 `practices/standard/src/utils/demoConnector.ts` 间接访问：

| 功能                                                 | 实际位置                         | 状态                    |
| ---------------------------------------------------- | -------------------------------- | ----------------------- |
| `VBI` 命名空间 / `createVBI()`                       | `src/vbi/create-vbi.ts`          | ⚠️ 有替代方案           |
| `VBIChartBuilder`                                    | `src/chart-builder/builder.ts`   | ⚠️ 有替代方案           |
| `registerConnector` / `getConnector`                 | `src/chart-builder/connector.ts` | ⚠️ 有替代方案           |
| `generateEmptyChartDSL`                              | `src/vbi/generate-empty-dsl.ts`  | ⚠️ 有替代方案           |
| `VBIChartDSL` 及所有 DSL 类型                        | `src/types/chartDSL/`            | ⚠️ 有替代方案（仅类型） |
| 所有 Builder 类型                                    | `src/types/builder/`             | ⚠️ 有替代方案（仅类型） |
| `builder.dsl.get(path)` / `.set()`                   | `builder.dsl`（Y.Map 原生方法）  | ⚠️ 有替代方案           |
| `builder.doc.transact(fn)`                           | `builder.doc`（Y.Doc 原生方法）  | ⚠️ 有替代方案           |
| `builder.chartType.getSupportedMeasureEncodings()`   | `chart-type-builder.ts`          | ⚠️ 有替代方案           |
| `builder.chartType.getSupportedDimensionEncodings()` | `chart-type-builder.ts`          | ⚠️ 有替代方案           |

以下功能**存在于主入口**：

| 功能                                                  | 位置               |
| ----------------------------------------------------- | ------------------ |
| `isVBIFilter`, `isVBIWhereGroup`, `isVBIHavingFilter` | `filter-guards.ts` |

**替代方案**：直接使用**目标 practice** 自己的 `demoConnector.ts` 中的封装。每个 practice 都是独立项目，参考该 practice 内部的导入和使用方式。

---

## 10.3 VBIChartBuilder 核心方法

| 方法                                                                                                    | 状态                              |
| ------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `builder.build()`                                                                                       | ✅ 可用                           |
| `builder.buildVQuery()`                                                                                 | ✅ 可用                           |
| `builder.buildVSeed()`                                                                                  | ✅ 可用（内部自动调用取数和渲染） |
| `builder.isEmpty()`                                                                                     | ✅ 可用                           |
| `builder.getSchema()`                                                                                   | ✅ 可用                           |
| `builder.applyUpdate()` / `builder.encodeStateAsUpdate()`                                               | ✅ 可用                           |
| 所有子 Builder（dimensions/measures/whereFilter/havingFilter/chartType/theme/locale/limit/undoManager） | ✅ 可用                           |

---

## 10.4 VBI-react Hooks

| Hook              | 状态    | 说明                                                                |
| ----------------- | ------- | ------------------------------------------------------------------- |
| `useVBI`          | ✅ 可用 | 获取 builder 和 DSL 快照                                            |
| `useVSeed`        | ✅ 可用 | 执行 buildVSeed 流水线                                              |
| `useChartType`    | ✅ 可用 | 图表类型状态订阅                                                    |
| `useDimensions`   | ✅ 可用 | 维度订阅。`updateDimension` 目前只支持更新 `alias`                  |
| `useMeasures`     | ✅ 可用 | 度量订阅。`updateMeasure` 目前只支持更新 `alias/aggregate/encoding` |
| `useWhereFilter`  | ✅ 可用 | WHERE 过滤订阅                                                      |
| `useHavingFilter` | ✅ 可用 | HAVING 过滤订阅                                                     |

**注意**：`@visactor/vbi-react` 中的 hooks 与 `practices/standard/src/hooks/` 中的同名 hooks 签名完全不同。实际开发推荐使用 standard hooks，详见 [05-react-integration.md](./05-react-integration.md)。

---

## 10.5 VBI-react 组件

| 组件                | 状态    | 说明                                                                                                       |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `ChartRenderer`     | ✅ 可用 | 图表渲染容器，接受 `renderVSeed` prop                                                                      |
| `ChartTypeSelector` | ✅ 可用 | 图表类型选择器                                                                                             |
| `FieldPanel`        | ✅ 可用 | 字段管理面板。接受 `dimensionOptions`/`measureOptions` 等 prop，**不接受** `onAddDimension`/`onAddMeasure` |
| `BuilderLayout`     | ✅ 可用 | 布局容器                                                                                                   |

---

## 10.6 VBI-react 中可添加的功能

以下功能已在 `practices/standard/src/hooks/` 中实现，可移到 `@visactor/vbi-react` 包中：

| 功能                                                 | 当前所在位置                                                               |
| ---------------------------------------------------- | -------------------------------------------------------------------------- |
| `useVBISchemaFields` — 字段列表（带 role/type 分类） | `practices/standard/src/hooks/useVBISchemaFields.ts`                       |
| `useVBIUndoManager` — Undo/Redo 状态订阅             | `practices/standard/src/hooks/useVBIUndoManager.ts`                        |
| `useVBIStore` — Zustand store hook                   | `practices/standard/src/hooks/useVBIStore.ts`                              |
| `useBuilderDocState` — Yjs doc 状态订阅              | `practices/standard/src/hooks/useBuilderDocState.ts`                       |
| `useVBIBuilder` — locale/theme/limit 配置            | `practices/standard/src/hooks/useVBIBuilder.ts`                            |
| `useVBIChartType` — 图表类型订阅                     | `practices/standard/src/hooks/useVBIChartType.ts`                          |
| `useVBIWhereFilter` — WHERE 过滤（完整版）           | `practices/standard/src/hooks/useVBIWhereFilter.ts`                        |
| `useVBIHavingFilter` — HAVING 过滤（完整版）         | `practices/standard/src/hooks/useVBIHavingFilter.ts`                       |
| `useVBIDimensions` — 维度管理（回调模式）            | `practices/standard/src/hooks/useVBIDimensions.ts`                         |
| `useVBIMeasures` — 度量管理（回调模式）              | `practices/standard/src/hooks/useVBIMeasures.ts`                           |
| `useFilterRootOperator` — 切换过滤根操作符           | `practices/standard/src/components/Shelves/hooks/useFilterRootOperator.ts` |

---

## 10.7 AI 使用边界说明

**AI 只需操作 VBI + VBI-react 层**。以下部分对 AI 不可见，无需了解：

| 层级   | 包                                | 说明                          |
| ------ | --------------------------------- | ----------------------------- |
| 查询层 | `@visactor/vquery`                | VBI 内部自动调用，AI 无需操作 |
| 渲染层 | `@visactor/vseed`                 | VBI 内部自动调用，AI 无需操作 |
| 渲染器 | practices/standard 的 VSeedRender | standard 自实现，AI 无需操作  |

**数据流**：Builder API → Yjs 更新 → useVSeed 监听 → buildVSeed 内部执行 → VSeed 对象生成 → VSeedRender 渲染。AI 只参与第一步，后续全部自动。
