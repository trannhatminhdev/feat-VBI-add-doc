# 13. useVBIStore — Store Hook

## 签名

```ts
const storeState = useVBIStore(selector)
```

等价于：

```ts
const storeState = useVBIStore((state) => state) // 获取全部状态
const builder = useVBIStore((state) => state.builder) // 仅取 builder
const vseed = useVBIStore((state) => state.vseed) // 仅取 vseed
const loading = useVBIStore((state) => state.loading) // 仅取 loading
```

## 源码

`practices/standard/src/hooks/useVBIStore.ts`

实际实现（thin wrapper）：

```ts
export const useVBIStoreHook = (): VBIStoreState => {
  return useVBIStore((state) => state)
}
```

`useVBIStore` 来自 `VBIStoreProvider` 的 Context，**必须在 `VBIStoreProvider` 内使用**。

---

## VBIStoreState 完整类型

```ts
export interface VBIStoreState {
  loading: boolean // VSeed 构建中标志
  vseed: VSeed | null // 当前 VSeed 实例（渲染数据）
  builder: VBIChartBuilder // VBI 构建器（配置层）
  initialized: boolean // 是否已初始化
  dsl: VBIChartDSL // 当前 DSL 快照

  initialize: (builder?: VBIChartBuilder) => DestroyCallback
  bindEvent: () => DestroyCallback
  logState: () => Promise<void>

  setDsl: (dsl: VBIChartDSL) => void
  setLoading: (loading: boolean) => void
  setVSeed: (vseed: VSeed | null) => void
}
```

## 用法示例

### 获取 builder（最常用）

```ts
const builder = useVBIStore((state) => state.builder)
// 然后传递给其他 hooks
const { dimensions } = useVBIDimensions(builder)
const { measures } = useVBIMeasures(builder)
```

### 获取 VSeed（用于渲染）

```ts
const vseed = useVBIStore((state) => state.vseed)
if (vseed) {
  // 传给 VSeedRender 组件
}
```

### 获取加载状态

```ts
const loading = useVBIStore((state) => state.loading);
if (loading) {
  return <Spin>图表加载中...</Spin>;
}
```

### 打印调试信息

```ts
const { logState } = useVBIStore((state) => ({
  logState: state.logState,
}))
await logState()
// 控制台输出 builder、vbi dsl、vquery dsl、vseed
```

---

## 注意事项

- **必须在 `VBIStoreProvider` 内部调用**，否则抛出 `Error: useVBIStore must be used within VBIStoreProvider`
- `builder` 是最常消费的字段，其他 hooks 都需要它作为参数
- `vseed` 为 `null` 时（初始状态或加载中）不应传给 `VSeedRender`
- `logState()` 异步调用，在控制台输出完整调试信息
