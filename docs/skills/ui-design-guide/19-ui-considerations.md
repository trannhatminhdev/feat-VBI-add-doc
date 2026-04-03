# 19. UI 实践注意事项

> 本文档记录从实际 UI 开发中遇到的坑和注意点，供后续 AI 开发 VBI UI 时参考。

---

## 1. 下拉菜单浮在面板之上的问题

### 问题描述

ChartTypeSelector 等下拉组件，点击后下拉菜单被左侧面板遮挡。

### 原因

Topbar 和 Left Panel 使用了 `backdrop-filter: blur()`，会产生新的层叠上下文（stacking context）。内部的 `position: absolute` 元素即使 z-index 很高，也无法超越父级层叠上下文。

### 解决方案

**三层级 z-index + `position: fixed`**

1. 给 Topbar 加 `z-index: 100` 和 `position: relative`
2. 给左右面板加 `z-index: 10`
3. 给 Canvas 面板加 `z-index: 1`
4. 下拉触发按钮加 `position: relative`
5. 下拉菜单用 `position: fixed`，通过 `getBoundingClientRect()` 动态获取按钮坐标

```tsx
// 触发按钮
<div ref={triggerRef} style={{ position: 'relative' }}>

// 下拉菜单
<div
  style={{
    position: 'fixed',
    top: dropPos.top,    // getBoundingClientRect().bottom + 4
    left: dropPos.left,  // getBoundingClientRect().left
    zIndex: 9999,
    // ...
  }}
>
```

```tsx
// 获取坐标
useEffect(() => {
  if (open && triggerRef.current) {
    const rect = triggerRef.current.getBoundingClientRect()
    setDropPos({ top: rect.bottom + 4, left: rect.left })
  }
}, [open])
```

### 不要这样做

- ❌ 仅靠 `z-index: 1000` 而不设置 topbar z-index
- ❌ 使用 `position: absolute` + `z-index: 9999`（会被父级层叠上下文限制）

---

## 2. 浅色模式文字对比度

### 问题描述

大量组件使用硬编码颜色 `rgba(255,255,255,...)`，在浅色主题下完全不可见。

### 原因

CSS 变量 `--text-primary`、`--text-secondary`、`--text-muted` 只在 `:root` 或 `.dashboard-root-dark`/`.dashboard-root-light` 下定义，但组件内部使用了硬编码白色。

### 解决方案

**统一使用 CSS 变量**，不要硬编码 rgba 白色：

```css
/* dark 和 light 主题都需要定义这些变量 */
.dashboard-root-dark {
  --text-primary: rgba(255, 255, 255, 0.92);
  --text-secondary: rgba(255, 255, 255, 0.55);
  --text-muted: rgba(255, 255, 255, 0.3);
  --panel-input-bg: rgba(255, 255, 255, 0.06);
  --panel-input-border: rgba(255, 255, 255, 0.1);
}

.dashboard-root-light {
  --text-primary: rgba(15, 23, 42, 0.92);
  --text-secondary: rgba(15, 23, 42, 0.55);
  --text-muted: rgba(15, 23, 42, 0.35);
  --panel-input-bg: rgba(0, 0, 0, 0.04);
  --panel-input-border: rgba(0, 0, 0, 0.1);
}
```

```tsx
// ❌ 错误：硬编码白色在浅色模式下看不见
<span style={{ color: 'rgba(255,255,255,0.85)' }}>文字</span>

// ✅ 正确：使用 CSS 变量
<span style={{ color: 'var(--text-primary)' }}>文字</span>
```

### 必须用变量的场景

| 场景                          | CSS 变量                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------- |
| 主要文字                      | `--text-primary`                                                              |
| 次要文字                      | `--text-secondary`                                                            |
| 辅助文字（placeholder、标签） | `--text-muted`                                                                |
| 输入框背景                    | `--panel-input-bg`                                                            |
| 输入框边框                    | `--panel-input-border`                                                        |
| 可以硬编码的场景              | accent 颜色（`#6c8cff`）、错误色（`#f66`）、背景色（`rgba(108,140,255,0.2)`） |

---

## 3. Demo 数据初始化加载

### 问题描述

打开页面后没有数据，用户需要手动点击"加载 Demo"按钮才能看到效果。

### 解决方案

