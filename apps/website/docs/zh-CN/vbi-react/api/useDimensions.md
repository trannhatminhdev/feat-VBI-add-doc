# useDimensions

## 签名

```ts
useDimensions(builder: VBIChartBuilder): UseDimensionsReturn
```

```ts
type UseDimensionsConfig = Partial<Pick<VBIDimension, 'alias'>>

interface UseDimensionsReturn {
  addDimension: (field: string, config?: UseDimensionsConfig) => void
  dimensions: VBIDimension[]
  removeDimension: (id: string) => void
  updateDimension: (id: string, config: UseDimensionsConfig) => void
}
```

## 示例

```tsx
import type { VBIChartBuilder } from '@visactor/vbi'
import { useDimensions } from '@visactor/vbi-react'

export function DimensionsEditor({ builder }: { builder: VBIChartBuilder }) {
  const { dimensions, addDimension, updateDimension, removeDimension } = useDimensions(builder)

  return (
    <div>
      <button onClick={() => addDimension('region', { alias: '区域' })}>添加维度</button>
      {dimensions.map((item) => (
        <div key={item.id}>
          <span>{item.alias ?? item.field}</span>
          <button onClick={() => updateDimension(item.id, { alias: '地区' })}>改名</button>
          <button onClick={() => removeDimension(item.id)}>删除</button>
        </div>
      ))}
    </div>
  )
}
```
