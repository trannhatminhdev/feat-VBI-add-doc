# FieldPanel

导入路径：`@visactor/vbi-react/components`

## Props

```ts
interface FieldPanelProps extends BaseComponentProps {
  builder: VBIChartBuilder
  dimensionOptions?: Array<SelectOption<string>>
  dimensionsTitle?: string
  measureAggregateOptions?: Array<SelectOption<NonNullable<NonNullable<VBIMeasure['aggregate']>['func']>>>
  measureEncodingOptions?: Array<SelectOption<NonNullable<VBIMeasure['encoding']>>>
  measureOptions?: Array<SelectOption<string>>
  measuresTitle?: string
  title?: string
}
```

## 示例

```tsx
import type { VBIChartBuilder } from '@visactor/vbi'
import { FieldPanel } from '@visactor/vbi-react/components'

export function Panel({ builder }: { builder: VBIChartBuilder }) {
  return (
    <FieldPanel
      builder={builder}
      dimensionOptions={[{ label: '区域', value: 'region' }]}
      measureOptions={[{ label: '销售额', value: 'sales' }]}
    />
  )
}
```
