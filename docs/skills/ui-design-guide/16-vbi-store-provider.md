# 16. VBIStoreProvider — Context Provider

## 源码

`practices/standard/src/model/VBIStoreProvider.tsx`

## 签名

```tsx
// Provider
;<VBIStoreProvider builder={builder}>{children}</VBIStoreProvider>

// Consumer hook
const storeState = useVBIStore((state) => state)
```

## 完整实现

```tsx
const VBIStoreContext = createContext<VBIStoreApi | null>(null)

export const VBIStoreProvider = ({ builder, children }: VBIStoreProviderProps) => {
  const storeRef = useRef<VBIStoreApi | null>(null)

  // 仅首次创建 store（SSR 安全 + 热更新安全）
  if (!storeRef.current) {
    storeRef.current = createVBIStore(builder)
  }

  return <VBIStoreContext.Provider value={storeRef.current}>{children}</VBIStoreContext.Provider>
}

export const useVBIStore = <T,>(selector: (state: VBIStoreState) => T) => {
  const store = useContext(VBIStoreContext)

  if (!store) {
    throw new Error('useVBIStore must be used within VBIStoreProvider')
  }

  return useStore(store, selector)
}
```

## 层级结构

```
VBIStoreProvider
  ├── 创建 / 持有 VBIStoreApi（Zustand store 实例）
  └── Context.Provider
        └── App
              ├── Toolbar（useVBIStore → builder / locale / theme / limit）
              ├── FieldsPanel（useVBIStore → builder / schemaFields）
              ├── ShelfPanel（useVBIStore → builder / dimensions / measures）
              └── ChartPanel（useVBIStore → vseed / loading）
```

## 使用方式

### 在 App 入口包装

```tsx
// App.tsx
import { VBIStoreProvider } from 'src/model'
import { defaultBuilder } from 'src/utils/demoConnector'

export const App = () => {
  return (
    <VBIStoreProvider builder={defaultBuilder}>
      <AppContent />
    </VBIStoreProvider>
  )
}
```

### 在组件内获取状态

```tsx
// ChartPanel.tsx
import { useVBIStore } from 'src/model'

export const ChartPanel = () => {
  const vseed = useVBIStore((s) => s.vseed)
  const loading = useVBIStore((s) => s.loading)

  return loading ? <Spin /> : vseed ? <VSeedRender vseed={vseed} /> : null
}
```

## 注意事项

- `storeRef` 使用 `useRef` 确保 store 实例在 SSR 和 React 热更新中保持稳定
- `VBIStoreProvider` 仅创建一次 store，后续渲染不会重新创建
- `useVBIStore` 在 Context 外调用会抛出异常，确保使用安全
- `useVBIStore` 使用 Zustand 的 `useStore(store, selector)` 而非 `useStore(selector)`，以支持多 store 场景
