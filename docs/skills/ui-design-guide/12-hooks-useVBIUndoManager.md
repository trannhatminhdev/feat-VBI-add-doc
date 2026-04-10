# 12. useVBIUndoManager — 撤销/重做

## 签名

```ts
const {
  canUndo, // boolean，是否可撤销
  canRedo, // boolean，是否可重做
  undo, // () => boolean，撤销操作
  redo, // () => boolean，重做操作
  clear, // (clearUndoStack?: boolean, clearRedoStack?: boolean) => void
} = useVBIUndoManager(builder)
```

## 源码

`practices/standard/src/hooks/useVBIUndoManager.ts`

## 用法示例

### 手动撤销/重做

```ts
const { canUndo, canRedo, undo, redo } = useVBIUndoManager(builder)

// 撤销
if (canUndo) {
  undo()
}

// 重做
if (canRedo) {
  redo()
}
```

### 清除历史记录

```ts
// 清除所有撤销/重做历史
clear()

// 仅清除重做栈（保留撤销历史）
clear(false, true)

// 仅清除撤销栈（保留重做历史）
clear(true, false)
```

### 键盘快捷键

hook 内部自动注册以下快捷键：

| 平台            | 撤销     | 重做                       |
| --------------- | -------- | -------------------------- |
| Windows / Linux | `Ctrl+Z` | `Ctrl+Y` 或 `Ctrl+Shift+Z` |
| macOS           | `Cmd+Z`  | `Cmd+Y` 或 `Cmd+Shift+Z`   |

**注意**：在输入框、文本域、contenteditable 元素中按下快捷键不会触发 undo/redo（`isEditableTarget` 检查）。

---

## 实现细节

- 状态订阅使用 `builder.doc.on('update', ...)`，通过 `builder.undoManager.canUndo()` / `canRedo()` 同步
- `undo()` / `redo()` 调用 `builder.undoManager.undo()` / `redo()`，返回操作是否成功
- `clear(clearUndoStack, clearRedoStack)` 转发到 `builder.undoManager.clear()`
- 键盘快捷键通过 `window.addEventListener('keydown', ...)` 注册，组件卸载时自动移除

---

## 事务与 Undo/Redo

所有通过 `builder.doc.transact()` 封装的操作（维度/度量增删改、过滤条件修改等）都自动支持撤销/重做。单个事务内的多个操作合并为一次撤销。

```ts
// 一次撤销回退整个事务
builder.doc.transact(() => {
  builder.dimensions.add('category')
  builder.measures.add('sales')
  builder.chartType.changeChartType('column')
})
// Ctrl+Z 一次撤销以上全部 3 个操作
```

---

## 注意事项

- `undo()` / `redo()` 返回 `boolean`，表示是否执行了操作（条件不满足时返回 `false`）
- 键盘快捷键在 `altKey` 被按下时不触发，避免与浏览器快捷键冲突
- `clear()` 会将 `canUndo` 和 `canRedo` 状态重置为 `false`
