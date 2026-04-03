# 18. 组件设计模式

## 目录结构

每个 practice 独立实现完整的组件集，典型结构：

```
src/components/
├── Toolbar/           # 工具栏：图表类型选择器、撤销/重做、语言、主题、数据限制
│   ├── index.tsx      # Toolbar 主组件
│   └── config.tsx      # 图表类型元数据（groups + metas）
├── ChartType/         # 图表类型选择器
│   └── Selector.tsx   # Popover 内嵌 Grid
├── Fields/            # 字段列表
│   └── FieldList/
│       └── index.tsx  # 搜索 + 角色过滤 + 字段项
├── Shelfs/            # 配置货架
│   └── shelves/
│       ├── DimensionShelf.tsx   # 维度货架行 + 右键菜单（aggregate/encoding/sort/delete）
│       └── MeasureShelf.tsx      # 度量货架行 + 右键菜单（aggregate/encoding/format/sort/delete）
└── Render/
    └── VSeedRender.tsx           # VSeed → 图表/表格渲染
```

---

## Toolbar — 工具栏

**职责**：全局配置入口（图表类型、撤销/重做、行数限制、语言、主题、全屏）。

**子组件拆分原则**：

| 组件                | 职责                            |
| ------------------- | ------------------------------- |
| `ChartTypeSelector` | 图表类型 Popover 选择器         |
| `Toolbar`           | 布局容器（Flex + Divider 分隔） |

**Toolbar 内部模式**：

```tsx
// 使用 useVBIStore 获取 builder
const builder = useVBIStore((state) => state.builder)

// 组合多个 hooks
const { canUndo, canRedo, undo, redo } = useVBIUndoManager(builder)
const { locale, theme, limit, setLocale, setTheme, setLimit } = useVBIBuilder(builder)
```

**样式约定**：使用 `theme.useToken()` 获取 Antd Design token，保持深/浅主题一致。

---

## ChartTypeSelector — 图表类型选择器

**职责**：Popover 内展示图表类型分组网格，支持搜索和图标展示。

**调用链**：

```
用户点击图表类型
  → useVBIChartType(builder).changeChartType(type)
  → builder.chartType.changeChartType(type)
  → Yjs doc 更新
  → VSeedStore 自动重新构建 VSeed
  → VSeedRender 重新渲染
```

**配置元数据（config.tsx）**：

```ts
export interface ChartTypeMeta {
  type: string;           // 'column'、'pie' 等
  group: ChartGroupKey;    // 'comparison'、'proportion' 等
  labelKey: string;        // i18n key
  descriptionKey: string;  // i18n key
  icon: ReactNode;         // @ant-design/icons 组件
}

export const CHART_TYPE_METAS: ChartTypeMeta[] = [
  { type: 'column', group: 'comparison', labelKey: '...', icon: <BarChartOutlined /> },
  // ...
];
```

---

## FieldsPanel — 字段面板

**职责**：展示可用字段列表，支持按角色/类型筛选、搜索、点击添加。

**组合**：`FieldsPanel` → `FieldList` → `useVBISchemaFields(builder)` → `builder.getSchema()`

```tsx
const { schemaFields } = useVBISchemaFields(builder)

// 角色分组
const dimensionFields = schemaFields.filter((f) => f.role === 'dimension')
const measureFields = schemaFields.filter((f) => f.role === 'measure')
```

**点击字段添加到货架**：

```tsx
// FieldList/index.tsx
onClick={() => {
  if (field.role === 'dimension') {
    addDimension(field.name);
  } else if (field.role === 'measure') {
    addMeasure(field.name);
  }
}}
```

---

## ShelfPanel — 配置货架面板

**职责**：展示和管理已添加的维度/度量/过滤条件行（ShelfRow）。

**四行结构**：

| 行        | 组件                    | 数据                                   |
| --------- | ----------------------- | -------------------------------------- |
| 维度行    | `DimensionShelf`        | `useVBIDimensions(builder).dimensions` |
| 度量行    | `MeasureShelf`          | `useVBIMeasures(builder).measures`     |
| WHERE 行  | `WhereShelf`（如实现）  | `useVBIWhereFilter(builder).filters`   |
| HAVING 行 | `HavingShelf`（如实现） | `useVBIHavingFilter(builder).filters`  |

---

## ShelfRow — 单行货架

**职责**：展示单个已添加字段，支持右键菜单操作（aggregate/encoding/format/sort/delete）。

**右键菜单示例（DimensionShelf）**：

```tsx
const items = [
  { key: 'encoding', label: '设置编码' },
  { key: 'aggregate', label: '日期聚合' },
  { key: 'sort', label: '排序' },
  { key: 'delete', danger: true, label: '删除' },
]

onClick: ({ key }) => {
  if (key === 'delete') {
    removeDimension(item.id)
  } else if (key === 'encoding') {
    // 打开编码选择 Popover
  }
}
```

---

## ChartPanel — 图表展示面板

**职责**：包装 VSeedRender，处理加载/空状态。

```tsx
const vseed = useVBIStore((s) => s.vseed)
const loading = useVBIStore((s) => s.loading)

if (loading) return <Spin />
if (!vseed) return <Empty description="请添加维度和度量" />
return <VSeedRender vseed={vseed} />
```

---

## 组件间数据流

```
VBIStoreProvider
  └── builder: VBIChartBuilder
        ├── Toolbar → useVBIBuilder(builder) / useVBIChartType(builder) / useVBIUndoManager(builder)
        ├── FieldsPanel → useVBISchemaFields(builder) + addDimension(builder.dimensions)
        ├── ShelfPanel → useVBIDimensions(builder) / useVBIMeasures(builder) / useVBIWhereFilter(builder)
        │     └── ShelfRow → updateDimension(builder.dimensions) / removeDimension(builder.dimensions)
        └── ChartPanel → useVBIStore(s => s.vseed) → VSeedRender
```

---

## 注意事项

- **每个 practice 独立实现**所有组件，不引用其他 practice 的组件
- 组件中获取 builder 的标准方式：`const builder = useVBIStore((s) => s.builder);`
- Hooks 回调中的 `builder` 参数可以是 `undefined`，内部已有防护
- 右键菜单使用 Antd `Dropdown` + `Menu`，items 配置对象驱动
- 组件样式优先使用 Antd Design token（`theme.useToken()`），确保主题一致性
