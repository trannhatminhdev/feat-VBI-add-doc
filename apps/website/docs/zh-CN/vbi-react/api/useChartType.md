# useChartType

## 签名

```ts
useChartType(builder: VBIChartBuilder): UseChartTypeReturn
```

```ts
interface UseChartTypeReturn {
  availableChartTypes: string[]
  chartType: string
  setChartType: (chartType: string) => void
}
```

## 示例

```tsx
import type { VBIChartBuilder } from '@visactor/vbi'
import { useChartType } from '@visactor/vbi-react'

export function ChartTypeSwitcher({ builder }: { builder: VBIChartBuilder }) {
  const { chartType, availableChartTypes, setChartType } = useChartType(builder)

  return (
    <select value={chartType} onChange={(event) => setChartType(event.target.value)}>
      {availableChartTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  )
}
```
