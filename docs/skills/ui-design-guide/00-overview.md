# UI 设计指南

> AI 为 VBI 项目设计 UI 面板时的完整参考手册。以 **professional** / **streamlined** practice 为主要参考，以 **standard** 和 **vbi-react-starter** 为辅助参考。详见 [20-practices-reference.md](./20-practices-reference.md)。

---

## 文档结构

| 文件                                                               | 内容                                                                                           |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| [01-folder-structure.md](./01-folder-structure.md)                 | 目录结构规范，约束与检查清单                                                                   |
| [02-dsl-types.md](./02-dsl-types.md)                               | DSL 类型速查（VBIChartDSL / VBIDimension / VBIMeasure 等）                                     |
| [03-builder-api-summary.md](./03-builder-api-summary.md)           | Builder API 速查（子 Builder 方法一览）                                                        |
| [04-hooks-overview.md](./04-hooks-overview.md)                     | Hooks 总览与导入规范                                                                           |
| [05-hooks-useVBIDimensions.md](./05-hooks-useVBIDimensions.md)     | useVBIDimensions — 维度管理                                                                    |
| [06-hooks-useVBIMeasures.md](./06-hooks-useVBIMeasures.md)         | useVBIMeasures — 度量管理                                                                      |
| [07-hooks-useVBIWhereFilter.md](./07-hooks-useVBIWhereFilter.md)   | useVBIWhereFilter — WHERE 过滤                                                                 |
| [08-hooks-useVBIHavingFilter.md](./08-hooks-useVBIHavingFilter.md) | useVBIHavingFilter — HAVING 过滤                                                               |
| [09-hooks-useVBIChartType.md](./09-hooks-useVBIChartType.md)       | useVBIChartType — 图表类型                                                                     |
| [10-hooks-useVBIBuilder.md](./10-hooks-useVBIBuilder.md)           | useVBIBuilder — locale/theme/limit                                                             |
| [11-hooks-useVBISchemaFields.md](./11-hooks-useVBISchemaFields.md) | useVBISchemaFields — 字段列表                                                                  |
| [12-hooks-useVBIUndoManager.md](./12-hooks-useVBIUndoManager.md)   | useVBIUndoManager — Undo/Redo                                                                  |
| [13-hooks-useVBIStore.md](./13-hooks-useVBIStore.md)               | useVBIStore — 全局状态                                                                         |
| [14-vseed-render.md](./14-vseed-render.md)                         | VSeedRender 实现规范与完整代码                                                                 |
| [15-vbi-store.md](./15-vbi-store.md)                               | VBIStore 实现规范与完整代码                                                                    |
| [16-vbi-store-provider.md](./16-vbi-store-provider.md)             | VBIStoreProvider + useVBIStore hook                                                            |
| [17-demo-connector.md](./17-demo-connector.md)                     | demoConnector.ts 完整代码                                                                      |
| [18-component-patterns.md](./18-component-patterns.md)             | 核心 UI 组件模式：Toolbar / FieldsPanel / ShelfPanel / ChartPanel                              |
| [19-ui-considerations.md](./19-ui-considerations.md)               | UI 开发实践注意事项：下拉浮动、浅色模式、过滤操作符、Connector 类型约束等                      |
| [20-practices-reference.md](./20-practices-reference.md)           | 各 practices 参考索引与按 API 分组的参考来源                                                   |
| [21-undocumented-apis.md](./21-undocumented-apis.md)               | 通过阅读 practices 源码才发现的正确用法：WHERE op+value 规则、TidyDatum、replaceFilters 模式等 |

---

## 核心原则

### 独立性

每个 practice 是完全独立的项目：

- **不能跨 practice 引用**：所有 `src/` 路径只在当前 practice 内有效
- **VSeedRender 独立实现**：每个 practice 必须自己写一份，不能引用其他 practice 的
- **hooks 独立封装**：每个 practice 有自己的 hooks 集，通过 `src/hooks/index.ts` 导出
- **model 独立管理**：每个 practice 有自己的 Zustand store

### 数据流

```
用户操作 → Builder API → Yjs Doc 更新 → VBIStore 监听 → buildVSeed() → VSeedRender 渲染
```

AI 只需操作 Builder API（`builder.dimensions.add` 等），后续全部自动。

### 导入来源速查

| 需要的                                                    | 从哪里导入                                         |
| --------------------------------------------------------- | -------------------------------------------------- |
| VBI 类型（VBIDimension 等）                               | `@visactor/vbi`                                    |
| VSeed / VSeedBuilder                                      | `@visactor/vbi`（类型），`@visactor/vseed`（实现） |
| VChart 渲染                                               | `@visactor/vchart`                                 |
| VTable 渲染                                               | `@visactor/vtable`                                 |
| hooks（standard/minimalist/professional/standard-report） | `src/hooks/`（当前 practice）                      |
| hooks（vbi-react-starter）                                | `@visactor/vbi-react`                              |
| VBI 核心 API（VBI / VBIChartBuilder 等）                  | 不在主入口，通过 demoConnector.ts 封装             |

---

## 参考源码

详见 [20-practices-reference.md](./20-practices-reference.md)。

| 模块                            | 推荐源码位置                                                   |
| ------------------------------- | -------------------------------------------------------------- |
| hooks（完整签名）               | `practices/professional/src/hooks/`                            |
| hooks（简洁模式）               | `practices/streamlined/src/hooks/`                             |
| VBIStore                        | `practices/professional/src/model/VBIStore.ts`                 |
| VBIStoreProvider                | `practices/standard/src/model/VBIStoreProvider.tsx`            |
| demoConnector（CSV URL）        | `practices/streamlined/src/utils/demoConnector.ts`             |
| demoConnector（localConnector） | `practices/professional/src/utils/localConnector.ts`           |
| VSeedRender                     | `practices/professional/src/components/Render/VSeedRender.tsx` |
| 完整 UI 示例                    | `practices/dashboard/src/`                                     |
| vbi-react-starter               | `practices/vbi-react-starter/src/`                             |
