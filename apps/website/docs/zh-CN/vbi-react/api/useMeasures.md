# useMeasures

## 签名

```ts
useMeasures(builder: VBIChartBuilder): UseMeasuresReturn
```

```ts
type UseMeasuresConfig = Partial<Pick<VBIMeasure, 'aggregate' | 'alias' | 'encoding'>>

interface UseMeasuresReturn {
  addMeasure: (field: string, config?: UseMeasuresConfig) => void
  measures: VBIMeasure[]
  removeMeasure: (id: string) => void
  updateMeasure: (id: string, config: UseMeasuresConfig) => void
}
```

## 示例

```tsx
import type { VBIChartBuilder } from '@visactor/vbi'
import { useMeasures } from '@visactor/vbi-react'

export function MeasuresEditor({ builder }: { builder: VBIChartBuilder }) {
  const { measures, addMeasure, updateMeasure } = useMeasures(builder)

  return (
    <div>
      <button onClick={() => addMeasure('sales', { alias: '销售额', encoding: 'yAxis' })}>添加度量</button>
      {measures.map((item) => (
        <button
          key={item.id}
          onClick={() => updateMeasure(item.id, { aggregate: { func: 'avg' }, encoding: 'color' })}
        >
          {item.field}
        </button>
      ))}
    </div>
  )
}
```
