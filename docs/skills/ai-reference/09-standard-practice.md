# 9. Standard Practice 面板组件速查（拓展了解）

> 本节为拓展内容。Standard Practice 是基于 VBI + VBI-react 的完整 UI 实现，AI 了解其结构有助于理解如何操作前端面板。

## 9.1 目录结构

```
practices/standard/src/
├── App/
│   ├── App.tsx           # 应用主入口，管理布局、主题、全屏
│   └── components/
│       ├── ShelfPanel.tsx     # 四行货架面板（维度/度量/Where/Having）
│       ├── FilterRootOperatorToggle.tsx  # 过滤根操作符切换（and/or）
│       └── ShelfRow.tsx       # 货架行组件
├── components/
│   ├── Render/
│   │   └── VSeedRender.tsx   # VSeed 渲染器（内部实现，AI 不可直接调用）
│   ├── Fields/
│   │   └── FieldList/index.tsx  # 左侧字段列表面板
│   ├── Shelves/
│   │   ├── shelves/
│   │   │   ├── DimensionShelf.tsx  # 维度货架（可拖拽标签）
│   │   │   ├── MeasureShelf.tsx    # 度量货架
│   │   │   ├── WhereShelf.tsx      # WHERE 过滤货架
│   │   │   └── HavingShelf.tsx     # HAVING 过滤货架
│   │   ├── dnd/                   # DnD Kit 拖拽上下文
│   │   │   ├── ShelfDndProvider.tsx
│   │   │   └── types.ts
│   │   ├── utils/
│   │   │   └── dimensionDateAggregateUtils.ts  # 日期维度聚合工具
│   │   └── common/
│   │       ├── FieldShelf.tsx      # 通用货架标签组件
│   │       └── openShelfRenameModal.tsx  # 重命名弹窗
│   └── Toolbar/               # 工具栏（undo/redo/主题切换/全屏）
├── model/
│   ├── VBIStore.ts           # Zustand store（builder 状态 + VSeed 缓存）
│   └── VBIStoreProvider.tsx  # React Context provider
├── hooks/                    # React hooks（基于 vbi-react 封装的业务 hooks）
│   ├── useVBIBuilder.ts      # 全局配置（locale/theme/limit）
│   ├── useVBIDimensions.ts   # 维度操作
│   ├── useVBIMeasures.ts     # 度量操作
│   ├── useVBIWhereFilter.ts  # WHERE 过滤
│   ├── useVBIHavingFilter.ts  # HAVING 过滤
│   ├── useVBISchemaFields.ts # 字段列表（带 role/type）
│   ├── useVBIUndoManager.ts  # Undo/Redo
│   ├── useVBIStore.ts        # store hook
│   └── useVBIChartType.ts    # 图表类型
└── utils/
    ├── demoConnector.ts       # Demo 数据源 Connector
    └── fieldRole.ts          # 字段角色映射
```

## 9.2 字段角色（FieldRole）

```ts
// practices/standard/src/utils/fieldRole.ts
type FieldRole = 'dimension' | 'measure'

// 根据字段类型自动推断角色
getFieldRoleBySchemaType('number') // → 'measure'
getFieldRoleBySchemaType('string') // → 'dimension'
getFieldRoleBySchemaType('date') // → 'dimension'
```

## 9.3 拖拽字段添加到货架

使用 `@dnd-kit/core` 实现字段到货架的拖拽：

```tsx
import { useDraggable } from '@dnd-kit/core'
import { createSchemaFieldDragId, type SchemaFieldDragData } from 'src/components/Shelves/dnd'

// 创建拖拽 ID
const dragId = createSchemaFieldDragId({
  field: 'category',
  role: 'dimension',
})

// 拖拽数据格式
const dragData: SchemaFieldDragData = {
  kind: 'schema-field',
  payload: {
    field: 'category',
    type: 'string',
    role: 'dimension',
  },
  label: 'category',
}
```

## 9.4 Schema 字段类型

```ts
// practices/standard/src/hooks/useVBISchemaFields.ts
interface VBISchemaField {
  name: string // 字段名
  type: string // 'string' | 'number' | 'date' | 'datetime' | 'timestamp' | 'boolean'
  role: FieldRole // 'dimension' | 'measure'
  isDate: boolean // 是否为日期类型
}

// 使用
const { schemaFields, fieldRoleMap, fieldTypeMap } = useVBISchemaFields(builder)
```

## 9.5 日期维度聚合工具

```ts
// src/components/Shelves/utils/dimensionDateAggregateUtils.ts
import {
  formatDimensionDateAggregate,
  getDefaultDimensionDateAggregate,
  getDimensionDateAggregateItems,
  isDateDimensionField,
  normalizeDimensionDateAggregate,
} from 'src/components/Shelves/utils/dimensionDateAggregateUtils'

// 获取日期字段的默认聚合方式
const defaultAgg = getDefaultDimensionDateAggregate()
// → { func: 'toMonth' }

// 获取所有可用的日期聚合选项
const items = getDimensionDateAggregateItems()
// → [{ func: 'toYear', label: '年' }, { func: 'toMonth', label: '月' }, ...]

// 格式化显示
formatDimensionDateAggregate({ func: 'toQuarter' }) // → '季度'
```

## 9.6 类型守卫

从 `@visactor/vbi` 导出的类型守卫（`filter-guards.ts`），用于判断 Where/Having 条件树中的节点类型：

```ts
import { isVBIFilter, isVBIWhereGroup, isVBIHavingFilter } from '@visactor/vbi';
import type { VBIWhereClause, VBIHavingClause } from '@visactor/vbi';

// 判断 Where 条件节点类型
const item: VBIWhereClause = /* ... */;
if (isVBIFilter(item)) {
  // item 是叶子过滤节点 VBIWhereFilter
  console.log(item.field, item.op, item.value);
} else if (isVBIWhereGroup(item)) {
  // item 是嵌套组 VBIWhereGroup
  console.log(item.op, item.conditions);
}

// 判断 Having 条件节点类型
const havingItem: VBIHavingClause = /* ... */;
if (isVBIHavingFilter(havingItem)) {
  // 是叶子节点，有 aggregate 属性
  console.log(havingItem.aggregate);
}
```

| 类型守卫                  | 说明                                          | 源码位置           |
| ------------------------- | --------------------------------------------- | ------------------ |
| `isVBIFilter(item)`       | 判断是否为叶子过滤节点（VBIWhereFilter）      | `filter-guards.ts` |
| `isVBIWhereGroup(item)`   | 判断是否为 Where 嵌套组（VBIWhereGroup）      | `filter-guards.ts` |
| `isVBIHavingFilter(item)` | 判断是否为 HAVING 叶子节点（VBIHavingFilter） | `filter-guards.ts` |
