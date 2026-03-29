# useWhereFilter

## 签名

```ts
useWhereFilter(builder: VBIChartBuilder): UseWhereFilterReturn
```

```ts
type UseWhereFilterMutation = (whereFilter: WhereFilterBuilder) => void

interface UseWhereFilterReturn {
  clearWhereFilter: () => void
  mutateWhereFilter: (mutation: UseWhereFilterMutation) => void
  removeWhereEntry: (idOrIndex: string | number) => void
  whereFilter: VBIWhereGroup
}
```

## 示例

```tsx
import type { VBIChartBuilder } from '@visactor/vbi'
import { useWhereFilter } from '@visactor/vbi-react'

export function WhereActions({ builder }: { builder: VBIChartBuilder }) {
  const { whereFilter, mutateWhereFilter, clearWhereFilter } = useWhereFilter(builder)

  return (
    <div>
      <button
        onClick={() =>
          mutateWhereFilter((where) => {
            where.add('sales', (node) => node.setOperator('gt').setValue(100))
          })
        }
      >
        增加条件
      </button>
      <button onClick={clearWhereFilter}>清空</button>
      <pre>{JSON.stringify(whereFilter, null, 2)}</pre>
    </div>
  )
}
```
