# useVSeed

## 签名

```ts
useVSeed(builder: VBIChartBuilder, options?: UseVSeedOptions): UseVSeedReturn
```

`UseVSeedOptions`:

```ts
interface UseVSeedOptions {
  debounce?: number
  onError?: (error: Error) => void
}
```

`UseVSeedReturn`:

```ts
interface UseVSeedReturn {
  error: Error | null
  loading: boolean
  refetch: () => Promise<void>
  vseed: VSeedDSL | null
}
```

## 说明

- 在 DSL 更新后自动触发 `builder.buildVSeed()`。
- 内置中止控制，较新的构建会覆盖旧请求。

## 示例

```tsx
import type { VBIChartBuilder } from '@visactor/vbi'
import { useVSeed } from '@visactor/vbi-react'

export function Preview({ builder }: { builder: VBIChartBuilder }) {
  const { vseed, loading, error, refetch } = useVSeed(builder, { debounce: 200 })

  if (error) return <button onClick={() => void refetch()}>重试</button>
  if (loading || !vseed) return <div>Loading...</div>
  return <pre>{JSON.stringify(vseed, null, 2)}</pre>
}
```
