# 组件化布局

该示例展示 `BuilderLayout` + `FieldPanel` + `ChartRenderer` + `ChartTypeSelector`。

## 代码片段

```tsx
import type { VBIChartBuilder } from '@visactor/vbi'
import {
  BuilderLayout,
  ChartRenderer,
  ChartTypeSelector,
  FieldPanel,
} from '@visactor/vbi-react/components'

export function LayoutDemo({ builder }: { builder: VBIChartBuilder }) {
  return (
    <BuilderLayout
      topBar={<ChartTypeSelector builder={builder} />}
      leftPanel={
        <FieldPanel
          builder={builder}
          dimensionOptions={[{ label: '区域', value: 'region' }]}
          measureOptions={[{ label: '销售额', value: 'sales' }]}
        />
      }
      main={<ChartRenderer builder={builder} debounce={100} />}
    />
  )
}
```

## 预期效果

- 顶部可切换图表类型，左侧可增删维度/度量，主区显示图表 DSL 预览。
- 字段操作后主区内容会自动刷新，无需手动触发。
- 当构建失败时，`ChartRenderer` 会显示默认错误与重试按钮。