在 App 组件中，使用 `initialized` 状态 + `useRef` 标记，只在第一次初始化后自动加载：

```tsx
const autoLoaded = useRef(false)

useEffect(() => {
  if (initialized && !autoLoaded.current) {
    autoLoaded.current = true
    handleLoadDemo()
  }
}, [initialized])
```

### 不要这样做

- ❌ 在 `initialize()` 内部调用数据加载（此时 builder 可能还没就绪）
- ❌ 不加 `autoLoaded` 标记（`initialized` 状态变化会触发多次）

---

## 4. WHERE 过滤操作符与值类型

### 问题描述

维度筛选使用 `op: 'in'` + 单值时报错；多值筛选（上海,东丰）报错。

### 原因

`buildWhere.ts` 的转换规则是：

| 条件                 | 转换结果             |
| -------------------- | -------------------- |
| `op: '='` + 数组值   | `'in'`               |
| `op: '!='` + 数组值  | `'not in'`           |
| `op: '='` + 字符串值 | `=`（单值精确匹配）  |
| `op: 'in'` + 任意值  | 原样传递（可能报错） |

### 正确做法

```tsx
// UI 层：用户选择"in"（多值）时
const op = 'in'
const values = formValue.split(',').map((v) => v.trim())
// → 传给 VBI: op='=', value=['上海', '东丰']
// → buildWhere 自动转为 op='in'

// UI 层：用户选择"="（单值）时
const op = '='
const value = formValue.trim()
// → 传给 VBI: op='=', value='上海'
// → buildWhere 生成 SQL: WHERE city = '上海'
```

### 关键点

- `in` / `not in` **必须传数组值**，即使只有一个元素
- `=` / `!=` **传字符串值**（单值精确匹配）
- **不要用 `op: 'in'`**，VBI 会原样传递给 SQL，正确做法是用 `op: '='` + 数组

---

## 5. RawDatasetSource 的 TidyDatum 类型约束

### 问题描述

`localData` 直接传 `{ type: 'json', rawDataset: localData }` 时 TypeScript 报错或运行时类型不匹配。

### 原因

`RawDatasetSource.rawDataset` 的类型是 `TidyDatum[]`，其中 `TidyDatum = Record<string, number | string | null | boolean | undefined>`。不支持嵌套对象。

### 正确做法

```ts
import { type TidyDatum } from '@visactor/vquery'

type DatasetSourceValue = string | ArrayBuffer | Blob | TidyDatum[]

const toTidyDatum = (row: unknown): TidyDatum | null => {
  if (typeof row !== 'object' || row === null) return null
  const result: TidyDatum = {}
  for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
    if (typeof v === 'number' || typeof v === 'string' || v === null || typeof v === 'boolean' || v === undefined) {
      result[k] = v as number | string | null | boolean | undefined
    } else {
      return null // 嵌套对象不支持
    }
  }
  return result
}

// 转换数据
const tidyData: TidyDatum[] = []
for (const row of localData) {
  const datum = toTidyDatum(row)
  if (datum) tidyData.push(datum)
}

const ds: RawDatasetSource = { type: 'json', rawDataset: tidyData }
await vquery.createDataset(connectorId, schema, ds)
```

---

## 6. ESLint react-hooks/exhaustive-deps

### 问题

在组件中使用 `// eslint-disable-next-line react-hooks/exhaustive-deps` 后，Linter 报错："Definition for rule 'react-hooks/exhaustive-deps' was not found"。

### 原因

项目中没有安装 `eslint-plugin-react-hooks`，该规则不存在。

### 解决方案

- ❌ 不要使用 `// eslint-disable-next-line react-hooks/exhaustive-deps`
- ✅ 在 `useCallback` 的依赖数组中包含所有需要的依赖，或显式写 `// eslint-disable-next-line @typescript-eslint/no-explicit-any`

---

## 7. VSeedRender 浅色模式背景

### 问题描述

Canvas 图表区域的背景色在浅色主题下需要明确设置，否则可能显示错误。

### 解决方案

VSeedRender 的容器 div 设置 `background: var(--panel-bg-solid)` 或透明背景均可，VChart/VTable 内部会自动适配主题。但 Canvas 面板本身需要明确背景色：

```css
.canvas-chart-area {
  background: var(--panel-bg-solid);
}
```
