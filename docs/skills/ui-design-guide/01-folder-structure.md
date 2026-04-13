# 1. 目录结构规范

每个 practice 是完全独立的项目，有自己完整的目录结构。**不能跨 practice 引用组件或 hooks**。

---

## 1.1 标准目录结构

```
practices/{name}/src/
├── App/
│   └── App.tsx              # 应用主入口，管理布局
├── components/
│   ├── ChartType/
│   │   └── Selector.tsx     # 图表类型选择器
│   ├── Fields/
│   │   ├── FieldList/       # 字段列表面板（维度+度量合并）
│   │   ├── DimensionsList/   # 可用维度列表
│   │   └── MeasuresList/    # 可用度量列表
│   ├── Filter/
│   │   ├── FilterPanel.tsx      # WHERE 过滤面板
│   │   └── HavingFilterPanel.tsx # HAVING 过滤面板
│   ├── Render/
│   │   └── VSeedRender.tsx  # VSeed 渲染器（独立实现）
│   └── Shelves/
│       ├── DimensionShelf.tsx  # 维度货架
│       ├── MeasureShelf.tsx     # 度量货架
│       ├── WhereShelf.tsx       # WHERE 过滤货架
│       ├── HavingShelf.tsx      # HAVING 过滤货架
│       └── (dnd/ 拖拽相关)
├── hooks/                    # React hooks（基于 VBI 封装）
│   ├── index.ts             # 统一导出
│   ├── useVBIBuilder.ts      # locale/theme/limit 配置
│   ├── useVBIChartType.ts   # 图表类型
│   ├── useVBIDimensions.ts  # 维度操作
│   ├── useVBIMeasures.ts    # 度量操作
│   ├── useVBIWhereFilter.ts # WHERE 过滤
│   ├── useVBIHavingFilter.ts # HAVING 过滤
│   ├── useVBISchemaFields.ts # 字段列表
│   ├── useVBIUndoManager.ts  # Undo/Redo
│   ├── useVBIStore.ts        # store hook
│   └── useBuilderDocState.ts  # 内部：Yjs 状态订阅
├── model/
│   ├── VBIStore.ts          # Zustand store（builder 状态 + VSeed 缓存）
│   └── VBIStoreProvider.tsx  # React Context provider + useVBIStore
├── utils/
│   ├── demoConnector.ts     # 数据源 Connector + defaultBuilder
│   └── fieldRole.ts        # 字段角色映射（getFieldRoleBySchemaType）
├── constants/
│   └── builder.ts           # 常量配置（limit 默认值、主题、语言默认值）
├── i18n/
│   └── (国际化相关)
└── index.tsx               # 应用入口
```

---

## 1.2 关键约束

| 约束                   | 说明                                                 |
| ---------------------- | ---------------------------------------------------- |
| 不能跨 practice 引用   | `src/` 路径只在当前 practice 内有效                  |
| VSeedRender 独立实现   | 每个 practice 必须自己实现，不能引用其他 practice 的 |
| hooks 独立封装         | 每个 practice 有自己的 hooks 集                      |
| model 独立管理         | 每个 practice 有自己的 Zustand store                 |
| demoConnector 独立实现 | 每个 practice 封装自己的 VBI 初始化代码              |

---

## 1.3 设计检查清单

### 初始化

- [ ] `demoConnector.ts` 已实现，包含 `registerConnector`、`createDefaultBuilder`、`defaultBuilder`
- [ ] `VBIStore` 已实现，包含 `initialize`、`bindEvent` 方法
- [ ] `VBIStoreProvider` 已实现，`useVBIStore` hook 可用
- [ ] `App.tsx` 通过 `VBIStoreProvider` 包裹应用
- [ ] 初始化时调用 `initialize(builder)` 绑定 Yjs 事件

### Hooks

- [ ] `src/hooks/index.ts` 统一导出所有 hooks
- [ ] `useVBIDimensions` 支持回调模式添加维度
- [ ] `useVBIMeasures` 支持回调模式添加度量
- [ ] hooks 不依赖 `@visactor/vbi-react` 包

### 渲染

- [ ] `VSeedRender` 位于 `src/components/Render/VSeedRender.tsx`，独立实现
- [ ] 从 `@visactor/vseed` 正确导入 `VSeedBuilder`、`VSeed` 和类型判断函数
- [ ] 处理了 `isVChart`/`isPivotChart`/`isTable`/`isPivotTable` 四种渲染路径
- [ ] `useEffect` cleanup 正确调用 `release()`

### 数据流

- [ ] 用户操作通过 Builder API 配置图表（不直接操作 DSL）
- [ ] Yjs doc update 事件正确监听
- [ ] `bindEvent` 在组件卸载时正确清理

### 独立性

- [ ] 所有 `src/` 导入只在当前 practice 内有效
- [ ] 不引用其他 practice 的组件或 hooks
- [ ] `VSeedRender` 是当前 practice 自己的实现
