# ChartTypeSelector

导入路径：`@visactor/vbi-react/components`

## Props

```ts
interface ChartTypeSelectorProps extends BaseComponentProps {
  builder: VBIChartBuilder
  getOptionLabel?: (chartType: string) => ReactNode
  label?: ReactNode
}
```

## 示例

```tsx
import type { VBIChartBuilder } from '@visactor/vbi'
import { ChartTypeSelector } from '@visactor/vbi-react/components'

export function TypeSelector({ builder }: { builder: VBIChartBuilder }) {
  return <ChartTypeSelector builder={builder} label="图表类型" />
}
```
