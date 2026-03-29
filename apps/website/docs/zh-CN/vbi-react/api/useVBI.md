# useVBI

## 签名

```ts
useVBI(builder: VBIChartBuilder): UseVBIReturn
```

`UseVBIReturn`:

```ts
interface UseVBIReturn {
  builder: VBIChartBuilder
  dsl: VBIChartDSL
}
```

## 说明

- 监听 `builder.doc` 的 update 事件。
- 返回最新 `dsl` 快照和原始 `builder` 实例。

## 示例

```tsx
import type { VBIChartBuilder } from '@visactor/vbi'
import { useVBI } from '@visactor/vbi-react'

export function DSLPanel({ builder }: { builder: VBIChartBuilder }) {
  const { dsl } = useVBI(builder)
  return <pre>{JSON.stringify(dsl, null, 2)}</pre>
}
```
