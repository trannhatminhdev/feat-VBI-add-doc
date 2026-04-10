# 14. VSeedRender — 渲染组件

VSeedRender 是每个 practice **独立实现**的组件，负责将 `VSeed`（渲染数据）渲染为实际的 VChart/VTable 图表或表格。

## 源码

`practices/standard/src/components/Render/VSeedRender.tsx`

## 签名

```ts
// React 组件
<VSeedRender vseed={vseed} />
```

```tsx
export const VSeedRender = (props: { vseed: VSeed }) => {
  const { vseed } = props
  const ref = useRef<HTMLDivElement>(null)
  // ...渲染逻辑
  return <div ref={ref} style={{ height: '100%', width: '100%', minHeight: 300 }} />
}
```

## 渲染流程

```
VSeed (VSeedDSL)
  ↓ VSeedBuilder.from(vseed).build()
  ↓ 转为 VChart Spec / VTable Spec
  ↓ 根据类型实例化对应渲染器
  ↓ 渲染到 ref DOM 节点
```

## 支持的渲染类型

| 类型       | 判断函数              | 渲染器       | 说明                         |
| ---------- | --------------------- | ------------ | ---------------------------- |
| PivotChart | `isPivotChart(vseed)` | `PivotChart` | 透视图表，支持图例交互过滤   |
| PivotTable | `isPivotTable(vseed)` | `PivotTable` | 透视表格                     |
| ListTable  | `isTable(vseed)`      | `ListTable`  | 列表表格                     |
| VChart     | `isVChart(vseed)`     | `VChart`     | 标准图表（柱状/折线/饼图等） |

**注意**：`isPivotTable` 需在 `isTable` 之前判断，因为 PivotTable 是 Table 的子类型。

## PivotChart 图例交互

PivotChart 支持两种图例事件：

### legend_item_click — 单选图例项

```ts
tableInstance.on('legend_item_click', (args: unknown) => {
  const rawValue = (args as { value?: unknown }).value
  const filteredValues = Array.isArray(rawValue) ? rawValue : [rawValue]
  tableInstance.updateFilterRules([
    {
      filterKey: ColorIdEncoding,
      filteredValues,
    },
  ])
})
```

### legend_change — 范围拖动

```ts
tableInstance.on('legend_change', (args: unknown) => {
  const range = toNumericRange((args as { value?: unknown }).value)
  if (!range) return
  const [minValue, maxValue] = range
  tableInstance.updateFilterRules([
    {
      filterFunc: (record: PivotRecord) => {
        const colorKey = record[ColorIdEncoding]
        if (typeof colorKey !== 'string') return false
        const rawValue = record[colorKey]
        if (typeof rawValue !== 'number') return false
        return rawValue >= minValue && rawValue <= maxValue
      },
    },
  ])
})
```

## 完整示例

```tsx
import { VSeedRender } from 'src/components/Render/VSeedRender'
import { useVBIStore } from 'src/model'

export const ChartPanel = () => {
  const vseed = useVBIStore((state) => state.vseed)
  const loading = useVBIStore((state) => state.loading)

  if (loading) {
    return <Spin>加载中...</Spin>
  }

  if (!vseed) {
    return <Empty description="请添加维度和度量" />
  }

  return <VSeedRender vseed={vseed} />
}
```

## 依赖注册

VSeedRender 顶部需注册所有依赖：

```tsx
import { registerAll } from '@visactor/vtable'
import VChart from '@visactor/vchart'

registerAll() // 注册 VTable 所有组件
register.chartModule('vchart', VChart) // 注册 VChart
```

## 注意事项

- VSeedRender 是 **每个 practice 独立实现的**，路径和实现可能不同
- 组件内部通过 `useEffect` 监听 `vseed` 变化，自动创建/销毁图表实例
- 每个 `useEffect` 返回清理函数，调用实例的 `release()` 防止内存泄漏
- VSeed 是 VBI 框架内部生成的，AI 无需了解其内部结构，只需传给 VSeedRender
