# BuilderLayout

导入路径：`@visactor/vbi-react/components`

## Props

```ts
interface BuilderLayoutProps extends BaseComponentProps {
  footer?: ReactNode
  leftPanel?: ReactNode
  leftPanelWidth?: number | string
  main?: ReactNode
  rightPanel?: ReactNode
  rightPanelWidth?: number | string
  topBar?: ReactNode
}
```

## 示例

```tsx
import { BuilderLayout } from '@visactor/vbi-react/components'

export function LayoutDemo() {
  return (
    <BuilderLayout
      topBar={<div>Top</div>}
      leftPanel={<div>Left</div>}
      main={<div>Main</div>}
      rightPanel={<div>Right</div>}
      footer={<div>Footer</div>}
    />
  )
}
```
