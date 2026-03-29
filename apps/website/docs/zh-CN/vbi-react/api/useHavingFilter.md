# useHavingFilter

## 签名

```ts
useHavingFilter(builder: VBIChartBuilder): UseHavingFilterReturn
```

```ts
type UseHavingFilterMutation = (havingFilter: HavingFilterBuilder) => void

interface UseHavingFilterReturn {
  clearHavingFilter: () => void
  havingFilter: VBIHavingGroup
  mutateHavingFilter: (mutation: UseHavingFilterMutation) => void
  removeHavingEntry: (idOrIndex: string | number) => void
}
```

## 示例

```tsx
import type { VBIChartBuilder } from '@visactor/vbi'
import { useHavingFilter } from '@visactor/vbi-react'

export function HavingActions({ builder }: { builder: VBIChartBuilder }) {
  const { havingFilter, mutateHavingFilter, clearHavingFilter } = useHavingFilter(builder)

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <button
        onClick={() =>
          mutateHavingFilter((having) => {
            having.add('sales', (node) => {
              node.setAggregate({ func: 'avg' }).setOperator('gt').setValue(1000)
            })
          })
        }
      >
        添加 Having 条件
      </button>
      <button onClick={clearHavingFilter}>清空 Having</button>
      <pre>{JSON.stringify(havingFilter, null, 2)}</pre>
    </div>
  )
}
```
