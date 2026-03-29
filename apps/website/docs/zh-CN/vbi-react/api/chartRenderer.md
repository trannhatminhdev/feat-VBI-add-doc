# ChartRenderer

导入路径：`@visactor/vbi-react/components`

## Props

```ts
interface ChartRendererProps extends BaseComponentProps {
  builder: VBIChartBuilder
  debounce?: number
  emptyFallback?: ReactNode
  loadingFallback?: ReactNode
  renderError?: (error: Error, refetch: () => Promise<void>) => ReactNode
  renderVSeed?: (vseed: VSeedDSL) => ReactNode
}
```

## 示例

```tsx
import type { VBIChartBuilder } from '@visactor/vbi'
import { ChartRenderer } from '@visactor/vbi-react/components'

export function Renderer({ builder }: { builder: VBIChartBuilder }) {
  return (
    <ChartRenderer
      builder={builder}
      debounce={0}
      renderVSeed={(vseed) => <pre>{JSON.stringify(vseed, null, 2)}</pre>}
    />
  )
}
```
