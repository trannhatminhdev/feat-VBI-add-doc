# 4. Hooks 总览与导入规范

每个 practice 有自己独立的 hooks 集，通过 `src/hooks/index.ts` 统一导出。

---

## 4.1 导入规范

**来自目标 practice 的 `src/hooks/`，不是 `@visactor/vbi-react`**：

```ts
// ✅ 正确：从当前 practice 的 hooks 目录导入
import {
  useVBIDimensions,
  useVBIMeasures,
  useVBIWhereFilter,
  useVBIHavingFilter,
  useVBIChartType,
  useVBIBuilder,
  useVBISchemaFields,
  useVBIUndoManager,
  useVBIStore,
} from 'src/hooks'

// ❌ 错误：不能从 @visactor/vbi-react 导入这些 hooks
import { useDimensions, useMeasures } from '@visactor/vbi-react'
// 上面这两套 hooks 签名完全不同，会导致 builder 参数类型不匹配
```

**vbi-react-starter 是唯一例外**，它使用 `@visactor/vbi-react` 包：

```ts
// vbi-react-starter 使用这个导入方式
import { useVBI, useDimensions, useMeasures } from '@visactor/vbi-react'
```

---

## 4.2 Hooks 清单

| Hook                 | 职责                                         | 源码位置                          |
| -------------------- | -------------------------------------------- | --------------------------------- |
| `useVBIDimensions`   | 维度状态订阅 + add/update/remove（回调模式） | `src/hooks/useVBIDimensions.ts`   |
| `useVBIMeasures`     | 度量状态订阅 + add/update/remove（回调模式） | `src/hooks/useVBIMeasures.ts`     |
| `useVBIWhereFilter`  | WHERE 过滤状态订阅 + 完整操作集              | `src/hooks/useVBIWhereFilter.ts`  |
| `useVBIHavingFilter` | HAVING 过滤状态订阅 + 完整操作集             | `src/hooks/useVBIHavingFilter.ts` |
| `useVBIChartType`    | 图表类型状态订阅 + changeChartType           | `src/hooks/useVBIChartType.ts`    |
| `useVBIBuilder`      | locale/theme/limit 全局配置                  | `src/hooks/useVBIBuilder.ts`      |
| `useVBISchemaFields` | 字段列表（带 role/type 分类）                | `src/hooks/useVBISchemaFields.ts` |
| `useVBIUndoManager`  | Undo/Redo 状态订阅                           | `src/hooks/useVBIUndoManager.ts`  |
| `useVBIStore`        | 获取 store 实例                              | `src/hooks/useVBIStore.ts`        |

---

## 4.3 Hooks 与 Builder API 的关系

所有 hooks 本质是对 Builder API 的 React 封装：

```
Builder API（同步）
  ↓ useBuilderDocState（Yjs → React 状态桥接）
  ↓ 包装成 React Hook
React Component（useVBIDimensions 等）
```

**所有 mutations（add/update/remove）通过 `builder.doc.transact()` 封装**，保证 undo/redo 正确性：

```ts
// hooks 内部实现示意
const addDimension = (field, callback) => {
  builder.doc.transact(() => {
    builder.dimensions.add(field, callback)
  })
}
```

---

## 4.4 builder 参数说明

除 `useVBIStore` 外，所有 hooks 都接受 `builder: VBIChartBuilder | undefined`：

```ts
// builder 参数是可选的，当传入 undefined 时 hook 无操作
const { dimensions, addDimension } = useVBIDimensions(builder) // builder 可为 undefined
const { schemaFields } = useVBISchemaFields(undefined) // 安全，不报错
```

通常从 `useVBIStore` 获取 builder：

```ts
const builder = useVBIStore((s) => s.builder)
const { dimensions } = useVBIDimensions(builder)
```
