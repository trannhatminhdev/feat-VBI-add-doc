# VBI UndoManager 设计方案

## 概述

为 VBIBuilder 增加自定义 UndoManager 类，提供基于 YJS 的撤销/重做功能。该类封装 YJS UndoManager，提供更友好的 API 风格，便于 API 文档生成。

## 背景

VBIBuilder 已集成 YJS 实现协同编辑，现有 `undoManager: Y.UndoManager` 直接暴露了 YJS 类。为提供更一致的 API 风格和更好的可维护性，需要封装一层自定义 UndoManager 类。

## 目录结构

```
packages/vbi/src/builder/
├── undo-manager.ts        # 新建: UndoManager 类
├── vbi-builder.ts         # 修改: 使用自定义 UndoManager
└── index.ts              # 修改: 导出 UndoManager
```

## 设计

### UndoManager 类

```typescript
import * as Y from 'yjs'

/**
 * @description 撤销/重做管理器，提供基于 YJS 的撤销和重做功能，支持栈管理和历史清除操作
 */
export class UndoManager {
  private manager: Y.UndoManager

  /**
   * @description 构造函数
   * @param scope - YJS 文档或类型作用域，用于定义撤销/重做的追踪范围
   */
  constructor(scope: Y.AbstractStructuredClone<any> | Y.Doc) {
    this.manager = new Y.UndoManager(scope)
  }

  /**
   * @description 撤销上一次修改
   * @returns 是否成功撤销
   */
  undo(): boolean {
    return this.manager.undo() !== null
  }

  /**
   * @description 重做被撤销的修改
   * @returns 是否成功重做
   */
  redo(): boolean {
    return this.manager.redo() !== null
  }

  /**
   * @description 检查是否有可撤销的操作
   * @returns 是否可以撤销
   */
  canUndo(): boolean {
    return this.manager.canUndo()
  }

  /**
   * @description 检查是否有可重做的操作
   * @returns 是否可以重做
   */
  canRedo(): boolean {
    return this.manager.canRedo()
  }

  /**
   * @description 清除历史记录
   * @param clearUndoStack - 是否清除撤销栈，默认 true
   * @param clearRedoStack - 是否清除重做栈，默认 true
   */
  clear(clearUndoStack?: boolean, clearRedoStack?: boolean): void {
    this.manager.clear(clearUndoStack, clearRedoStack)
  }
}
```

### VBIBuilder 修改

将 `undoManager: Y.UndoManager` 改为 `undoManager: UndoManager`，构造函数中实例化自定义 UndoManager。

### API 生成器注册

在 `scripts/build-api.mjs` 的 `BUILDER_CONFIG` 中添加：

```javascript
{ name: 'undoManager', label: 'undo-manager', file: 'undo-manager.ts', category: 'utilities' }
```

### 测试

- **单元测试**: `tests/builder/undo-manager.test.ts`
- **集成测试**: `tests/examples/undoManager/undo-redo.json`

## 验收标准

1. `builder.undoManager.undo()` 可正常撤销
2. `builder.undoManager.redo()` 可正常重做
3. `builder.undoManager.canUndo()` 正确返回是否有可撤销操作
4. `builder.undoManager.canRedo()` 正确返回是否有可重做操作
5. `builder.undoManager.clear()` 可清除历史记录
6. typecheck 通过
7. lint 通过
8. test 通过
9. `pnpm g` 生成 API 文档成功
