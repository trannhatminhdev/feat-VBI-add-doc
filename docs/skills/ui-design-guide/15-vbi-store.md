# 15. VBIStore — Zustand Store

## 源码

`practices/standard/src/model/VBIStore.ts`

## 创建 Store

```ts
export const createVBIStore = (builder?: VBIChartBuilder): VBIStoreApi => {
  return createStore<VBIStoreState>((set, get) => ({
    loading: false,
    vseed: null,
    initialized: false,
    builder: getInitialBuilder(builder),
    dsl: initialBuilder.dsl.toJSON() as VBIChartDSL,
    // ...actions
  }))
}
```

## 核心职责

1. **管理 builder 实例**：持有 `VBIChartBuilder` 引用，作为所有配置的入口
2. **VSeed 缓存**：通过 `WeakMap` 缓存 builder → VSeed 映射，避免重复构建
3. **DSL 同步**：监听 Yjs doc 变化，自动同步 DSL 快照到 `dsl` 状态
4. **VSeed 自动构建**：DSL 变化后自动调用 `builder.buildVSeed()` 生成渲染数据
5. **加载状态管理**：`loading: boolean` 标志 VSeed 构建中

## VSeedCache 机制

```ts
const vseedCache = new WeakMap<VBIChartBuilder, VSeedCacheEntry>()

type VSeedCacheEntry = {
  dslSnapshot: string // DSL JSON 字符串
  vseed: VSeed | null // 缓存的 VSeed
  pending?: Promise<VSeed | null> // 进行中的构建 Promise（防抖）
}
```

缓存命中条件：`dslSnapshot === 当前 DSL JSON`，命中时直接返回缓存，不重新构建。

## bindEvent — 核心事件循环

```ts
bindEvent: () => {
  const updateAll = async () => {
    const { dsl, snapshot } = getDslState(builder);

    // 空配置：无 VSeed
    if (builder.isEmpty()) {
      vseedCache.set(builder, { dslSnapshot: snapshot, vseed: null });
      set({ dsl, loading: false, vseed: null });
      return;
    }

    // 缓存命中：直接使用
    if (cached?.dslSnapshot === snapshot && !cached.pending) {
      set({ dsl, loading: false, vseed: cached.vseed });
      return;
    }

    // 缓存未命中：构建 VSeed
    set({ dsl, loading: true });
    try {
      const newVSeed = await loadVSeed(builder, snapshot);
      set({ dsl: currentState.dsl, vseed: newVSeed });
    } finally {
      set({ loading: false });
    }
  };

  builder.doc.on('update', updateAll);
  void updateAll(); // 初始执行一次

  return () => builder.doc.off('update', updateAll);
},
```

流程：`Yjs doc 变化` → `updateAll` → `检查缓存` → `构建 VSeed` → `更新 store 状态` → `React 重渲染`。

## 注意事项

- Store 使用 `zustand/vanilla` 的 `createStore`，**非** `create`，配合 React Context 使用
- `initialize()` 方法负责初始化 builder 和绑定事件，返回清理函数
- `logState()` 输出调试信息到控制台，包含 builder、vbi dsl、vquery dsl、vseed
- `createVBIStore` 接收可选 builder 参数，允许外部注入（用于多实例场景）
